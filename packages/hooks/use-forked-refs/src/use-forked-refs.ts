import { useCallback } from "react";
import { handleRef } from "./utils.ts";

export const useForkedRefs = <T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> => {
  return useCallback<React.RefCallback<T>>(
    instance => {
      refs.forEach(ref => {
        if (!ref) return;

        handleRef(ref, instance);
      });
    },
    [refs],
  );
};
