import { useMediaQuery } from "@utilityjs/use-media-query";
import {
  usePersistedState,
  type DataStorage,
} from "@utilityjs/use-persisted-state";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { addClassName, removeClassName } from "./utils.ts";

/* v8 ignore start - SSR branch */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
/* v8 ignore stop */

/**
 * Configuration options for the useDarkMode hook.
 */
export type Options = {
  /**
   * The initial state of the dark mode.
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
   * The class to toggle when state changes.
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

/* v8 ignore start - DEFAULT_STORAGE is a simple localStorage wrapper, tested via integration */
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
/* v8 ignore stop */

/**
 * A React hook for managing dark mode state with persistence and system preference detection.
 *
 * This hook automatically detects the user's system color scheme preference,
 * persists the dark mode state to storage, and applies CSS classes to the document body.
 *
 * @param options Configuration options for the hook
 * @returns An object containing the current dark mode state and control functions
 *
 * @example
 * ```tsx
 * function App() {
 *   const { isDarkMode, enable, disable, toggle } = useDarkMode({
 *     initialState: false,
 *     toggleClassName: "dark-theme"
 *   });
 *
 *   return (
 *     <div>
 *       <p>Current mode: {isDarkMode ? "Dark" : "Light"}</p>
 *       <button onClick={toggle}>Toggle Theme</button>
 *       <button onClick={enable}>Enable Dark Mode</button>
 *       <button onClick={disable}>Disable Dark Mode</button>
 *     </div>
 *   );
 * }
 * ```
 */
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
    /* v8 ignore next - prefersDark is always boolean from useMediaQuery */
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
