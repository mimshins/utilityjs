import { useCallback, useRef, useState } from "react";
import type { Debounced, RefreshOptions } from "./types.ts";
import { setRefreshRate } from "./utils.ts";

/**
 * A React hook that handles element resizes using native ResizeObserver.
 *
 * This hook provides an easy way to track the dimensions of DOM elements
 * and respond to size changes. It uses the native ResizeObserver API
 * and supports debouncing and throttling for performance optimization.
 *
 * @param refreshOptions Configuration for debouncing/throttling resize events
 * @returns Object containing width, height, and registerNode function
 *
 * @example
 * ```tsx
 * function ResizableComponent() {
 *   const { width, height, registerNode } = useResizeSensor();
 *
 *   return (
 *     <div ref={registerNode} style={{ resize: 'both', overflow: 'auto' }}>
 *       <p>Width: {width}px</p>
 *       <p>Height: {height}px</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useResizeSensor = (
  refreshOptions?: RefreshOptions,
): {
  width: number;
  height: number;
  registerNode: <T extends HTMLElement>(node: T | null) => void;
} => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const makeResizeCallback = useCallback(
    (unsubscribed: boolean) =>
      setRefreshRate(entries => {
        entries.forEach(entry => {
          if (unsubscribed) return;

          const { width, height } = entry.contentRect;

          setSize(prevSize => {
            if (prevSize.width === width && prevSize.height === height) {
              return prevSize;
            }

            return { width, height };
          });
        });
      }, refreshOptions),
    [refreshOptions],
  );

  const registerCleanupRef = useRef<(() => void) | null>(null);

  const registerNode = useCallback(
    <T extends HTMLElement>(node: T | null) => {
      let unsubscribed = false;

      if (registerCleanupRef.current !== null) {
        registerCleanupRef.current();
        registerCleanupRef.current = null;
      }

      if (node != null) {
        const resizeCallback = makeResizeCallback(unsubscribed);

        const observer = new ResizeObserver(resizeCallback);

        observer.observe(node);

        registerCleanupRef.current = () => {
          unsubscribed = true;

          observer.disconnect();

          if ((resizeCallback as Debounced<ResizeObserverCallback>).cancel) {
            (resizeCallback as Debounced<ResizeObserverCallback>).cancel();
          }
        };
      }
    },
    [makeResizeCallback],
  );

  return {
    width: size.width,
    height: size.height,
    registerNode,
  };
};
