<div align="center">
  <h1 align="center">
    Queue
  </h1>
</div>

<div align="center">

An implementation of Queue data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/queue)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/queue)
[![types](https://img.shields.io/npm/types/@utilityjs/queue?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/queue)

```bash
npm i @utilityjs/queue | yarn add @utilityjs/queue
```

</div>

<hr>

### `Queue()`

```ts
declare default class Queue<T> {
  constructor();
  isEmpty(): boolean;
  enqueue(value: T): void;
  dequeue(): T | null;
  peek(): T | null;
}
```