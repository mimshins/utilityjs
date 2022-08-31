import * as React from "react";

const DEFAULT_PREFIX = "UTILITYJS-GEN-ID";
let globalId = 0;

/* eslint-disable */
const useReactId: () => string | undefined =
  // We use `toString()` to prevent bundlers from trying to `import { useId } from "react"`
  <undefined | (() => string)>(<any>React)["useId".toString()] ??
  (() => void 0);
/* eslint-enable */

const prefixStr = (str: string, prefix: string) =>
  `${prefix.length ? prefix : DEFAULT_PREFIX}-${str}`;

/**
 * In `React < 18`: This hook relies on hydration to avoid server/client mismatch errors.
 */
const useDeterministicId = (
  idOverride?: string,
  prefix = DEFAULT_PREFIX
): string => {
  const reactId = useReactId();
  const inputId =
    idOverride ?? (reactId ? prefixStr(reactId, prefix) : undefined);

  const [defaultId, setDefaultId] = React.useState(inputId);
  const id = inputId ?? defaultId;

  React.useEffect(() => {
    if (id != null) return;
    // Fallback to this default id when possible.
    // Use the incrementing value for client-side rendering only.
    // We can't use it server-side.
    globalId += 1;
    setDefaultId(prefixStr(String(globalId), prefix));
  }, [id, prefix]);

  return id ?? "";
};

export default useDeterministicId;
