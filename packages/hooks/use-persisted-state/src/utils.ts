import { __INSTANCES_REF_MAP__ } from "./constants.ts";
import type { InstanceRef } from "./types.ts";

export const emitInstances = <T>(
  key: string,
  callback: React.Dispatch<React.SetStateAction<T>>,
  value: T,
) => {
  /* v8 ignore start - edge case when no instances exist */
  if (!__INSTANCES_REF_MAP__.has(key)) return;
  /* v8 ignore stop */

  const instance = __INSTANCES_REF_MAP__.get(key) as InstanceRef<T>;

  /* v8 ignore start - optimization to prevent unnecessary updates */
  if (instance.value === value) return;
  /* v8 ignore stop */

  instance.value = value;
  instance.callbacks.forEach(cb => void (callback !== cb && cb(value)));
};
