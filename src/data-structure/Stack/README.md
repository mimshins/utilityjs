<div align="center">
  <h1 align="center">
    Stack
  </h1>
</div>

<div align="center">

An implementation of Stack data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/stack?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/stack)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/stack?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/stack)
[![types](https://img.shields.io/npm/types/@utilityjs/stack?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/stack)

```bash
npm i @utilityjs/stack | yarn add @utilityjs/stack
```

</div>

<hr>

### `Stack()`

```ts
declare default class Stack<T> {
  constructor();
  isEmpty(): boolean;
  push(value: T): void;
  pop(): T | null;
  peek(): T | null;
  toArray(): T[];
}
```