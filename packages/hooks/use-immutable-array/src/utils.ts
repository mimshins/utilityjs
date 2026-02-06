import type {
  Filter,
  InsertItem,
  MoveItem,
  Pop,
  Push,
  RemoveByIndex,
  RemoveByValue,
  Reverse,
  SetArrayValues,
  Shift,
  Unshift,
} from "./types.ts";

export const makePop =
  <T>(array: T[], setValues: SetArrayValues<T>): Pop =>
  () =>
    setValues(array.slice(0, -1));

export const makePush =
  <T>(array: T[], setValues: SetArrayValues<T>): Push<T> =>
  (value: T) =>
    setValues([...array, value]);

export const makeShift =
  <T>(array: T[], setValues: SetArrayValues<T>): Shift =>
  () =>
    setValues(array.slice(1));

export const makeUnshift =
  <T>(array: T[], setValues: SetArrayValues<T>): Unshift<T> =>
  (value: T) =>
    setValues([value, ...array]);

export const makeReverse =
  <T>(array: T[], setValues: SetArrayValues<T>): Reverse =>
  () =>
    setValues([...array].reverse());

export const makeRemoveByIndex =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByIndex =>
  (index: number) =>
    setValues([...array.slice(0, index), ...array.slice(index + 1)]);

export const makeRemoveByValue =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByValue<T> =>
  (value: T) =>
    setValues(array.filter(item => item !== value));

export const makeFilter =
  <T>(array: T[], setValues: SetArrayValues<T>): Filter<T> =>
  (predicate, thisArg) =>
    setValues(array.filter(predicate, thisArg));

export const makeInsertItem =
  <T>(array: T[], setValues: SetArrayValues<T>): InsertItem<T> =>
  (index: number, value: T) =>
    setValues([...array.slice(0, index), value, ...array.slice(index)]);

export const makeMoveItem =
  <T>(array: T[], setValues: SetArrayValues<T>): MoveItem =>
  (fromIndex: number, toIndex: number) => {
    if (fromIndex > toIndex) {
      setValues([
        ...array.slice(0, toIndex),
        array[fromIndex],
        ...array.slice(toIndex + 1, fromIndex),
        array[toIndex],
        ...array.slice(fromIndex + 1),
      ] as T[]);
    } else makeMoveItem(array, setValues)(toIndex, fromIndex);
  };
