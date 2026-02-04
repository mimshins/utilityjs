<div align="center">

# UtilityJS | Stack

A Last-In-First-Out (LIFO) stack data structure.

</div>

<hr />

## Features

- **LIFO Operations**: Push and pop from the top
- **Peek Support**: View top element without removal
- **Array Conversion**: Convert stack to array
- **TypeScript Support**: Full generic type safety

## Installation

```bash
npm install @utilityjs/stack
```

or

```bash
pnpm add @utilityjs/stack
```

## Usage

```typescript
import { Stack } from "@utilityjs/stack";

const stack = new Stack<number>();

stack.push(1);
stack.push(2);
stack.push(3);

stack.peek(); // 3
stack.pop(); // 3
stack.pop(); // 2
stack.toArray(); // [1]
```

## API

### `Stack<T>`

#### Constructor

- `new Stack<T>()` - Creates an empty stack

#### Methods

- `isEmpty(): boolean` - Check if the stack is empty
- `push(value: T): void` - Add element to the top
- `pop(): T | null` - Remove and return the top element
- `peek(): T | null` - View the top element without removing
- `toArray(): T[]` - Convert to array (top element first)

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
