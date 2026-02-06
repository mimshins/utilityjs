import {
  useCallback,
  useReducer,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { reducer, type Reducer } from "./reducer.ts";
import type { State } from "./types.ts";

export type Mementos<T> = {
  state: T;
  pastStates: T[];
  futureStates: T[];
  setState: Dispatch<SetStateAction<T>>;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  hasPastState: () => boolean;
  hasFutureState: () => boolean;
};

export const useMementoState = <T>(initialPresent: T): Mementos<T> => {
  const { current: INITIAL_STATE } = useRef<State<T>>({
    past: [],
    present: initialPresent,
    future: [],
  });

  const [state, dispatch] = useReducer(reducer as Reducer<T>, INITIAL_STATE);

  const hasFutureState = useCallback(() => state.future.length > 0, [state]);
  const hasPastState = useCallback(() => state.past.length > 0, [state]);

  const setState: Mementos<T>["setState"] = useCallback(
    nextPresent => dispatch({ type: "SET", nextPresent }),
    [],
  );

  const undo: Mementos<T>["undo"] = useCallback(() => {
    if (hasPastState()) dispatch({ type: "UNDO" });
  }, [hasPastState]);

  const redo: Mementos<T>["redo"] = useCallback(() => {
    if (hasFutureState()) dispatch({ type: "REDO" });
  }, [hasFutureState]);

  const reset: Mementos<T>["reset"] = useCallback(
    () => dispatch({ type: "RESET", initialState: INITIAL_STATE }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
    reset,
  };
};
