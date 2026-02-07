import { useIsServerHandoffComplete } from "@utilityjs/use-is-server-handoff-complete";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { __INSTANCES_REF_MAP__ } from "./constants.ts";
import type { InstanceRef } from "./types.ts";
import { emitInstances } from "./utils.ts";

/**
 * Interface for storage implementations used by usePersistedState.
 *
 * @template T The type of data to be stored
 */
export interface DataStorage<T> {
  /**
   * Sets an item in storage.
   *
   * @param key The key under which to store the item.
   * @param value The value to store. Can be any serializable type.
   */
  setItem(key: string, value: T): void;

  /**
   * Retrieves an item from storage.
   *
   * @param key The key of the item to retrieve.
   * @returns The retrieved value, or null if not found.
   */
  getItem(key: string): T | null;
}

/**
 * Configuration object for usePersistedState hook.
 *
 * @template T The type of data to be persisted
 */
export type Config<T> = {
  /** The unique key to identify the persisted state */
  name: string;
  /** The storage implementation to use for persistence */
  storage: DataStorage<T>;
};

/**
 * A React hook that provides SSR-friendly multi-tab persistent state.
 *
 * This hook synchronizes state across multiple tabs/windows and persists
 * the state using the provided storage implementation. It handles SSR
 * scenarios gracefully and provides automatic synchronization between
 * multiple instances of the same hook.
 *
 * @template T The type of the state value
 * @param initialValue The initial state value or a function that returns it
 * @param storageConfig Configuration object containing storage name and implementation
 * @returns A tuple containing the current state and a setter function
 *
 * @example
 * ```tsx
 * const [count, setCount] = usePersistedState(0, {
 *   name: 'counter',
 *   storage: localStorage
 * });
 * ```
 */
export const usePersistedState = <T>(
  initialValue: T | (() => T),
  storageConfig: Config<T>,
): [T, Dispatch<SetStateAction<T>>] => {
  const { name, storage } = storageConfig;

  if (name == null || typeof name !== "string" || name.length === 0) {
    throw new Error(
      `[@utilityjs/use-persisted-state]: Expected a valid \`name\` value, received \`${name}\`.`,
    );
  }

  const initialRenderCompleted = useRef(false);

  const initializeState = (): T => {
    const init = storage.getItem(name) ?? initialValue;
    const initialState = init instanceof Function ? init() : init;

    initialRenderCompleted.current = true;

    return initialState;
  };

  const isClientReady = useIsServerHandoffComplete();

  const [state, setState] = useState(
    /* v8 ignore next - SSR condition */
    !isClientReady ? initialValue : initializeState,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    /* v8 ignore start - SSR hydration effect */
    if (initialRenderCompleted.current) return;

    const initialState = initializeState();

    if (state !== initialState) setState(initialState);

    initialRenderCompleted.current = true;
    /* v8 ignore stop */
  });

  useEffect(() => {
    const initialState =
      initialValue instanceof Function ? initialValue() : initialValue;

    if (!__INSTANCES_REF_MAP__.has(name)) {
      __INSTANCES_REF_MAP__.set(name, {
        callbacks: [],
        value: initialState,
      });
    }

    (__INSTANCES_REF_MAP__.get(name) as InstanceRef<T>).callbacks.push(
      setState,
    );

    return () => {
      const instance = __INSTANCES_REF_MAP__.get(name);

      /* v8 ignore start - edge case when instance doesn't exist */
      if (!instance) return;
      /* v8 ignore stop */

      const cbs = (instance as InstanceRef<T>).callbacks;
      const index = cbs.indexOf(setState);

      /* v8 ignore start - edge case when callback not found */
      if (index > -1) cbs.splice(index, 1);
      /* v8 ignore stop */
    };
  }, [initialValue, name]);

  useEffect(() => {
    /* v8 ignore start - storage event handler with complex edge cases */
    const handleStorageChange = (event: StorageEvent) => {
      const { key, newValue } = event;

      if (key !== name) return;

      const initialState =
        initialValue instanceof Function ? initialValue() : initialValue;

      if (newValue == null) {
        setState(initialState);

        return;
      }

      let parsed: T | null;

      try {
        parsed = JSON.parse(newValue) as T;
      } catch {
        parsed = null;
      }

      if (parsed == null) setState(initialState);
      else {
        setState(prevState => {
          if (prevState !== parsed) return parsed;

          return prevState;
        });
      }
    };
    /* v8 ignore stop */

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [initialValue, name]);

  const setPersistedState = useCallback(
    (nextState: SetStateAction<T>) => {
      setState(prevState => {
        const newState =
          nextState instanceof Function ? nextState(prevState) : nextState;

        storage.setItem(name, newState);

        // Inform other instances in the current tab
        emitInstances<T>(name, setState, newState);

        return newState;
      });
    },

    [name, storage],
  );

  return [state, setPersistedState];
};
