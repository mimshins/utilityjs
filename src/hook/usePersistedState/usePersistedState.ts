import useEventListener from "@utilityjs/use-event-listener";
import useLatest from "@utilityjs/use-get-latest";
import * as React from "react";

type StateStorage<T> = {
  isCsrReady: boolean;
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
   * Must return an object matching `{ state: T }`
   *
   * @param str The storage's current value.
   * @default JSON.parse
   */
  deserializer?: (str: string) => StorageValue<T>;
}

type InstanceState<T> = Record<
  string,
  { callbacks: Array<React.Dispatch<React.SetStateAction<T>>>; value: T }
>;

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

const instanceState: InstanceState<unknown> = {};

const registerInstanceState = <T>(
  key: string,
  callback: React.Dispatch<React.SetStateAction<T>>,
  initialValue: T
) => {
  if (!(key in instanceState))
    instanceState[key] = { callbacks: [], value: initialValue };

  (<InstanceState<T>>instanceState)[key].callbacks.push(callback);
};

const unregisterInstanceState = <T>(
  key: string,
  callback: React.Dispatch<React.SetStateAction<T>>
) => {
  const cbs = (<InstanceState<T>>instanceState)[key].callbacks;

  const index = cbs.indexOf(callback);
  if (index > -1) cbs.splice(index, 1);
};

const emitInstanceState = <T>(
  key: string,
  callback: React.Dispatch<React.SetStateAction<T>>,
  value: T
) => {
  if (instanceState[key].value !== value) {
    instanceState[key].value = value;
    instanceState[key].callbacks.forEach(
      cb => void (callback !== cb && cb(value))
    );
  }
};

const useHook = <T>(
  initialState: T,
  storage: StateStorage<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = React.useState(initialState);

  const initialRenderCompleted = React.useRef(false);
  const cachedKeyRef = useLatest(storage.getName());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (storage.isCsrReady && !initialRenderCompleted.current) {
      const init = storage.getItem(initialState);
      if (state !== init) setState(init);
      initialRenderCompleted.current = true;
    }
  });

  React.useEffect(() => {
    const key = cachedKeyRef.current;

    registerInstanceState(key, setState, initialState);
    return () => unregisterInstanceState(key, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState]);

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

      // Inform other instances in the current tab
      emitInstanceState(cachedKeyRef.current, setState, _nextState);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, storage]
  );

  return [state, setPersistedState];
};

const createStorage = <T>(
  storage: Storage | null,
  serializer: NonNullable<PersistOptions<T>["serializer"]>,
  deserializer: NonNullable<PersistOptions<T>["deserializer"]>,
  name: string
): StateStorage<T> => {
  return {
    isCsrReady: storage != null,
    getName: () => name,
    getSerializer: () => serializer,
    getDeserializer: () => deserializer,
    getItem: defaultValue => {
      if (storage == null) return defaultValue;

      const serialized = storage.getItem(name);
      if (serialized == null) return defaultValue;

      return deserializer(serialized).state;
    },
    setItem: value => {
      if (storage == null) return;

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

  const [storage, setStorage] = React.useState<Storage | null>(null);
  const cachedGetStorage = useLatest(getStorage);

  React.useEffect(() => {
    setStorage(cachedGetStorage.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useHook<T>(
    initialState,
    createStorage<T>(storage, serializer, deserializer, name)
  );
};

export default usePersistedState;
