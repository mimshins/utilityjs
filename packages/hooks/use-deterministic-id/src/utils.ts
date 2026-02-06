import * as React from "react";
import { DEFAULT_PREFIX } from "./constants.ts";

export const prefixStr = (str: string, prefix: string): string =>
  `${prefix.length ? prefix : DEFAULT_PREFIX}-${str}`;

export const useReactId: () => string | undefined =
  // We use `toString()` to prevent bundlers from trying to `import { useId } from "react"`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  ((React as any)["useId".toString()] as undefined | (() => string)) ??
  (() => void 0);

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
