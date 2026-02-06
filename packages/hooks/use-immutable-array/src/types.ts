import type { Dispatch, SetStateAction } from "react";

/** Type for setting array values state */
export type SetArrayValues<T> = Dispatch<SetStateAction<T[]>>;

/** Function type for removing the last element from the array */
export type Pop = () => void;

/** Function type for adding an element to the end of the array */
export type Push<T> = (value: T) => void;

/** Function type for removing the first element from the array */
export type Shift = () => void;

/** Function type for adding an element to the beginning of the array */
export type Unshift<T> = (value: T) => void;

/** Function type for reversing the array */
export type Reverse = () => void;

/** Function type for removing an element at a specific index */
export type RemoveByIndex = (index: number) => void;

/** Function type for removing all occurrences of a specific value */
export type RemoveByValue<T> = (value: T) => void;

/** Function type for filtering the array based on a predicate */
export type Filter<T> = (
  predicate: (value: T, index: number, array: T[]) => value is T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any,
) => void;

/** Function type for inserting an element at a specific index */
export type InsertItem<T> = (index: number, value: T) => void;

/** Function type for moving an element from one index to another */
export type MoveItem = (fromIndex: number, toIndex: number) => void;

/** Return type of the useImmutableArray hook */
export type Return<T> = {
  /** Remove the last element from the array */
  pop: Pop;
  /** Add an element to the end of the array */
  push: Push<T>;
  /** Remove the first element from the array */
  shift: Shift;
  /** Add an element to the beginning of the array */
  unshift: Unshift<T>;
  /** Reverse the array */
  reverse: Reverse;
  /** Remove an element at a specific index */
  removeByIndex: RemoveByIndex;
  /** Remove all occurrences of a specific value */
  removeByValue: RemoveByValue<T>;
  /** Filter the array based on a predicate */
  filter: Filter<T>;
  /** Insert an element at a specific index */
  insertItem: InsertItem<T>;
  /** Move an element from one index to another */
  moveItem: MoveItem;
  /** Current array values */
  values: T[];
  /** Function to set array values directly */
  setValues: SetArrayValues<T>;
};
