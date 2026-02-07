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

/**
 * Creates a pop function that removes the last element from the array.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that removes the last element
 */
export const makePop =
  <T>(array: T[], setValues: SetArrayValues<T>): Pop =>
  () =>
    setValues(array.slice(0, -1));

/**
 * Creates a push function that adds an element to the end of the array.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that adds an element to the end
 */
export const makePush =
  <T>(array: T[], setValues: SetArrayValues<T>): Push<T> =>
  (value: T) =>
    setValues([...array, value]);

/**
 * Creates a shift function that removes the first element from the array.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that removes the first element
 */
export const makeShift =
  <T>(array: T[], setValues: SetArrayValues<T>): Shift =>
  () =>
    setValues(array.slice(1));

/**
 * Creates an unshift function that adds an element to the beginning of the array.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that adds an element to the beginning
 */
export const makeUnshift =
  <T>(array: T[], setValues: SetArrayValues<T>): Unshift<T> =>
  (value: T) =>
    setValues([value, ...array]);

/**
 * Creates a reverse function that reverses the array.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that reverses the array
 */
export const makeReverse =
  <T>(array: T[], setValues: SetArrayValues<T>): Reverse =>
  () =>
    setValues([...array].reverse());

/**
 * Creates a removeByIndex function that removes an element at a specific index.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that removes an element by index
 */
export const makeRemoveByIndex =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByIndex =>
  (index: number) =>
    setValues([...array.slice(0, index), ...array.slice(index + 1)]);

/**
 * Creates a removeByValue function that removes all occurrences of a specific value.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that removes elements by value
 */
export const makeRemoveByValue =
  <T>(array: T[], setValues: SetArrayValues<T>): RemoveByValue<T> =>
  (value: T) =>
    setValues(array.filter(item => item !== value));

/**
 * Creates a filter function that filters the array based on a predicate.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that filters the array
 */
export const makeFilter =
  <T>(array: T[], setValues: SetArrayValues<T>): Filter<T> =>
  (predicate, thisArg) =>
    setValues(array.filter(predicate, thisArg));

/**
 * Creates an insertItem function that inserts an element at a specific index.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that inserts an element at a specific index
 */
export const makeInsertItem =
  <T>(array: T[], setValues: SetArrayValues<T>): InsertItem<T> =>
  (index: number, value: T) =>
    setValues([...array.slice(0, index), value, ...array.slice(index)]);

/**
 * Creates a moveItem function that moves an element from one index to another.
 *
 * @template T The type of array elements
 * @param array Current array values
 * @param setValues Function to update array state
 * @returns Function that moves an element between indices
 */
export const makeMoveItem =
  <T>(array: T[], setValues: SetArrayValues<T>): MoveItem =>
  (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newArray = [...array];
    const [movedItem] = newArray.splice(fromIndex, 1);

    newArray.splice(toIndex, 0, movedItem!);
    setValues(newArray);
  };
