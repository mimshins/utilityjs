import * as React from "react";

type Destructor = () => void | undefined;
type Callback = <T extends HTMLElement>(node: T) => void | Destructor;

const useRegisterNodeRef = (
  callback: Callback,
  deps: React.DependencyList = []
): (<T extends HTMLElement>(node: T | null) => void) => {
  const cleanupRef = React.useRef<Destructor | null>(null);

  const registerRef = React.useCallback(
    <T extends HTMLElement>(node: T | null) => {
      if (cleanupRef.current !== null) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (node) {
        const cleanup = callback(node);

        if (cleanup) cleanupRef.current = cleanup;
        else cleanupRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  return registerRef;
};

export default useRegisterNodeRef;
