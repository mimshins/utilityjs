import type { SetStateAction } from "react";
import type { State } from "./types.ts";

type Action<T> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET"; initialState: State<T> }
  | { type: "SET"; nextPresent: SetStateAction<T> };

export type Reducer<T> = (prevState: State<T>, action: Action<T>) => State<T>;

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
