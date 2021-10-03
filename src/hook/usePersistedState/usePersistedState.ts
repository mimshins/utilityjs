import useEventListener from "@utilityjs/use-event-listener";
import * as React from "react";

type StateStorage<T> = {
  getItem: (defaultValue: T) => T;
  setItem: (value: T) => void;
  getName: () => string;
  getSerializer: () => NonNullable<PersistOptions<T>["serializer"]>;
  getDeserializer: () => NonNullable<PersistOptions<T>["deserializer"]>;
};

type StorageValue<T> = { state: T };

interface PersistOptions<T> {
  /** Name of the storage (must be unique) */
  name: string;
  /**
   * A function returning a storage.
   * The storage must fit `window.localStorage`'s api.
   *
   * @default () => localStorage
   */
  getStorage?: () => Storage | null;
  /**
   * Use a custom serializer.
   * The returned string will be stored in the storage.
   *
   * @default JSON.stringify
   */
  serializer?: (state: StorageValue<T>) => string;
  /**
   * Use a custom deserializer.
   * Must return an object matching StorageValue<State>
   *
   * @param str The storage's current value.
   * @default JSON.parse
   */
  deserializer?: (str: string) => StorageValue<T>;
}

const _getStorage = (): Storage | null => {
  if (typeof global !== "undefined" && global.localStorage)
    return global.localStorage;

  if (typeof globalThis !== "undefined" && globalThis.localStorage)
    return globalThis.localStorage;

  if (typeof window !== "undefined" && window.localStorage)
    return window.localStorage;

  if (typeof localStorage !== "undefined") return localStorage;

  return null;
};

const useHook = <T>(
  initialState: T,
  storage: StateStorage<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(() => storage.getItem(initialState));

  useEventListener({
    target: typeof window === "undefined" ? null : window,
    eventType: "storage",
    handler: event => {
      const { key, newValue } = event;

      if (key === storage.getName()) {
        const deserializer = storage.getDeserializer();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deserialized = deserializer(newValue!);
        const nextState = deserialized?.state;

        if (nextState == null) setState(initialState);
        else if (state !== nextState) setState(nextState);
      }
    }
  });

  const setPersistedState = React.useCallback(
    (nextState: React.SetStateAction<T>) => {
      const _nextState =
        typeof nextState === "function"
          ? (nextState as (prevState: T) => T)(state)
          : nextState;

      storage.setItem(_nextState);
      setState(_nextState);
    },
    [state, storage]
  );

  return [state, setPersistedState];
};

const createStorage = <T>(
  storage: Storage,
  serializer: NonNullable<PersistOptions<T>["serializer"]>,
  deserializer: NonNullable<PersistOptions<T>["deserializer"]>,
  name: string
): StateStorage<T> => {
  return {
    getName: () => name,
    getSerializer: () => serializer,
    getDeserializer: () => deserializer,
    getItem: defaultValue => {
      const serialized = storage.getItem(name);
      if (serialized == null) return defaultValue;
      return deserializer(serialized).state;
    },
    setItem: value => {
      const serialized = serializer({ state: value });
      storage.setItem(name, serialized);
    }
  };
};

const usePersistedState = <T>(
  initialState: T,
  options: PersistOptions<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const {
    name,
    getStorage = _getStorage,
    serializer = JSON.stringify as (state: StorageValue<T>) => string,
    deserializer = JSON.parse as (str: string) => StorageValue<T>
  } = options || {};

  if (name == null || typeof name !== "string" || name.length === 0) {
    throw new Error(
      "[@utilityjs/use-persisted-state]: You have to provide a valid `name` option!"
    );
  }

  const _storage = getStorage();

  if (_storage) {
    const storage = createStorage<T>(_storage, serializer, deserializer, name);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useHook<T>(initialState, storage);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return React.useState<T>(initialState);
};

export default usePersistedState;
