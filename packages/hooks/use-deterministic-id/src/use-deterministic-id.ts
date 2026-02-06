import { useEffect } from "react";
import { DEFAULT_PREFIX } from "./constants.ts";
import { prefixStr, useId } from "./utils.ts";

let __GLOBAL_ID__ = 0;

/**
 * In `React < 18`: This hook relies on hydration to avoid server/client mismatch errors.
 */
export const useDeterministicId = (
  idOverride?: string,
  prefix = DEFAULT_PREFIX,
): string => {
  const { id, setDefaultId } = useId(idOverride, prefix);

  useEffect(() => {
    if (id != null) return;
    // Fallback to this default id when possible.
    // Use the incrementing value for client-side rendering only.
    // We can't use it server-side.
    __GLOBAL_ID__ += 1;

    setDefaultId(prefixStr(String(__GLOBAL_ID__), prefix));
  }, [id, prefix, setDefaultId]);

  return id ?? "";
};
