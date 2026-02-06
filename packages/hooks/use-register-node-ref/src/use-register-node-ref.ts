import { useGetLatest } from "@utilityjs/use-get-latest";
import { useCallback, useRef, type DependencyList } from "react";

/** Function type for cleanup operations returned by the callback */
export type Destructor = () => void | undefined;

/**
 * Callback function type that receives a DOM node and optionally returns a cleanup function.
 *
 * @template T The type of HTML element
 * @param node The DOM node that was mounted
 * @returns Optional cleanup function to run when the node unmounts
 */
export type Callback<T extends HTMLElement> = (node: T) => void | Destructor;

/**
 * A React hook that helps you run code when a DOM node mounts/unmounts.
 *
 * This hook provides a way to execute code when a DOM element is mounted
 * and optionally run cleanup code when it unmounts. It's useful for setting up
 * event listeners, observers, or other DOM-related side effects.
 *
 * @template T The type of HTML element
 * @param callback Function to execute when the node mounts, can return a cleanup function
 * @param deps Dependency array to control when the callback should be re-registered
 * @returns A ref callback function to attach to a DOM element
 *
 * @example
 * ```tsx
 * function Component() {
 *   const registerRef = useRegisterNodeRef<HTMLDivElement>((node) => {
 *     console.log('Node mounted:', node);
 *
 *     // Setup event listener
 *     const handleClick = () => console.log('Clicked!');
 *     node.addEventListener('click', handleClick);
 *
 *     // Return cleanup function
 *     return () => {
 *       node.removeEventListener('click', handleClick);
 *       console.log('Node unmounted');
 *     };
 *   });
 *
 *   return <div ref={registerRef}>Click me</div>;
 * }
 * ```
 */
export const useRegisterNodeRef = <T extends HTMLElement>(
  callback: Callback<T>,
  deps: DependencyList = [],
): ((node: T | null) => void) => {
  const cleanupRef = useRef<Destructor | null>(null);
  const cachedCallback = useGetLatest(callback);

  const registerRef = useCallback(
    (node: T | null) => {
      if (cleanupRef.current !== null) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (node) {
        const cleanup = cachedCallback.current(node);

        if (cleanup) cleanupRef.current = cleanup;
        else cleanupRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  return registerRef;
};
