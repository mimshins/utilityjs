import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";
import { useEffect, useState } from "react";
import {
  cancelIdleCallback,
  createObserver,
  getObserver,
  requestIdleCallback,
} from "./utils.ts";

export type Options = {
  once?: boolean;
  disabled?: boolean;
};

export type Consumer = {
  registerNode: ReturnType<typeof useRegisterNodeRef>;
  isInViewport: boolean;
};

export const useIsInViewport = (
  options?: IntersectionObserverInit & Options,
): Consumer => {
  const {
    threshold = [0, 1],
    root = null,
    rootMargin = "0px",
    once = false,
    disabled = false,
  } = options || {};

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
        { threshold, root, rootMargin },
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
