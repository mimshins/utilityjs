import * as React from "react";

type SubscribeCallback = () => void;

type PubSub<S> = {
  getState: () => S;
  setState: React.Dispatch<React.SetStateAction<S>>;
  subscribe: (onStoreChange: SubscribeCallback) => () => void;
};

type StateSelector<State, PartialState> = (store: State) => PartialState;

type UseStoreHook<State> = <PartialState = State>(
  selector?: StateSelector<State, PartialState>
) => [PartialState, React.Dispatch<React.SetStateAction<State>>];

const useSyncStore = <State,>(
  subscribe: (onStoreChange: SubscribeCallback) => () => void,
  getSnapshot: () => State,
  getServerSnapshot?: () => State
): State => {
  const getIsomorphicSnapshot =
    typeof document !== "undefined"
      ? getSnapshot
      : getServerSnapshot ?? getSnapshot;

  const [state, setState] = React.useState(getIsomorphicSnapshot());

  const onStoreChange = React.useCallback(
    () => setState(getIsomorphicSnapshot()),
    [getIsomorphicSnapshot]
  );

  React.useEffect(() => subscribe(onStoreChange), [subscribe, onStoreChange]);

  return state;
};

/* eslint-disable */
const useSafeSyncStore =
  // We use `toString()` to prevent bundlers from trying to `import { useSyncExternalStore } from "react"`
  ((React as any)["useSyncExternalStore".toString()] as typeof useSyncStore) ??
  useSyncStore;
/* eslint-enable */

const createStoreContext = <State,>(
  initialState: State
): {
  StoreProvider: (props: { children: React.ReactNode }) => JSX.Element;
  useStore: UseStoreHook<State>;
} => {
  const StateStoreContext = React.createContext<PubSub<State> | null>(null);

  const usePubSub = (): PubSub<State> => {
    const store = React.useRef(initialState);
    const subscribers = React.useRef(new Set<SubscribeCallback>());

    const getState = React.useCallback(() => store.current, []);

    const setState = React.useCallback<
      React.Dispatch<React.SetStateAction<State>>
    >(setter => {
      const newState =
        typeof setter === "function"
          ? (setter as (prevState: State) => State)(store.current)
          : setter;

      store.current = newState;
      subscribers.current.forEach(cb => cb());
    }, []);

    const subscribe = React.useCallback((onStoreChange: SubscribeCallback) => {
      subscribers.current.add(onStoreChange);

      return () => {
        subscribers.current.delete(onStoreChange);
      };
    }, []);

    return React.useMemo(
      () => ({ getState, setState, subscribe }),
      [getState, setState, subscribe]
    );
  };

  const Provider = (props: { children: React.ReactNode }) => {
    const pubSub = usePubSub();

    return (
      <StateStoreContext.Provider value={pubSub}>
        {props.children}
      </StateStoreContext.Provider>
    );
  };

  const useStore: UseStoreHook<State> = selector => {
    const storeContext = React.useContext(StateStoreContext);

    if (!storeContext) {
      throw new Error(
        "[@utilityjs/create-store-context]: You can only use `useStore` in a subtree of `<StoreProvider>`."
      );
    }

    const safeSelector = React.useMemo(
      () => selector ?? ((state: State) => state),
      [selector]
    );

    const getSnapshot = React.useCallback(
      () => safeSelector(storeContext.getState()),
      [safeSelector, storeContext]
    );

    const state = useSafeSyncStore(
      storeContext.subscribe,
      getSnapshot,
      getSnapshot
    );

    return [state as Exclude<typeof state, State>, storeContext.setState];
  };

  return { useStore, StoreProvider: Provider };
};

export default createStoreContext;
