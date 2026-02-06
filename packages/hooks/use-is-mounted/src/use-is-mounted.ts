import { useCallback, useEffect, useRef } from "react";

export const useIsMounted = (): (() => boolean) => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => void (isMountedRef.current = false);
  }, []);

  return useCallback(() => isMountedRef.current, []);
};
