<div align="center">
  <h1 align="center">
    Comparator
  </h1>
</div>

<div align="center">

A utility class that compares its comparable arguments.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/comparator?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/comparator)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/comparator?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/comparator)
[![types](https://img.shields.io/npm/types/@utilityjs/comparator?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/comparator)

```bash
npm i @utilityjs/comparator | yarn add @utilityjs/comparator
```

</div>

<hr>

## Usage

```ts
interface Item {
  type: string;
  value: number;
}

const comparator = new Comparator((a, b) => {
  if (a.value === b.value) return 0;
  return a.value < b.value ? -1 : 1;
});

// TRUE
comparator.isEqual({ type: "a", value: 0},  { type: "b", value: 0});
```

## API

### `Comparator(compareFunction?)`

```ts
declare type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;
declare class Comparator<T> {
  private compare;
  static defaultComparatorFunction: <U>(a: U, b: U) => -1 | 0 | 1;
  constructor(compareFunction?: CompareFunction<T>);
  isEqual(a: T, b: T): boolean;
  isLessThan(a: T, b: T): boolean;
  isLessThanOrEqual(a: T, b: T): boolean;
  isGreaterThan(a: T, b: T): boolean;
  isGreaterThanOrEqual(a: T, b: T): boolean;
}
```