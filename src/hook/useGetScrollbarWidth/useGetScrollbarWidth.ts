import * as React from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const useGetScrollbarWidth = (): (() => number) => {
  const scrollbarWidth = React.useRef(0);

  useIsomorphicLayoutEffect(() => {
    const dummy = document.createElement("div");

    dummy.style.width = "100px";
    dummy.style.height = "100px";
    dummy.style.overflow = "scroll";
    dummy.style.position = "absolute";
    dummy.style.top = "-9999px";
    dummy.setAttribute("aria-hidden", "true");
    dummy.setAttribute("role", "presentation");

    document.body.appendChild(dummy);
    scrollbarWidth.current = dummy.offsetWidth - dummy.clientWidth;
    document.body.removeChild(dummy);
  }, []);

  const getScrollBarWidth = React.useCallback(() => scrollbarWidth.current, []);

  return getScrollBarWidth;
};

export default useGetScrollbarWidth;
