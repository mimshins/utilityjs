import * as React from "react";
import { DEFAULT_PREFIX } from "./constants.ts";

/**
 * Prefixes a string with the given prefix, separated by a hyphen.
 * If no prefix is provided, uses the default prefix.
 *
 * @param str The string to prefix
 * @param prefix The prefix to prepend
 * @returns The prefixed string
 */
export const prefixStr = (str: string, prefix: string): string =>
  `${prefix.length ? prefix : DEFAULT_PREFIX}-${str}`;

/**
 * A safe reference to React's useId hook that works across different React versions.
 * Returns undefined if useId is not available (React < 18).
 */
export const useReactId: () => string | undefined =
  // We use `toString()` to prevent bundlers from trying to `import { useId } from "react"`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  ((React as any)["useId".toString()] as undefined | (() => string)) ??
  (() => void 0);

/**
 * Internal hook that manages ID generation logic.
 *
 * This hook handles the priority of ID sources:
 * 1. Override ID (if provided)
 * 2. React's useId (if available and no override)
 * 3. Fallback to state-managed default ID
 *
 * @param idOverride Optional ID to use instead of generating one
 * @param prefix Prefix to prepend to generated IDs
 * @returns Object containing the current ID and setter for default ID
 */
export const useId = (
  idOverride?: string,
  prefix = DEFAULT_PREFIX,
): {
  id: string | undefined;
  setDefaultId: React.Dispatch<React.SetStateAction<string | undefined>>;
} => {
  const reactId = useReactId();
  const sanitizedId = reactId
    ? prefixStr(reactId.replace(/:/g, "").replace(/(«|»)/g, ""), prefix)
    : undefined;

  const nodeId = idOverride ?? sanitizedId;

  const [defaultId, setDefaultId] = React.useState(nodeId);
  const id = nodeId ?? defaultId;

  return { id, setDefaultId };
};
