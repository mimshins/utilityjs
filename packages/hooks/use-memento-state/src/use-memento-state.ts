import {
  useCallback,
  useReducer,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { reducer, type Reducer } from "./reducer.ts";
import type { State } from "./types.ts";

/**
 * Return type of the useMementoState hook containing state and history management functions.
 */
export type Mementos<T> = {
  /** Current state value */
  state: T;
  /** Array of past state values */
  pastStates: T[];
  /** Array of future state values (for redo functionality) */
  futureStates: T[];
  /** Function to update the current state */
  setState: Dispatch<SetStateAction<T>>;
  /** Function to undo to the previous state */
  undo: () => void;
  /** Function to redo to the next state */
  redo: () => void;
  /** Function to reset to the initial state */
  reset: () => void;
  /** Function to check if there are past states available for undo */
  hasPastState: () => boolean;
  /** Function to check if there are future states available for redo */
  hasFutureState: () => boolean;
};

/**
 * A React hook that keeps track of the history of state changes with undo/redo functionality.
 *
 * This hook implements the Memento pattern, allowing you to maintain a history of state
 * changes and navigate through them using undo and redo operations. It's useful for
 * implementing features like text editors, drawing applications, or any interface
 * that benefits from undo/redo functionality.
 *
 * @template T The type of the state value
 * @param initialPresent - The initial state value
 * @returns Object containing current state, history arrays, and control functions
 *
 * @example
 * ```tsx
 * import { useMementoState } from "@utilityjs/use-memento-state";
 *
 * function TextEditor() {
 *   const {
 *     state: text,
 *     setState: setText,
 *     undo,
 *     redo,
 *     reset,
 *     hasPastState,
 *     hasFutureState
 *   } = useMementoState('');
 *
 *   return (
 *     <div>
 *       <textarea
 *         value={text}
 *         onChange={(e) => setText(e.target.value)}
 *       />
 *       <button onClick={undo} disabled={!hasPastState()}>
 *         Undo
 *       </button>
 *       <button onClick={redo} disabled={!hasFutureState()}>
 *         Redo
 *       </button>
 *       <button onClick={reset}>Reset</button>
 *     </div>
 *   );
 * }
 * ```
 */
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
