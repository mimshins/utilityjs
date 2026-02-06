import type { Dispatch, SetStateAction } from "react";

export type SetArrayValues<T> = Dispatch<SetStateAction<T[]>>;

export type Pop = () => void;
export type Push<T> = (value: T) => void;
export type Shift = () => void;
export type Unshift<T> = (value: T) => void;
export type Reverse = () => void;
export type RemoveByIndex = (index: number) => void;
export type RemoveByValue<T> = (value: T) => void;
export type Filter<T> = (
  predicate: (value: T, index: number, array: T[]) => value is T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any,
) => void;
export type InsertItem<T> = (index: number, value: T) => void;
export type MoveItem = (fromIndex: number, toIndex: number) => void;

export type Return<T> = {
  pop: Pop;
  push: Push<T>;
  shift: Shift;
  unshift: Unshift<T>;
  reverse: Reverse;
  removeByIndex: RemoveByIndex;
  removeByValue: RemoveByValue<T>;
  filter: Filter<T>;
  insertItem: InsertItem<T>;
  moveItem: MoveItem;
  values: T[];
  setValues: SetArrayValues<T>;
};
