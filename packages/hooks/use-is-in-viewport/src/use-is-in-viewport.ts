import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useEffect, useState } from "react";
import {
  cancelIdleCallback,
  createObserver,
  getObserver,
  requestIdleCallback,
} from "./utils.ts";

/** Options for configuring viewport detection behavior */
export type Options = {
  /**
   * Whether to stop observing after the first intersection.
   *
   * @default false
   */
  once?: boolean;

  /**
   * Whether to disable the viewport detection.
   *
   * @default false
   */
  disabled?: boolean;
};

/** Return type of the useIsInViewport hook */
export type Consumer = {
  /**
   * Function to register a DOM node for viewport observation
   */
  registerNode: ReturnType<typeof useRegisterNodeRef>;
  /**
   * Boolean indicating if the element is currently in the viewport
   */
  isInViewport: boolean;
};

/**
 * A React hook that detects when an element enters or leaves the viewport.
 * Uses the Intersection Observer API for efficient viewport detection.
 *
 * @param options Configuration options combining IntersectionObserverInit and custom options
 * @returns An object containing registerNode function and isInViewport boolean
 *
 * @example
 * ```tsx
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { registerNode, isInViewport } = useIsInViewport({
 *     threshold: 0.1,
 *     once: true
 *   });
 *
 *   return (
 *     <div ref={registerNode}>
 *       {isInViewport ? (
 *         <img src={src} alt={alt} />
 *       ) : (
 *         <div>Loading...</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function AnimatedSection() {
 *   const { registerNode, isInViewport } = useIsInViewport({
 *     threshold: 0.5,
 *     rootMargin: "50px"
 *   });
 *
 *   return (
 *     <section
 *       ref={registerNode}
 *       className={isInViewport ? "animate-in" : "animate-out"}
 *     >
 *       Content that animates when in viewport
 *     </section>
 *   );
 * }
 * ```
 */
export const useIsInViewport = (
  options?: IntersectionObserverInit & Options,
): Consumer => {
  const {
    threshold = [0, 1],
    root = null,
    rootMargin = "0px",
    once = false,
    disabled = false,
  } = options ?? {};

  const [isInViewport, setIsInViewport] = useState(false);

  const registerNode = useRegisterNodeRef(
    node => {
      if (disabled) return;

      const observer = createObserver(
        node,
        (inViewState, isIntersected) => {
          if (isIntersected && once) observer?.unobserve();
          setIsInViewport(inViewState);
        },
        {
          threshold,
          root,
          rootMargin,
        },
      );

      if (!observer) return;

      observer.observe();

      return () => void observer.unobserve();
    },
    [disabled],
  );

  useEffect(() => {
    if (getObserver() || isInViewport) return;

    const idleCallback = requestIdleCallback(() => void setIsInViewport(true));

    return () => cancelIdleCallback(idleCallback);
  }, [isInViewport]);

  return { registerNode, isInViewport };
};
