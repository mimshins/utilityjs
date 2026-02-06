import { useCallback, useRef, useState } from "react";
import type { Debounced, RefreshOptions } from "./types.ts";
import { setRefreshRate } from "./utils.ts";

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
