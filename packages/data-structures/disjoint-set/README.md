<div align="center">

# UtilityJS | Disjoint Set

A Union-Find data structure with path compression and union by rank.

</div>

<hr />

## Features

- **Path Compression**: Optimized find operations
- **Union by Rank**: Balanced tree structure for efficient unions
- **Custom Key Generator**: Support for complex value types
- **Method Chaining**: Fluent API design

## Installation

```bash
npm install @utilityjs/disjoint-set
```

or

```bash
pnpm add @utilityjs/disjoint-set
```

## Usage

### Basic Usage

```typescript
import DisjointSet from "@utilityjs/disjoint-set";

const ds = new DisjointSet<string>();

ds.makeSet("A").makeSet("B").makeSet("C");

ds.union("A", "B");

ds.inSameSet("A", "B"); // true
ds.inSameSet("A", "C"); // false
```

### Custom Key Generator

```typescript
import DisjointSet from "@utilityjs/disjoint-set";

interface Node {
  id: number;
  name: string;
}

const ds = new DisjointSet<Node>(node => String(node.id));

ds.makeSet({ id: 1, name: "Node 1" });
ds.makeSet({ id: 2, name: "Node 2" });

ds.union({ id: 1, name: "Node 1" }, { id: 2, name: "Node 2" });
```

## API

### `KeyGenerator<T>`

```typescript
type KeyGenerator<T> = (value: T) => string;
```

### `DisjointSet<T>`

#### Constructor

- `new DisjointSet<T>(keyGenerator?: KeyGenerator<T>)` - Creates a disjoint set
  with optional key generator (defaults to JSON.stringify)

#### Methods

- `makeSet(value: T): DisjointSet<T>` - Create a new set containing the value
- `find(value: T): string | null` - Find the root key of the set containing the
  value
- `union(valueA: T, valueB: T): DisjointSet<T>` - Unite the sets containing both
  values
- `inSameSet(valueA: T, valueB: T): boolean` - Check if values are in the same
  set

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
