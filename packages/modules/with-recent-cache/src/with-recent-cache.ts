/**
 * Memoizes a function by caching only the most recent call result.
 * Compares arguments with the previous call using shallow equality.
 *
 * @template TArgs The function arguments type
 * @template TReturn The function return type
 * @param fn The function to memoize
 * @returns Memoized function that caches only the last result
 *
 * @example
 * ```typescript
 * const expensiveCalculation = (a: number, b: number) => {
 *  console.log('Computing...');
 *  return a * b;
 * };
 *
 * const memoized = withRecentCache(expensiveCalculation);
 *
 * memoized(2, 3); // Logs "Computing..." and returns 6
 * memoized(2, 3); // Returns 6 (cached)
 * memoized(3, 4); // Logs "Computing..." and returns 12
 * memoized(2, 3); // Logs "Computing..." again (cache was replaced)
 */
export const withRecentCache = <TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
): ((...args: TArgs) => TReturn) => {
  let hasCache = false;
  let cachedArgs: TArgs;
  let cachedResult: TReturn;

  return (...args: TArgs): TReturn => {
    // Check if we have a cache and arguments match
    if (
      hasCache &&
      args.length === cachedArgs.length &&
      args.every((arg, index) => arg === cachedArgs[index])
    ) {
      return cachedResult;
    }

    // Compute new result and update cache
    cachedResult = fn(...args);
    cachedArgs = args;
    hasCache = true;

    return cachedResult;
  };
};
