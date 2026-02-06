import { useEffect, useLayoutEffect } from "react";

/**
 * A React hook that uses `useLayoutEffect` on the client and `useEffect` on the server.
 * This prevents hydration mismatches and SSR warnings while maintaining the synchronous
 * behavior of `useLayoutEffect` when needed.
 *
 * @example
 * ```tsx
 * import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
 * import { useRef, useState } from "react";
 *
 * function MeasuredComponent() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const [width, setWidth] = useState(0);
 *
 *   useIsomorphicLayoutEffect(() => {
 *     if (ref.current) {
 *       // This runs synchronously after DOM mutations on client
 *       // but as regular effect on server to avoid SSR issues
 *       setWidth(ref.current.offsetWidth);
 *     }
 *   }, []);
 *
 *   return (
 *     <div ref={ref}>
 *       Width: {width}px
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ScrollToTop() {
 *   useIsomorphicLayoutEffect(() => {
 *     // Scroll to top synchronously on client, safely on server
 *     window.scrollTo(0, 0);
 *   }, []);
 *
 *   return <div>Content...</div>;
 * }
 * ```
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
