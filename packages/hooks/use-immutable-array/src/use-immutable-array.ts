import { useMemo, useState } from "react";
import type { Return } from "./types.ts";
import {
  makeFilter,
  makeInsertItem,
  makeMoveItem,
  makePop,
  makePush,
  makeRemoveByIndex,
  makeRemoveByValue,
  makeReverse,
  makeShift,
  makeUnshift,
} from "./utils.ts";

/**
 * A React hook that provides immutable array operations with state management.
 * All operations return new arrays without mutating the original array.
 *
 * @template T The type of elements in the array
 * @param array Initial array values
 * @returns An object containing array values and immutable operation methods
 *
 * @example
 * ```tsx
 * function TodoList() {
 *   const { values, push, removeByIndex } = useImmutableArray<string>([]);
 *
 *   const addTodo = (todo: string) => push(todo);
 *   const removeTodo = (index: number) => removeByIndex(index);
 *
 *   return (
 *     <div>
 *       {values.map((todo, index) => (
 *         <div key={index}>
 *           {todo}
 *           <button onClick={() => removeTodo(index)}>Remove</button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const useImmutableArray = <T>(array: T[]): Return<T> => {
  const [values, setValues] = useState<T[]>(array);

  return useMemo(
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
      setValues,
    }),
    [values],
  );
};
