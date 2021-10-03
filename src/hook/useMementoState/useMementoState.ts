import * as React from "react";

type Action<T> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; initialState: State<T> }
  | { type: "SET"; nextPresent: React.SetStateAction<T> };

type State<T> = { past: T[]; present: T; future: T[] };

type Reducer<T> = (prevState: State<T>, action: Action<T>) => State<T>;

interface Mementos<T> {
  state: T;
  pastStates: T[];
  futureStates: T[];
  setState: React.Dispatch<React.SetStateAction<T>>;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  hasPastState: () => boolean;
  hasFutureState: () => boolean;
}

const reducer = <T>(prevState: State<T>, action: Action<T>) => {
  const { past, present, future } = prevState;

  switch (action.type) {
    case "UNDO": {
      const newPresent = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: newPresent,
        future: [present, ...future]
      };
    }
    case "REDO": {
      const newPresent = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: newPresent,
        future: newFuture
      };
    }
    case "SET": {
      const { nextPresent } = action;

      if (nextPresent === present) return prevState;

      type SetterFn = (prev: T) => T;

      const newPresent =
        typeof nextPresent === "function"
          ? (nextPresent as SetterFn)(present)
          : nextPresent;

      return { past: [...past, present], present: newPresent, future: [] };
    }
    case "RESET":
      return action.initialState;
    default:
      return prevState;
  }
};

const useMementoState = <T>(initialPresent: T): Mementos<T> => {
  const { current: INITIAL_STATE } = React.useRef<State<T>>({
    past: [],
    present: initialPresent,
    future: []
  });

  const [state, dispatch] = React.useReducer<Reducer<T>>(
    reducer,
    INITIAL_STATE
  );

  const hasFutureState = React.useCallback(
    () => state.future.length > 0,
    [state]
  );
  const hasPastState = React.useCallback(() => state.past.length > 0, [state]);

  const setState: Mementos<T>["setState"] = React.useCallback(
    nextPresent => dispatch({ type: "SET", nextPresent }),
    []
  );

  const undo: Mementos<T>["undo"] = React.useCallback(() => {
    if (hasPastState()) dispatch({ type: "UNDO" });
  }, [hasPastState]);

  const redo: Mementos<T>["redo"] = React.useCallback(() => {
    if (hasFutureState()) dispatch({ type: "REDO" });
  }, [hasFutureState]);

  const reset: Mementos<T>["reset"] = React.useCallback(
    () => dispatch({ type: "RESET", initialState: INITIAL_STATE }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return {
    state: state.present,
    pastStates: state.past,
    futureStates: state.future,
    setState,
    hasFutureState,
    hasPastState,
    undo,
    redo,
    reset
  };
};

export default useMementoState;
