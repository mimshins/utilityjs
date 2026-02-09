/**
 * Calculate exponential backoff delay with jitter.
 * Formula: 1000ms * 2^attempt + random(0-1000ms)
 *
 * @param attempt The retry attempt number
 * @param baseDelay The base backoff delay (in milliseconds)
 * @returns Delay in milliseconds
 */
export const calculateBackoff = (attempt: number, baseDelay = 1000): number => {
  const exponential = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;

  return exponential + jitter;
};

/**
 * Delay execution for the specified duration.
 *
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
};
