<div align="center">
  <h1 align="center">
    DisjointSet
  </h1>
</div>

<div align="center">

An implementation of DisjointSet data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/disjoint-set?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/disjoint-set)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/disjoint-set?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/disjoint-set)
[![types](https://img.shields.io/npm/types/@utilityjs/disjoint-set?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/disjoint-set)

```bash
npm i @utilityjs/disjoint-set | yarn add @utilityjs/disjoint-set
```

</div>

<hr>

```ts
declare type KeyGenerator<T> = (value: T) => string;

export declare class Item<T> {
  constructor(value: T, keyGenerator?: KeyGenerator<T>);
  getKey(): string;
  getRoot(): Item<T>;
  isRoot(): boolean;
  getRank(): number;
  getChildren(): Item<T>[];
  setParent(parent: Item<T>, alsoAsParentChild?: boolean): void;
  getParent(): Item<T> | null;
  addChild(child: Item<T>): void;
}

export default class DisjointSet<T> {
  constructor(keyGenerator?: KeyGenerator<T>);
  makeSet(value: T): void;
  find(value: T): string | null;
  union(valueA: T, valueB: T): DisjointSet<T>;
  inSameSet(valueA: T, valueB: T): boolean;
}
```