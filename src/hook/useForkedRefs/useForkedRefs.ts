import * as React from "react";

const setRef = <T>(ref: React.Ref<T>, value: T) => {
  if (typeof ref === "function") ref(value);
  else if (ref && typeof ref === "object" && "current" in ref)
    (ref as React.MutableRefObject<T>).current = value;
};

const useForkedRefs = <T>(...refs: React.Ref<T>[]): React.RefCallback<T> =>
  React.useCallback(
    (instance: T) => void refs.forEach(ref => void setRef(ref, instance)),
    [refs]
  );

export default useForkedRefs;
