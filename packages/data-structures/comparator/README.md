<div align="center">

# UtilityJS | Comparator

A utility class for comparing values with customizable comparison functions.

</div>

<hr />

## Features

- **Custom Comparison Functions**: Support for user-defined comparison logic
- **Type Safety**: Full TypeScript generic support
- **Comparison Methods**: Equal, less than, greater than, and their inclusive
  variants

## Installation

```bash
npm install @utilityjs/comparator
```

or

```bash
pnpm add @utilityjs/comparator
```

## Usage

### Basic Usage

```typescript
import { Comparator } from "@utilityjs/comparator";

const comparator = new Comparator<number>();

comparator.isEqual(1, 1); // true
comparator.isLessThan(1, 2); // true
comparator.isGreaterThan(2, 1); // true
```

### Custom Comparison Function

```typescript
import { Comparator, CompareFunction } from "@utilityjs/comparator";

interface Person {
  name: string;
  age: number;
}

const compareByAge: CompareFunction<Person> = (a, b) => {
  if (a.age === b.age) return 0;
  return a.age < b.age ? -1 : 1;
};

const comparator = new Comparator(compareByAge);

const alice = { name: "Alice", age: 30 };
const bob = { name: "Bob", age: 25 };

comparator.isLessThan(bob, alice); // true
comparator.isGreaterThanOrEqual(alice, bob); // true
```

## API

### `CompareFunction<T>`

```typescript
type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;
```

### `Comparator<T>`

#### Static Methods

- `Comparator.defaultComparatorFunction<T>(a: T, b: T): -1 | 0 | 1` - Default
  comparison using JavaScript operators

#### Constructor

- `new Comparator<T>(compareFunction?: CompareFunction<T>)` - Creates a
  comparator with optional custom function

#### Methods

- `isEqual(a: T, b: T): boolean` - Check if values are equal
- `isLessThan(a: T, b: T): boolean` - Check if a < b
- `isLessThanOrEqual(a: T, b: T): boolean` - Check if a <= b
- `isGreaterThan(a: T, b: T): boolean` - Check if a > b
- `isGreaterThanOrEqual(a: T, b: T): boolean` - Check if a >= b

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
