import type { DataStorage } from "@utilityjs/use-persisted-state";

/* v8 ignore start - DEFAULT_STORAGE is a simple localStorage wrapper, tested via integration */
export const DEFAULT_STORAGE: DataStorage<boolean> = {
  getItem(key) {
    const item = window.localStorage.getItem(key);

    if (item === null) return null;

    return Boolean(item);
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        `[@utilityjs/use-dark-mode]: Failed to set item for key "${key}".`,
        e,
      );
    }
  },
};
/* v8 ignore stop */
