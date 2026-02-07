<div align="center">

# UtilityJS | Min Heap

A min-heap data structure where the smallest element is at the root.

</div>

<hr />

## Features

- **Min Heap Property**: Smallest element always at the root
- **Custom Comparator**: Support for custom element comparison
- **Standard Operations**: Add, poll, peek, remove, find
- **Extends Heap**: Built on the abstract Heap class

## Installation

```bash
npm install @utilityjs/min-heap
```

or

```bash
pnpm add @utilityjs/min-heap
```

## Usage

### Basic Usage

```typescript
import { MinHeap } from "@utilityjs/min-heap";

const heap = new MinHeap<number>();

heap.add(5);
heap.add(3);
heap.add(7);
heap.add(1);

heap.peek(); // 1
heap.poll(); // 1
heap.poll(); // 3
```

### Custom Comparator

```typescript
import { MinHeap } from "@utilityjs/min-heap";

interface Task {
  name: string;
  priority: number;
}

const heap = new MinHeap<Task>((a, b) => {
  if (a.priority === b.priority) return 0;
  return a.priority < b.priority ? -1 : 1;
});

heap.add({ name: "Low", priority: 3 });
heap.add({ name: "High", priority: 1 });
heap.add({ name: "Medium", priority: 2 });

heap.poll(); // { name: "High", priority: 1 }
```

## API

### `MinHeap<T>`

Extends [`Heap<T>`](https://www.npmjs.com/package/@utilityjs/heap)

#### Constructor

- `new MinHeap<T>(compareFunction?: CompareFunction<T>)` - Creates a min-heap
  with optional comparator

#### Inherited Methods

- `isEmpty(): boolean` - Check if the heap is empty
- `peek(): T | null` - View the minimum element without removing
- `poll(): T | null` - Remove and return the minimum element
- `add(item: T): void` - Add an element to the heap
- `remove(item: T, comparator?): void` - Remove all occurrences of an element
- `find(item: T, comparator?): number[]` - Find all indices of an element
- `toString(): string` - String representation of the heap

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
