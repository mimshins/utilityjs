import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

/**
 * Isomorphic layout effect that uses useLayoutEffect on the client
 * and useEffect on the server to avoid SSR warnings.
 */
/* v8 ignore start - SSR branch can't be tested in jsdom */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
/* v8 ignore stop */

/**
 * A React hook that stores and updates a ref with the most recent value.
 *
 * This hook is useful for accessing the latest value of a prop or state
 * inside callbacks, effects, or other closures without causing them to
 * re-run when the value changes. It's particularly helpful for avoiding
 * stale closures in event handlers and async operations.
 *
 * @template T The type of the value being stored
 * @param value The value to store and keep updated
 * @returns A ref object containing the latest value
 *
 * @example
 * ```tsx
 * function MyComponent({ onSubmit, data }) {
 *   const latestOnSubmit = useGetLatest(onSubmit);
 *   const latestData = useGetLatest(data);
 *
 *   const handleAsyncSubmit = useCallback(async () => {
 *     // These will always have the latest values
 *     // even if onSubmit or data change after the callback is created
 *     const result = await someAsyncOperation();
 *     latestOnSubmit.current(latestData.current, result);
 *   }, []); // No dependencies needed!
 *
 *   return <button onClick={handleAsyncSubmit}>Submit</button>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Avoiding stale closures in intervals
 * function Counter({ step }) {
 *   const [count, setCount] = useState(0);
 *   const latestStep = useGetLatest(step);
 *
 *   useEffect(() => {
 *     const interval = setInterval(() => {
 *       setCount(c => c + latestStep.current); // Always uses latest step
 *     }, 1000);
 *
 *     return () => clearInterval(interval);
 *   }, []); // No need to include step in dependencies
 *
 *   return <div>Count: {count}</div>;
 * }
 * ```
 */
export const useGetLatest = <T>(value: T): RefObject<T> => {
  const ref = useRef<T>(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
};
