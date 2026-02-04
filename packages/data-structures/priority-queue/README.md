<div align="center">

# UtilityJS | Priority Queue

A priority queue implementation using a min-heap data structure.

</div>

<hr />

## Features

- **Priority-Based Ordering**: Elements with lower priority values dequeued
  first
- **Custom Comparator**: Support for custom element comparison
- **Priority Management**: Change priority of existing elements
- **Value Lookup**: Find and check elements by value

## Installation

```bash
npm install @utilityjs/priority-queue
```

or

```bash
pnpm add @utilityjs/priority-queue
```

## Usage

### Basic Usage

```typescript
import { PriorityQueue } from "@utilityjs/priority-queue";

const pq = new PriorityQueue<string>();

pq.add("low priority task", 10);
pq.add("high priority task", 1);
pq.add("medium priority task", 5);

pq.poll(); // "high priority task"
pq.poll(); // "medium priority task"
pq.poll(); // "low priority task"
```

### Changing Priority

```typescript
const pq = new PriorityQueue<string>();

pq.add("task", 5);
pq.changePriority("task", 1); // Increase priority

pq.peek(); // "task"
```

### Custom Comparator

```typescript
import { PriorityQueue } from "@utilityjs/priority-queue";

interface Job {
  id: number;
  name: string;
}

const pq = new PriorityQueue<Job>((a, b) => {
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
});

pq.add({ id: 1, name: "Job 1" }, 5);
pq.add({ id: 2, name: "Job 2" }, 1);

pq.hasValue({ id: 1, name: "Job 1" }); // true
```

## API

### `PriorityQueue<T>`

Extends [`MinHeap<T>`](https://www.npmjs.com/package/@utilityjs/min-heap)

#### Constructor

- `new PriorityQueue<T>(compareFunction?: CompareFunction<T>)` - Creates a
  priority queue with optional comparator

#### Methods

- `add(item: T, priority?: number): void` - Add element with priority
  (default: 0)
- `remove(item: T, comparator?): void` - Remove all occurrences of an element
- `changePriority(item: T, priority: number): void` - Change priority of an
  element
- `findByValue(item: T): number[]` - Find indices of an element by value
- `hasValue(item: T): boolean` - Check if an element exists

#### Inherited Methods

- `isEmpty(): boolean` - Check if the queue is empty
- `peek(): T | null` - View the highest priority element without removing
- `poll(): T | null` - Remove and return the highest priority element

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
