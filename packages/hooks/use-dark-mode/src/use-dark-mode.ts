import { useMediaQuery } from "@utilityjs/use-media-query";
import {
  usePersistedState,
  type DataStorage,
} from "@utilityjs/use-persisted-state";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { addClassName, removeClassName } from "./utils.ts";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type Options = {
  /**
   * The initial state of the dark mode.\
   * If left unset, it will be set based on `(prefers-color-scheme: dark)` query.
   */
  initialState?: boolean;

  /**
   * The key is used to persist the state.
   *
   * @default "utilityjs-dark-mode"
   */
  storageKey?: string;

  /**
   * The class to toggle when state changes.\
   * The specified class will be applied on dark mode.
   *
   * @default "dark-mode"
   */
  toggleClassName?: string;

  /**
   * The storage object.
   *
   * @default localStorage
   */
  storage?: DataStorage<boolean>;
};

const DEFAULT_STORAGE: DataStorage<boolean> = {
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

export const useDarkMode = (
  options?: Options,
): {
  isDarkMode: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
} => {
  const {
    initialState,
    storage = DEFAULT_STORAGE,
    storageKey = "utilityjs-dark-mode",
    toggleClassName = "dark-mode",
  } = options || {};

  const [prefersDark] = useMediaQuery("(prefers-color-scheme: dark)");

  const [state, setState] = usePersistedState(initialState, {
    name: storageKey,
    storage,
  });

  const darkMode =
    typeof state === "undefined" ? (prefersDark ?? false) : state;

  useIsomorphicLayoutEffect(() => {
    if (darkMode) addClassName(document.body, toggleClassName);
    else removeClassName(document.body, toggleClassName);
  }, [darkMode]);

  return {
    isDarkMode: darkMode,
    enable: useCallback(() => setState(true), [setState]),
    disable: useCallback(() => setState(false), [setState]),
    toggle: () => setState(!darkMode),
  };
};
