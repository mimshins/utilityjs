import useGetLatest from "@utilityjs/use-get-latest";
import * as React from "react";

type Destructor = () => void | undefined;
type Callback = <T extends HTMLElement>(node: T | null) => void | Destructor;

const useRegisterNodeRef = (
  callback: Callback
): ((node: Parameters<Callback>[number]) => void) => {
  const cleanupRef = React.useRef<Destructor | null>(null);

  const getCallback = useGetLatest(callback);

  const registerRef = React.useCallback(
    (node: Parameters<Callback>[number]) => {
      if (cleanupRef.current !== null) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      if (node) {
        const cb = getCallback();
        const cleanup = cb(node);

        if (cleanup) cleanupRef.current = cleanup;
        else cleanupRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return registerRef;
};

export default useRegisterNodeRef;
