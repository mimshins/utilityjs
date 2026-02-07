<div align="center">

# UtilityJS | useImmutableArray

A React hook that creates an array with immutable operations.

</div>

<hr />

## Features

- **Immutable Operations**: All array operations return new arrays without
  mutating the original
- **Complete Array Methods**: Supports push, pop, shift, unshift, reverse,
  filter, and more
- **Index-based Operations**: Insert, remove, and move items by index
- **Value-based Operations**: Remove items by value with automatic filtering
- **TypeScript Support**: Full type safety with generic support for any array
  type
- **State Management**: Built-in React state management for array updates

## Installation

```bash
npm install @utilityjs/use-immutable-array
```

or

```bash
pnpm add @utilityjs/use-immutable-array
```

## Usage

### Basic Array Operations

```tsx
import { useImmutableArray } from "@utilityjs/use-immutable-array";

function TodoList() {
  const { values, push, removeByIndex, pop } = useImmutableArray<string>([
    "Learn React",
    "Build an app",
  ]);

  const addTodo = () => {
    push("New todo item");
  };

  const removeTodo = (index: number) => {
    removeByIndex(index);
  };

  return (
    <div>
      <button onClick={addTodo}>Add Todo</button>
      <button onClick={pop}>Remove Last</button>

      {values.map((todo, index) => (
        <div key={index}>
          {todo}
          <button onClick={() => removeTodo(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Advanced Operations

```tsx
import { useImmutableArray } from "@utilityjs/use-immutable-array";

function NumberList() {
  const { values, push, insertItem, moveItem, filter, reverse } =
    useImmutableArray<number>([1, 2, 3, 4, 5]);

  const addNumber = () => {
    const newNumber = Math.floor(Math.random() * 100);
    push(newNumber);
  };

  const insertAtPosition = () => {
    insertItem(2, 99); // Insert 99 at index 2
  };

  const moveFirstToLast = () => {
    moveItem(0, values.length - 1);
  };

  const filterEvenNumbers = () => {
    filter(num => num % 2 === 0);
  };

  return (
    <div>
      <div>Numbers: {values.join(", ")}</div>

      <button onClick={addNumber}>Add Random Number</button>
      <button onClick={insertAtPosition}>Insert 99 at Position 2</button>
      <button onClick={moveFirstToLast}>Move First to Last</button>
      <button onClick={filterEvenNumbers}>Keep Only Even Numbers</button>
      <button onClick={reverse}>Reverse Array</button>
    </div>
  );
}
```

### Working with Objects

```tsx
import { useImmutableArray } from "@utilityjs/use-immutable-array";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const { values, push, removeByValue, filter } = useImmutableArray<User>([
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ]);

  const addUser = () => {
    const newUser: User = {
      id: Date.now(),
      name: "New User",
      email: "newuser@example.com",
    };
    push(newUser);
  };

  const removeUser = (user: User) => {
    removeByValue(user);
  };

  const filterByName = (searchTerm: string) => {
    filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <div>
      <button onClick={addUser}>Add User</button>
      <button onClick={() => filterByName("john")}>Filter by "John"</button>

      {values.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => removeUser(user)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Manual State Control

```tsx
import { useImmutableArray } from "@utilityjs/use-immutable-array";

function ControlledArray() {
  const { values, setValues, push } = useImmutableArray<string>([]);

  const resetArray = () => {
    setValues(["Reset", "Array", "Values"]);
  };

  const loadFromAPI = async () => {
    // Simulate API call
    const apiData = await fetch("/api/data").then(res => res.json());
    setValues(apiData);
  };

  return (
    <div>
      <button onClick={() => push("New Item")}>Add Item</button>
      <button onClick={resetArray}>Reset Array</button>
      <button onClick={loadFromAPI}>Load from API</button>

      <div>Current values: {values.join(", ")}</div>
    </div>
  );
}
```

## API

### `useImmutableArray<T>(initialArray: T[])`

Creates an immutable array with various operation methods.

#### Parameters

- **`initialArray`** (`T[]`): The initial array values

#### Returns

An object containing:

- **`values`** (`T[]`): Current array values
- **`setValues`** (`Dispatch<SetStateAction<T[]>>`): Function to set array
  values directly
- **`push`** (`(value: T) => void`): Add an element to the end of the array
- **`pop`** (`() => void`): Remove the last element from the array
- **`shift`** (`() => void`): Remove the first element from the array
- **`unshift`** (`(value: T) => void`): Add an element to the beginning of the
  array
- **`reverse`** (`() => void`): Reverse the array
- **`removeByIndex`** (`(index: number) => void`): Remove an element at a
  specific index
- **`removeByValue`** (`(value: T) => void`): Remove all occurrences of a
  specific value
- **`filter`**
  (`(predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: any) => void`):
  Filter the array based on a predicate
- **`insertItem`** (`(index: number, value: T) => void`): Insert an element at a
  specific index
- **`moveItem`** (`(fromIndex: number, toIndex: number) => void`): Move an
  element from one index to another

#### Example

```tsx
const {
  values,
  push,
  pop,
  shift,
  unshift,
  reverse,
  removeByIndex,
  removeByValue,
  filter,
  insertItem,
  moveItem,
  setValues,
} = useImmutableArray<string>(["initial", "values"]);
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
