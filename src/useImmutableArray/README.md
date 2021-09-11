<div align="center">
  <h1 align="center">
    useImmutableArray
  </h1>
</div>

<div align="center">

A React hook that creates an array with immutable operations.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-immutable-array?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-immutable-array)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-immutable-array?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-immutable-array)
[![types](https://img.shields.io/npm/types/@utilityjs/use-immutable-array?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-immutable-array)

```bash
npm i @utilityjs/use-immutable-array | yarn add @utilityjs/use-immutable-array
```

</div>

<hr>

## Usage

```ts
const array = useImmutableArray([1, 2, 3, 4, 5]);

array.push(6) // [1, 2, 3, 4, 5, 6]
array.pop() // [1, 2, 3, 4, 5]
array.shift() // [2, 3, 4, 5]
array.shift(10) // [10, 2, 3, 4, 5]
array.reverse() // [5, 4, 3, 2, 10]
array.removeByIndex(1) // [5, 3, 2, 10]
array.removeByValue(10) // [5, 3, 2]
array.filter(item => item % 2 !== 0) // [5, 3]
array.insertItem(1, 7) // [5, 7, 3]
array.moveItem(0, 1) // [7, 5, 3]
array.values // [7, 5, 3]
array.setValues([1, 2, 3, 4]) // [1, 2, 3, 4]
```

## API

### `useImmutableArray(array)`

```ts
interface Return<T> {
  pop: () => void;
  push: (value: T) => void;
  shift: () => void;
  unshift: (value: T) => void;
  reverse: () => void;
  removeByIndex: (index: number) => void;
  removeByValue: (value: T) => void;
  filter: (
    predicate: (value: T, index: number, array: T[]) => value is T,
    thisArg?: any
  ) => void;
  insertItem: (index: number, value: T) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  values: T[];
  setValues: SetArrayValues<T>;
}

declare const useImmutableArray: <T>(array: T[]) => Return<T>;
```

#### `array`

The initial value of the immutable-array.
