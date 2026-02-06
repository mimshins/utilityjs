import { useEffect } from "react";
import { DEFAULT_PREFIX } from "./constants.ts";
import { prefixStr, useId } from "./utils.ts";

/**
 * Global counter for generating unique IDs when React's useId is not available.
 * This is used as a fallback for client-side rendering.
 */
let __GLOBAL_ID__ = 0;

/**
 * A React hook that generates a deterministic unique ID for components.
 *
 * This hook provides a stable, unique identifier that works across server-side
 * rendering and client-side hydration. It uses React's built-in useId when available
 * (React 18+) and falls back to a global counter for older versions.
 *
 * @param idOverride Optional ID to use instead of generating one
 * @param prefix Prefix to prepend to the generated ID
 * @returns A stable, unique identifier string
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const id = useDeterministicId();
 *   const customId = useDeterministicId(undefined, "my-component");
 *   const overrideId = useDeterministicId("custom-id");
 *
 *   return (
 *     <div>
 *       <label htmlFor={id}>Default ID</label>
 *       <input id={id} />
 *
 *       <label htmlFor={customId}>Custom prefix</label>
 *       <input id={customId} />
 *
 *       <label htmlFor={overrideId}>Override ID</label>
 *       <input id={overrideId} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * In React < 18: This hook relies on hydration to avoid server/client mismatch errors.
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
