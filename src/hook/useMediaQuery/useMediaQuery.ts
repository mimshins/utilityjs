import * as React from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const isSupported = typeof window !== "undefined" && "matchMedia" in window;

const useMediaQuery = (query: string | string[]): boolean[] => {
  const queries = Array.isArray(query) ? query : [query];
  const queriesKey = queries.join();

  const [matches, setMatches] = React.useState(
    Array(queries.length).fill(false) as boolean[]
  );

  useIsomorphicLayoutEffect(() => {
    if (!isSupported) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "[@utilityjs/use-media-query]: useMediaQuery relies on the `window.matchMedia` API.",
          "Since it is not supported in your browser, we are returning `false`."
        ].join("\n")
      );
      return;
    }

    const mediaQueries = queries.map(query => matchMedia(query));

    // Initial matching
    setMatches(mediaQueries.map(mediaQuery => mediaQuery.matches));

    let unsubscribed = false;
    const changeHandlers = mediaQueries.map(mediaQuery => {
      const changeHandler = (event: MediaQueryListEvent) => {
        if (unsubscribed) return;

        const isMatched = event.matches;
        const queryIndex = mediaQueries.findIndex(
          mediaQuery => mediaQuery.media === event.media
        );

        setMatches(prevMatches => {
          const clone = [...prevMatches];
          clone[queryIndex] = isMatched;
          return clone;
        });
      };

      mediaQuery.addEventListener("change", changeHandler);

      return changeHandler;
    });

    return () => {
      unsubscribed = true;
      mediaQueries.forEach((mediaQuery, index) => {
        mediaQuery.removeEventListener("change", changeHandlers[index]);
      });
    };
  }, [queriesKey]);

  return matches;
};

export default useMediaQuery;
