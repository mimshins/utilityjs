<div align="center">
  <h1 align="center">
    MinHeap
  </h1>
</div>

<div align="center">

An implementation of MinHeap data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/min-heap?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/min-heap)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/min-heap?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/min-heap)
[![types](https://img.shields.io/npm/types/@utilityjs/min-heap?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/min-heap)

```bash
npm i @utilityjs/min-heap | yarn add @utilityjs/min-heap
```

</div>

<hr>

### `MinHeap(compareFunction?)`

```ts
class MinHeap<T> {
  constructor(compareFunction?: CompareFunction<T>);
  pairIsInCorrectOrder(firstItem: T | null, secondItem: T | null): boolean;
  getLeftChildIndex(parentIndex: number): number;
  getRightChildIndex(parentIndex: number): number;
  getParentIndex(childIndex: number): number;
  hasParent(childIndex: number): boolean;
  hasLeftChild(parentIndex: number): boolean;
  hasRightChild(parentIndex: number): boolean;
  getLeftChild(parentIndex: number): T | null;
  getRightChild(parentIndex: number): T | null;
  getParent(childIndex: number): T | null;
  isEmpty(): boolean;
  toString(): string;
  peek(): T | null;
  poll(): T | null;
  add(item: T): void;
  remove(item: T): void;
  find(item: T): number[];
  swap(index1: number, index2: number): void;
  heapifyDown(startIndex?: number): void;
  heapifyUp(startIndex?: number): void;
}
```