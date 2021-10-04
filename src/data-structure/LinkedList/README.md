<div align="center">
  <h1 align="center">
    LinkedList
  </h1>
</div>

<div align="center">

An implementation of LinkedList data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/linked-list?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/linked-list)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/linked-list?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/linked-list)
[![types](https://img.shields.io/npm/types/@utilityjs/linked-list?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/linked-list)

```bash
npm i @utilityjs/linked-list | yarn add @utilityjs/linked-list
```

</div>

<hr>

## Usage

```ts
interface Item {
  type: string;
  value: number;
}

const compareListItems = (a: Item, b: Item) => {
  if (a.value === b.value) return 0;
  return a.value < b.value ? -1 : 1;
};

const list = new LinkedList<Item>(compareListItems);

list.append({ type: "b", value: 1 }); // b -> null
list.prepend({ type: "a", value: 0 }); // a -> b -> null
list.fromArray([
  { type: "c", value: 2 },
  { type: "d", value: 3 },
  { type: "f", value: 4 },
]); // a -> b -> c -> d -> f -> null
```

## API

### `LinkedList(compareFunction?)`

```ts
export declare class Node<T> {
  constructor(value: T, next?: Node<T> | null);
  getValue(): T;
  setValue(value: T): void;
  getNext(): Node<T> | null;
  setNext(next: Node<T> | null): void;
  hasNext(): boolean;
}

export default class LinkedList<T> {
  constructor(compareFunction?: CompareFunction<T>);
  getHead(): Node<T> | null;
  getTail(): Node<T> | null;
  isEmpty(): boolean;
  getLength(): number;
  append(value: T): void;
  prepend(value: T): void;
  traverse(callback: (node: Node<T>, index: number) => void | boolean): void;
  deleteHead(): void;
  deleteTail(): void;
  delete(value: T): void;
  reverse(): void;
  fromArray(array: T[]): void;
  toArray(): T[];
}
```