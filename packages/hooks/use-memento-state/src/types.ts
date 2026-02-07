/**
 * Represents the state structure for the memento pattern implementation.
 *
 * @template T The type of the state value
 */
export type State<T> = {
  /** Array of previous state values */
  past: T[];
  /** Current state value */
  present: T;
  /** Array of future state values (for redo functionality) */
  future: T[];
};
