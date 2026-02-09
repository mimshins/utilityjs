import { calculateBackoff, delay } from "./utils.ts";

export type Options = {
  /**
   * Maximum number of retry attempts.
   *
   * @default 3
   */
  maxRetries?: number;

  /**
   * Base delay in milliseconds for exponential backoff.
   *
   * @default 1000
   */
  baseDelay?: number;

  /**
   * Optional predicate to determine if an error should trigger a retry.
   * If not provided, all errors will trigger retries.
   */
  shouldRetry?: (error: Error) => boolean;
};

/**
 * Executes an asynchronous function with exponential backoff retry logic.
 * Automatically retries on failure with increasing delays between attempts.
 *
 * @template T The return type of the callback function
 * @param cb The asynchronous function to execute with retries
 * @param options Configuration options for retry behavior
 * @returns A promise that resolves with the callback result or rejects after all retries are exhausted
 *
 * @example
 * ```typescript
 * const fetchData = async () => {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw new Error('Failed to fetch');
 *   return response.json();
 * };
 *
 * const data = await retryWithBackoff(fetchData, {
 *   maxRetries: 5,
 *   baseDelay: 500,
 *   shouldRetry: (error) => error.message.includes('network')
 * });
 * ```
 */
export const retryWithBackoff = async <T>(
  cb: () => Promise<T>,
  options?: Options,
): Promise<T> => {
  const { maxRetries = 3, baseDelay = 1000, shouldRetry } = options ?? {};

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await cb();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (shouldRetry && !shouldRetry(lastError)) {
        throw lastError;
      }

      if (attempt < maxRetries) {
        const delayMs = calculateBackoff(attempt, baseDelay);

        await delay(delayMs);
      }
    }
  }

  throw lastError!;
};
