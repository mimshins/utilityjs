import useGetScrollbarWidth from "@utilityjs/use-get-scrollbar-width";
import * as React from "react";

type UseScrollGuard = () => {
  enablePageScroll: () => void;
  disablePageScroll: () => void;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const useScrollGuard: UseScrollGuard = () => {
  const getScrollbarWidth = useGetScrollbarWidth();

  const cachedOverflow = React.useRef("");
  const cachedPaddingR = React.useRef("");

  useIsomorphicLayoutEffect(() => {
    cachedOverflow.current = document.body.style.overflow;
    cachedPaddingR.current = document.body.style.paddingRight;
  }, []);

  const enablePageScroll = React.useCallback(() => {
    document.body.style.overflow = cachedOverflow.current;
    document.body.style.paddingRight = cachedPaddingR.current;
  }, []);

  const disablePageScroll = React.useCallback(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${getScrollbarWidth()}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { enablePageScroll, disablePageScroll };
};

export default useScrollGuard;
