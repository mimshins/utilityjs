import { useRef } from "react";

const __SENTINEL__ = {};

/**
 * A React hook that initializes a value only once during the component's lifecycle.
 * The initialization function is called only on the first render, and the result
 * is memoized for subsequent renders.
 *
 * @template T The type of the initialized value
 * @param initFactory A function that returns the initial value
 * @returns The initialized value that persists across re-renders
 *
 * @example
 * ```tsx
 * function ExpensiveComponent() {
 *   // This expensive calculation only runs once
 *   const expensiveValue = useInitOnce(() => {
 *     console.log("This only runs once!");
 *     return performExpensiveCalculation();
 *   });
 *
 *   return <div>{expensiveValue}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * function ComponentWithUniqueId() {
 *   // Generate a unique ID that persists across re-renders
 *   const id = useInitOnce(() => `component-${Math.random().toString(36).substr(2, 9)}`);
 *
 *   return <div id={id}>Component with stable ID</div>;
 * }
 * ```
 */
export const useInitOnce = <T>(initFactory: () => T): T => {
  const lazyValue = useRef<T>(__SENTINEL__ as T);

  // eslint-disable-next-line react-hooks/refs
  if (lazyValue.current === __SENTINEL__) lazyValue.current = initFactory();

  // eslint-disable-next-line react-hooks/refs
  return lazyValue.current;
};
