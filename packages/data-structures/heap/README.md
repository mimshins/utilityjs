<div align="center">

# UtilityJS | Heap

An abstract heap data structure implementation.

</div>

<hr />

## Features

- **Abstract Base Class**: Extend to create min-heap or max-heap
- **Custom Comparator**: Support for custom element comparison
- **Standard Operations**: Add, poll, peek, remove, find
- **Heapify Operations**: Maintain heap property automatically

## Installation

```bash
npm install @utilityjs/heap
```

or

```bash
pnpm add @utilityjs/heap
```

## Usage

The `Heap` class is abstract and should be extended. See
[@utilityjs/min-heap](https://www.npmjs.com/package/@utilityjs/min-heap) and
[@utilityjs/max-heap](https://www.npmjs.com/package/@utilityjs/max-heap) for
concrete implementations.

### Extending Heap

```typescript
import { Heap } from "@utilityjs/heap";

class MinHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(first: T | null, second: T | null): boolean {
    if (first == null || second == null) return false;
    return this._comparator.isLessThanOrEqual(first, second);
  }
}
```

## API

### `Heap<T>`

#### Constructor

- `new Heap<T>(compareFunction?: CompareFunction<T>)` - Creates a heap with
  optional comparator

#### Methods

- `isEmpty(): boolean` - Check if the heap is empty
- `peek(): T | null` - View the root element without removing
- `poll(): T | null` - Remove and return the root element
- `add(item: T): void` - Add an element to the heap
- `remove(item: T, comparator?): void` - Remove all occurrences of an element
- `find(item: T, comparator?): number[]` - Find all indices of an element
- `toString(): string` - String representation of the heap

#### Index Methods

- `getLeftChildIndex(parentIndex): number` - Get left child index
- `getRightChildIndex(parentIndex): number` - Get right child index
- `getParentIndex(childIndex): number` - Get parent index
- `hasParent(childIndex): boolean` - Check if node has parent
- `hasLeftChild(parentIndex): boolean` - Check if node has left child
- `hasRightChild(parentIndex): boolean` - Check if node has right child
- `getLeftChild(parentIndex): T | null` - Get left child element
- `getRightChild(parentIndex): T | null` - Get right child element
- `getParent(childIndex): T | null` - Get parent element

#### Heapify Methods

- `swap(index1, index2): void` - Swap two elements
- `heapifyUp(startIndex?): void` - Move element up to maintain heap property
- `heapifyDown(startIndex?): void` - Move element down to maintain heap property

#### Abstract Methods

- `pairIsInCorrectOrder(first: T | null, second: T | null): boolean` - Define
  heap ordering

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
