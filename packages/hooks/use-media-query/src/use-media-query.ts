import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Isomorphic layout effect that uses useLayoutEffect on the client and useEffect on the server.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Check if the matchMedia API is supported in the current environment.
 */
const isSupported = typeof window !== "undefined" && "matchMedia" in window;

/**
 * A React hook that helps detect whether media queries individually match.
 *
 * This hook allows you to track the state of one or more CSS media queries
 * and reactively update your component when the viewport changes. It supports
 * both single queries and arrays of queries, returning corresponding boolean values.
 *
 * @param query - A single media query string or an array of media query strings
 * @returns An array of boolean values indicating whether each query matches
 *
 * @example
 * ```tsx
 * import { useMediaQuery } from "@utilityjs/use-media-query";
 *
 * function ResponsiveComponent() {
 *   const [isMobile] = useMediaQuery('(max-width: 768px)');
 *   const [isTablet, isDesktop] = useMediaQuery([
 *     '(min-width: 769px) and (max-width: 1024px)',
 *     '(min-width: 1025px)'
 *   ]);
 *
 *   if (isMobile) return <MobileLayout />;
 *   if (isTablet) return <TabletLayout />;
 *   return <DesktopLayout />;
 * }
 * ```
 */
export const useMediaQuery = (query: string | string[]): boolean[] => {
  const queries = Array.isArray(query) ? query : [query];
  const queriesKey = queries.join();

  const [matches, setMatches] = useState(
    Array(queries.length).fill(false) as boolean[],
  );

  useIsomorphicLayoutEffect(() => {
    if (!isSupported) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "[@utilityjs/use-media-query]: useMediaQuery relies on the `window.matchMedia` API.",
          "Since it is not supported in your browser, we are returning `false`.",
        ].join("\n"),
      );
      return;
    }

    const mediaQueries = queries.map(query => matchMedia(query));

    // Initial matching
    setMatches(mediaQueries.map(mediaQuery => mediaQuery.matches));

    let unsubscribed = false;
    const changeHandlers = mediaQueries.map(mediaQuery => {
      /**
       * Handles media query change events and updates the matches state.
       *
       * @param event - The MediaQueryListEvent containing match information
       */
      const changeHandler = (event: MediaQueryListEvent) => {
        if (unsubscribed) return;

        const isMatched = event.matches;
        const queryIndex = mediaQueries.findIndex(
          mediaQuery => mediaQuery.media === event.media,
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
        mediaQuery.removeEventListener("change", changeHandlers[index]!);
      });
    };
  }, [queriesKey]);

  return matches;
};
