import * as React from "react";

type SetArrayValues<T> = React.Dispatch<React.SetStateAction<T[]>>;

type Pop = () => void;
type Push<T> = (value: T) => void;
type Shift = () => void;
type Unshift<T> = (value: T) => void;
type Reverse = () => void;
type RemoveByIndex = (index: number) => void;
type RemoveByValue<T> = (value: T) => void;
type Filter<T> = (
  predicate: (value: T, index: number, array: T[]) => value is T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
) => void;
type InsertItem<T> = (index: number, value: T) => void;
type MoveItem = (fromIndex: number, toIndex: number) => void;

const makePop =
  <T>(array: T[], setValues: SetArrayValues<T>): Pop =>
  () =>
    setValues(array.slice(0, -1));

const makePush =
  <T>(array: T[], setValues: SetArrayValues<T>): Push<T> =>
  (value: T) =>
    setValues([...array, value]);

const makeShift =
  <T>(array: T[], setValues: SetArrayValues<T>): Shift =>
  () =>
    setValues(array.slice(1));

const makeUnshift =
  <T>(array: T[], setValues: SetArrayValues<T>): Unshift<T> =>
  (value: T) =>
    setValues([value, ...array]);

const makeReverse =
  <T>(array: T[], setValues: SetArrayValues<T>): Reverse =>
  () =>
    setValues([...array].reverse());

const makeRemoveByIndex =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByIndex =>
  (index: number) =>
    setValues([...array.slice(0, index), ...array.slice(index + 1)]);

const makeRemoveByValue =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByValue<T> =>
  (value: T) =>
    setValues(array.filter(item => item !== value));

const makeFilter =
  <T>(array: T[], setValues: SetArrayValues<T>): Filter<T> =>
  (predicate, thisArg) =>
    setValues(array.filter(predicate, thisArg));

const makeInsertItem =
  <T>(array: T[], setValues: SetArrayValues<T>): InsertItem<T> =>
  (index: number, value: T) =>
    setValues([...array.slice(0, index), value, ...array.slice(index)]);

const makeMoveItem =
  <T>(array: T[], setValues: SetArrayValues<T>): MoveItem =>
  (fromIndex: number, toIndex: number) => {
    if (fromIndex > toIndex) {
      setValues([
        ...array.slice(0, toIndex),
        array[fromIndex],
        ...array.slice(toIndex + 1, fromIndex),
        array[toIndex],
        ...array.slice(fromIndex + 1)
      ]);
    } else makeMoveItem(array, setValues)(toIndex, fromIndex);
  };

interface Return<T> {
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
}

const useImmutableArray = <T>(array: T[]): Return<T> => {
  const [values, setValues] = React.useState<T[]>(array);

  return React.useMemo(
    () => ({
      pop: makePop(values, setValues),
      push: makePush(values, setValues),
      shift: makeShift(values, setValues),
      unshift: makeUnshift(values, setValues),
      reverse: makeReverse(values, setValues),
      removeByIndex: makeRemoveByIndex(values, setValues),
      removeByValue: makeRemoveByValue(values, setValues),
      filter: makeFilter(values, setValues),
      insertItem: makeInsertItem(values, setValues),
      moveItem: makeMoveItem(values, setValues),
      values,
      setValues
    }),
    [values]
  );
};

export default useImmutableArray;
