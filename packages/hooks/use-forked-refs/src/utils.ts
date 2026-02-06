export const handleRef = <T>(ref: React.Ref<T>, instance: T | null) => {
  if (typeof ref === "function") ref(instance);
  else if (ref && typeof ref === "object" && "current" in ref) {
    ref.current = instance;
  }
};
