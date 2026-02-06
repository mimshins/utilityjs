import { __INSTANCES_REF_MAP__ } from "./constants.ts";
import type { InstanceRef } from "./types.ts";

export const emitInstances = <T>(
  key: string,
  callback: React.Dispatch<React.SetStateAction<T>>,
  value: T,
) => {
  if (!__INSTANCES_REF_MAP__.has(key)) return;

  const instance = __INSTANCES_REF_MAP__.get(key) as InstanceRef<T>;

  if (instance.value === value) return;

  instance.value = value;
  instance.callbacks.forEach(cb => void (callback !== cb && cb(value)));
};
