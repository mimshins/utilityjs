/**
 * Handles setting a ref value, supporting both callback refs and ref objects.
 *
 * This utility function abstracts the differences between callback refs
 * (functions) and ref objects (with a .current property), providing a
 * unified way to set ref values.
 *
 * @template T The type of the element being referenced
 * @param ref The ref to update (can be a callback function or ref object)
 * @param instance The instance to set as the ref value
 */
export const handleRef = <T>(ref: React.Ref<T>, instance: T | null) => {
  if (typeof ref === "function") ref(instance);
  else if (ref && typeof ref === "object" && "current" in ref) {
    ref.current = instance;
  }
};
