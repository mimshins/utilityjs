import type { Dispatch, SetStateAction } from "react";

/**
 * Internal reference object for managing multiple instances of the same persisted state.
 *
 * This type is used internally to track all instances of a persisted state with the same
 * name across the application, enabling synchronization between them.
 *
 * @template T The type of the state value
 */
export type InstanceRef<T> = {
  /** Array of setter functions from all instances using the same state name */
  callbacks: Array<Dispatch<SetStateAction<T>>>;
  /** The current value of the persisted state */
  value: T;
};
