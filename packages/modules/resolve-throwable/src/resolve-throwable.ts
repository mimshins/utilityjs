export type Success<T> = {
  data: T;
  error: null;
};

export type Failure<E> = {
  data: null;
  error: E;
};

/**
 * The unified return type for the `resolveThrowable` function. It guarantees
 * that the result will contain either a successful `data` payload or an `error`
 * object, making it safe to handle without a traditional `try...catch` block.
 *
 * @template T The type of the data returned by the operation.
 * @template E The type of the error thrown by the operation, defaults to `Error`.
 */
export type ThrowableResult<T, E extends Error = Error> = Promise<
  Success<T> | Failure<E>
>;

/**
 * Executes a given asynchronous function and returns its result in a structured
 * object, converting potential thrown errors into a safe `error` property.
 * This prevents the application from crashing due to uncaught promise rejections
 * and simplifies error handling in asynchronous code.
 *
 * @param throwableFn The asynchronous function to execute. It can be a promise-returning function.
 * @returns A promise that resolves to a `ThrowableResult` object,
 * containing either the result of the function call in the `data` property or the caught
 * error in the `error` property.
 */
export const resolveThrowable = async <
  E extends Error,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  F extends (...args: any[]) => any,
>(
  throwableFn: F,
): ThrowableResult<Awaited<ReturnType<F>>, E> => {
  type T = Awaited<ReturnType<F>>;

  try {
    const data = (await throwableFn()) as T;

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err as E };
  }
};
