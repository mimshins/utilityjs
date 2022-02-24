import * as React from "react";

const __SENTINEL__ = {};

const useLazyInitializedValue = <T>(initFactory: () => T): T => {
  const lazyValue = React.useRef<T>(<T>__SENTINEL__);

  if (lazyValue.current === __SENTINEL__) lazyValue.current = initFactory();
  return lazyValue.current;
};

export default useLazyInitializedValue;
