import { useEffect, useRef } from "react";

/**
 * A React hook that returns the value from the previous render.
 *
 * This hook is useful for comparing current and previous values,
 * detecting changes, or implementing animations based on value transitions.
 * On the first render, it returns `undefined` since there's no previous value.
 *
 * @template T The type of the value to track
 * @param value The current value to track
 * @returns The value from the previous render, or `undefined` on first render
 *
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const previousCount = usePreviousValue(count);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {previousCount ?? 'None'}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const usePreviousValue = <T>(value: T): T | undefined => {
  const ref = useRef<T>(undefined);

  useEffect(() => void (ref.current = value), [value]);

  // eslint-disable-next-line react-hooks/refs
  return ref.current;
};
