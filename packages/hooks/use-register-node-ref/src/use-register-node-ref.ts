import { useGetLatest } from "@utilityjs/use-get-latest";
import { useCallback, useRef, type DependencyList } from "react";

export type Destructor = () => void | undefined;
export type Callback<T extends HTMLElement> = (node: T) => void | Destructor;

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
