import type { SetStateAction } from "react";
import type { State } from "./types.ts";

/**
 * Union type representing all possible actions for the memento state reducer.
 *
 * @template T The type of the state value
 */
type Action<T> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; initialState: State<T> }
  | { type: "SET"; nextPresent: SetStateAction<T> };

/**
 * Type definition for the memento state reducer function.
 *
 * @template T The type of the state value
 */
export type Reducer<T> = (prevState: State<T>, action: Action<T>) => State<T>;

/**
 * Reducer function that handles state transitions for the memento pattern.
 *
 * This reducer manages the state history by handling undo, redo, set, and reset operations.
 * It maintains three arrays: past states, current state, and future states to enable
 * full undo/redo functionality.
 *
 * @template T The type of the state value
 * @param prevState - The previous state containing past, present, and future
 * @param action - The action to perform (UNDO, REDO, SET, or RESET)
 * @returns The new state after applying the action
 */
export const reducer = <T>(
  prevState: State<T>,
  action: Action<T>,
): State<T> => {
  const { past, present, future } = prevState;

  switch (action.type) {
    case "UNDO": {
      const newPresent = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: newPresent as T,
        future: [present, ...future],
      };
    }

    case "REDO": {
      const newPresent = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: newPresent as T,
        future: newFuture,
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
