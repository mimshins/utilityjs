/**
 * Callback function invoked when the store state changes.
 */
export type SubscribeCallback = () => void;

/**
 * Function that selects a portion of the store state.
 *
 * @template State The full store state type
 * @template PartialState The selected portion of the state
 */
export type StateSelector<State, PartialState> = (store: State) => PartialState;

/**
 * Hook for accessing and subscribing to store state.
 *
 * @template State The full store state type
 */
export type UseStoreHook<State> = <PartialState = State>(
  selector: StateSelector<State, PartialState>,
) => PartialState;

/**
 * Factory function that creates the initial store state.
 *
 * @template S The store state type
 * @param setState Function to update the store state
 * @param getState Function to retrieve the current store state
 * @returns The initial store state
 */
export type StateFactory<S> = (
  setState: (setter: (prevState: S) => S) => void,
  getState: () => S,
) => S;
