import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import type { Debounced, RefreshOptions } from "./types.ts";

/**
 * Applies debouncing or throttling to a ResizeObserver callback based on the provided options.
 *
 * This utility function wraps the ResizeObserver callback with either debounce or throttle
 * functionality to control the frequency of resize event handling for better performance.
 *
 * @param cb The ResizeObserver callback function to wrap
 * @param refreshOptions Configuration options for debouncing/throttling
 * @returns The wrapped callback function or the original callback if no mode is specified
 */
export const setRefreshRate = (
  cb: ResizeObserverCallback,
  refreshOptions?: RefreshOptions,
): Debounced<ResizeObserverCallback> | ResizeObserverCallback => {
  const { mode, rate = 250, leading, trailing } = refreshOptions ?? {};

  switch (mode) {
    case "debounce": {
      const lodashOptions = {
        leading: leading != null ? leading : false,
        trailing: trailing != null ? trailing : true,
      };

      return debounce(
        cb,
        rate,
        lodashOptions,
      ) as Debounced<ResizeObserverCallback>;
    }

    case "throttle": {
      const lodashOptions = {
        leading: leading != null ? leading : true,
        trailing: trailing != null ? trailing : true,
      };

      return throttle(
        cb,
        rate,
        lodashOptions,
      ) as Debounced<ResizeObserverCallback>;
    }

    default:
      return cb;
  }
};
