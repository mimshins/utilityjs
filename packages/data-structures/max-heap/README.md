<div align="center">

# UtilityJS | Max Heap

A max-heap data structure where the largest element is at the root.

</div>

<hr />

## Features

- **Max Heap Property**: Largest element always at the root
- **Custom Comparator**: Support for custom element comparison
- **Standard Operations**: Add, poll, peek, remove, find
- **Extends Heap**: Built on the abstract Heap class

## Installation

```bash
npm install @utilityjs/max-heap
```

or

```bash
pnpm add @utilityjs/max-heap
```

## Usage

### Basic Usage

```typescript
import { MaxHeap } from "@utilityjs/max-heap";

const heap = new MaxHeap<number>();

heap.add(5);
heap.add(3);
heap.add(7);
heap.add(1);

heap.peek(); // 7
heap.poll(); // 7
heap.poll(); // 5
```

### Custom Comparator

```typescript
import { MaxHeap } from "@utilityjs/max-heap";

interface Score {
  player: string;
  points: number;
}

const heap = new MaxHeap<Score>((a, b) => {
  if (a.points === b.points) return 0;
  return a.points < b.points ? -1 : 1;
});

heap.add({ player: "Alice", points: 100 });
heap.add({ player: "Bob", points: 150 });
heap.add({ player: "Charlie", points: 120 });

heap.poll(); // { player: "Bob", points: 150 }
```

## API

### `MaxHeap<T>`

Extends [`Heap<T>`](https://www.npmjs.com/package/@utilityjs/heap)

#### Constructor

- `new MaxHeap<T>(compareFunction?: CompareFunction<T>)` - Creates a max-heap
  with optional comparator

#### Inherited Methods

- `isEmpty(): boolean` - Check if the heap is empty
- `peek(): T | null` - View the maximum element without removing
- `poll(): T | null` - Remove and return the maximum element
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
