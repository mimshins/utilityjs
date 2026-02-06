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
