import * as React from "react";
import type { StateFactory, SubscribeCallback, UseStoreHook } from "./types.ts";
import { useSyncStore } from "./use-sync-store.ts";

const __STORE_SENTINEL__ = {};

/**
 * Creates a React context-based store with optimized re-rendering using the Pub/Sub pattern.
 * Components only re-render when their selected portion of the state changes.
 *
 * @template S The store state type
 * @param stateFactory Factory function that creates the initial store state
 * @returns An object containing the StoreProvider component and useStore hook
 *
 * @example
 * ```typescript
 * type Store = {
 *   count: number;
 *   increment: () => void;
 * };
 *
 * const { StoreProvider, useStore } = createStoreContext<Store>(
 *   (setState) => ({
 *     count: 0,
 *     increment: () => setState(prev => ({ ...prev, count: prev.count + 1 }))
 *   })
 * );
 *
 * // In a component
 * function Counter() {
 *   const count = useStore(state => state.count);
 *   const increment = useStore(state => state.increment);
 *   return <button onClick={increment}>{count}</button>;
 * }
 * ```
 */
const createStoreContext = <S,>(
  stateFactory: StateFactory<S>,
): {
  StoreProvider: (props: { children: React.ReactNode }) => React.JSX.Element;
  useStore: UseStoreHook<S>;
} => {
  const StoreContext = React.createContext<{
    getState: () => S;
    subscribe: (onStoreChange: SubscribeCallback) => () => void;
  } | null>(null);

  if (process.env["NODE_ENV"] !== "production") {
    StoreContext.displayName = "StoreContext";
  }

  /**
   * Provider component that wraps the component tree and provides store access.
   *
   * @param props Component props
   * @param props.children Child components that can access the store
   */
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
    // eslint-disable-next-line react-hooks/refs
    if (store.current === __STORE_SENTINEL__) {
      // eslint-disable-next-line react-hooks/refs
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

  /**
   * Hook to access and subscribe to store state.
   * Only re-renders when the selected portion of state changes.
   *
   * @template PartialState The type of the selected state
   * @param selector Function that selects a portion of the store state
   * @returns The selected portion of the state
   * @throws Error if used outside of StoreProvider
   */
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
      [getState, selector],
    );

    return useSyncStore(subscribe, getSnapshot, getSnapshot);
  };

  return { useStore, StoreProvider };
};

export default createStoreContext;
