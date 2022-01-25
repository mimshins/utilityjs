import useMediaQuery from "@utilityjs/use-media-query";
import usePersistedState from "@utilityjs/use-persisted-state";
import * as React from "react";

interface Options {
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
   * A function returning a storage.
   * The storage must fit `window.localStorage`'s api.
   *
   * @default () => localStorage
   */
  getStorage?: () => Storage | null;
}

const addClassName = (element: HTMLElement, className: string) =>
  void (element.className = (element.className + ` ${className}`).trim());

const removeClassName = (element: HTMLElement, className: string) =>
  void (element.className = element.className
    .split(" ")
    .filter(cls => cls !== className)
    .join(" "));

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const useDarkMode = (
  options?: Options
): {
  isDarkMode: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
} => {
  const {
    getStorage,
    initialState,
    storageKey = "utilityjs-dark-mode",
    toggleClassName = "dark-mode"
  } = options || {};

  const [prefersDark] = useMediaQuery("(prefers-color-scheme: dark)");

  const [state, setState] = usePersistedState(initialState, {
    name: storageKey,
    getStorage
  });

  const darkMode = typeof state === "undefined" ? prefersDark : state;

  useIsomorphicLayoutEffect(() => {
    if (darkMode) addClassName(document.body, toggleClassName);
    else removeClassName(document.body, toggleClassName);
  }, [darkMode]);

  return {
    isDarkMode: darkMode,
    /* eslint-disable react-hooks/exhaustive-deps */
    enable: React.useCallback(() => setState(true), []),
    disable: React.useCallback(() => setState(false), []),
    toggle: () => setState(!darkMode)
  };
};

export default useDarkMode;
