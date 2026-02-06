import * as React from "react";
import type { StateFactory, SubscribeCallback, UseStoreHook } from "./types.ts";
import { useSyncStore } from "./use-sync-store.ts";

const __STORE_SENTINEL__ = {};

const createStoreContext = <S,>(
  stateFactory: StateFactory<S>,
): {
  StoreProvider: (props: { children: React.ReactNode }) => JSX.Element;
  useStore: UseStoreHook<S>;
} => {
  const StoreContext = React.createContext<{
    getState: () => S;
    subscribe: (onStoreChange: SubscribeCallback) => () => void;
  } | null>(null);

  if (process.env["NODE_ENV"] !== "production") {
    StoreContext.displayName = "StoreContext";
  }

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
    if (store.current === __STORE_SENTINEL__) {
      store.current = stateFactory(setState, getState);
    }

    const subscribe = React.useCallback((onStoreChange: SubscribeCallback) => {
      subscribers.current.add(onStoreChange);

      return () => {
        subscribers.current.delete(onStoreChange);
      };
    }, []);

    const context = React.useMemo(
      () => ({ getState, subscribe }),
      [getState, subscribe],
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
        "[@utilityjs/create-store-context]: You can only use `useStore` in a subtree of `<StoreProvider>`.",
      );
    }

    const { getState, subscribe } = storeContext;

    const getSnapshot = React.useCallback(
      () => selector(getState()),
      [selector],
    );

    return useSyncStore(subscribe, getSnapshot, getSnapshot);
  };

  return { useStore, StoreProvider };
};

export default createStoreContext;
