<div align="center">

# UtilityJS | Linked List

A singly linked list data structure implementation.

</div>

<hr />

## Features

- **Singly Linked**: Efficient head and tail operations
- **Custom Comparator**: Support for custom element comparison
- **Traversal**: Iterate through nodes with callback
- **Array Conversion**: Convert to and from arrays

## Installation

```bash
npm install @utilityjs/linked-list
```

or

```bash
pnpm add @utilityjs/linked-list
```

## Usage

### Basic Usage

```typescript
import { LinkedList } from "@utilityjs/linked-list";

const list = new LinkedList<number>();

list.append(1);
list.append(2);
list.prepend(0);

list.toArray(); // [0, 1, 2]
```

### Traversal

```typescript
list.traverse((node, index) => {
  console.log(`Index ${index}: ${node.getValue()}`);
});
```

### Custom Comparator

```typescript
import { LinkedList } from "@utilityjs/linked-list";

interface Item {
  id: number;
  value: string;
}

const list = new LinkedList<Item>((a, b) => {
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
});

list.append({ id: 1, value: "first" });
list.append({ id: 2, value: "second" });
list.delete({ id: 1, value: "first" });
```

## API

### `LinkedList<T>`

#### Constructor

- `new LinkedList<T>(compareFunction?: CompareFunction<T>)` - Creates a list
  with optional comparator

#### Methods

- `getHead(): Node<T> | null` - Get the head node
- `getTail(): Node<T> | null` - Get the tail node
- `isEmpty(): boolean` - Check if the list is empty
- `getLength(): number` - Get the number of elements
- `append(value: T): void` - Add element to the end
- `prepend(value: T): void` - Add element to the beginning
- `traverse(callback: (node, index) => void | boolean): void` - Iterate through
  nodes
- `deleteHead(): void` - Remove the first element
- `deleteTail(): void` - Remove the last element
- `delete(value: T): void` - Remove first occurrence of value
- `reverse(): void` - Reverse the list order
- `fromArray(array: T[]): void` - Populate from an array
- `toArray(): T[]` - Convert to an array

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
