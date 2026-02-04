<div align="center">

# UtilityJS | Queue

A First-In-First-Out (FIFO) queue data structure.

</div>

<hr />

## Features

- **FIFO Operations**: Enqueue and dequeue elements
- **Peek Support**: View front element without removal
- **TypeScript Support**: Full generic type safety

## Installation

```bash
npm install @utilityjs/queue
```

or

```bash
pnpm add @utilityjs/queue
```

## Usage

```typescript
import { Queue } from "@utilityjs/queue";

const queue = new Queue<number>();

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

queue.peek(); // 1
queue.dequeue(); // 1
queue.dequeue(); // 2
queue.isEmpty(); // false
```

## API

### `Queue<T>`

#### Constructor

- `new Queue<T>()` - Creates an empty queue

#### Methods

- `isEmpty(): boolean` - Check if the queue is empty
- `enqueue(value: T): void` - Add element to the rear
- `dequeue(): T | null` - Remove and return the front element
- `peek(): T | null` - View the front element without removing

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
