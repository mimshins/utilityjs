import * as React from "react";

type SubscribeCallback = () => void;

type StateSelector<State, PartialState> = (store: State) => PartialState;

type UseStoreHook<State> = <PartialState = State>(
  selector: StateSelector<State, PartialState>
) => PartialState;

type StateFactory<S> = (
  setState: (setter: (prevState: S) => S) => void,
  getState: () => S
) => S;

const useSyncStore = <State,>(
  subscribe: (onStoreChange: SubscribeCallback) => () => void,
  getSnapshot: () => State,
  getServerSnapshot?: () => State
): State => {
  const getIsomorphicSnapshot =
    typeof document !== "undefined"
      ? getSnapshot
      : getServerSnapshot ?? getSnapshot;

  const [state, setState] = React.useState(getIsomorphicSnapshot);

  const onStoreChange = React.useCallback(
    () => setState(() => getIsomorphicSnapshot()),
    [getIsomorphicSnapshot]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => subscribe(onStoreChange), [onStoreChange]);

  return state;
};

const __STORE_SENTINEL__ = {};

const createStoreContext = <S,>(
  stateFactory: StateFactory<S>
): {
  StoreProvider: (props: { children: React.ReactNode }) => JSX.Element;
  useStore: UseStoreHook<S>;
} => {
  const StoreContext = React.createContext<{
    getState: () => S;
    subscribe: (onStoreChange: SubscribeCallback) => () => void;
  } | null>(null);

  if (process.env.NODE_ENV !== "production")
    StoreContext.displayName = "StoreContext";

  const StoreProvider = (props: { children: React.ReactNode }) => {
    const store = React.useRef<S>(__STORE_SENTINEL__ as S);
    const subscribers = React.useRef(new Set<SubscribeCallback>());

    const getState = React.useCallback(() => store.current, []);

    const setState = React.useCallback((setter: (prevState: S) => S) => {
      const newState = setter(store.current);

      store.current = newState;
      subscribers.current.forEach(cb => cb());
    }, []);

    // Lazy initialization
    if (store.current === __STORE_SENTINEL__)
      store.current = stateFactory(setState, getState);

    const subscribe = React.useCallback((onStoreChange: SubscribeCallback) => {
      subscribers.current.add(onStoreChange);

      return () => {
        subscribers.current.delete(onStoreChange);
      };
    }, []);

    const context = React.useMemo(
      () => ({ getState, subscribe }),
      [getState, subscribe]
    );

    return (
      <StoreContext.Provider value={context}>
        {props.children}
      </StoreContext.Provider>
    );
  };

  const useStore: UseStoreHook<S> = selector => {
    const storeContext = React.useContext(StoreContext);

    if (!storeContext) {
      throw new Error(
        "[@utilityjs/create-store-context]: You can only use `useStore` in a subtree of `<StoreProvider>`."
      );
    }

    const { getState, subscribe } = storeContext;

    const getSnapshot = React.useCallback(
      () => selector(getState()),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [selector]
    );

    return useSyncStore(subscribe, getSnapshot, getSnapshot);
  };

  return { useStore, StoreProvider };
};

export default createStoreContext;
