import { useRef } from "react";

const __SENTINEL__ = {};

export const useInitOnce = <T>(initFactory: () => T): T => {
  const lazyValue = useRef<T>(__SENTINEL__ as T);

  // eslint-disable-next-line react-hooks/refs
  if (lazyValue.current === __SENTINEL__) lazyValue.current = initFactory();

  // eslint-disable-next-line react-hooks/refs
  return lazyValue.current;
};
