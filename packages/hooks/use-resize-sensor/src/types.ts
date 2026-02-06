/**
 * Configuration options for controlling resize event refresh rate.
 */
export type RefreshOptions = {
  /** The refresh mode - either 'debounce' or 'throttle' */
  mode?: "debounce" | "throttle";
  /** The rate in milliseconds for debouncing/throttling (default: 250) */
  rate?: number;
  /** Whether to execute on the leading edge (default: false for debounce, true for throttle) */
  leading?: boolean;
  /** Whether to execute on the trailing edge (default: true for both) */
  trailing?: boolean;
};

/**
 * Type for debounced/throttled functions with additional control methods.
 *
 * @template T The function type being debounced/throttled
 */
export type Debounced<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancels any pending executions */
  cancel(): void;
  /** Immediately executes any pending execution */
  flush(): ReturnType<T> | undefined;
};
