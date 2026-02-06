export type SubscribeCallback = () => void;

export type StateSelector<State, PartialState> = (store: State) => PartialState;

export type UseStoreHook<State> = <PartialState = State>(
  selector: StateSelector<State, PartialState>,
) => PartialState;

export type StateFactory<S> = (
  setState: (setter: (prevState: S) => S) => void,
  getState: () => S,
) => S;
