import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import type { Debounced, RefreshOptions } from "./types.ts";

export const setRefreshRate = (
  cb: ResizeObserverCallback,
  refreshOptions?: RefreshOptions,
): Debounced<ResizeObserverCallback> | ResizeObserverCallback => {
  const { mode, rate = 250, leading, trailing } = refreshOptions || {};

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
