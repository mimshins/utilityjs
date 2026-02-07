<div align="center">

# UtilityJS | createStoreContext

A React store-context that manages states of a tree where unnecessary re-renders
have been omitted thanks to the Pub/Sub design pattern.

</div>

<hr />

## Features

- **Optimized Re-renders**: Components only re-render when their selected state
  changes
- **Pub/Sub Pattern**: Efficient subscription-based state updates
- **Selector Support**: Select specific portions of state to minimize re-renders
- **TypeScript Support**: Full type safety with generics
- **Lazy Initialization**: Store is initialized only when needed
- **SSR Compatible**: Works with server-side rendering

## Installation

```bash
npm install @utilityjs/create-store-context
```

or

```bash
pnpm add @utilityjs/create-store-context
```

## Usage

### Basic Counter Example

```typescript
import createStoreContext from "@utilityjs/create-store-context";

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const { StoreProvider, useStore } = createStoreContext<CounterStore>(
  (setState) => ({
    count: 0,
    increment: () =>
      setState((prev) => ({ ...prev, count: prev.count + 1 })),
    decrement: () =>
      setState((prev) => ({ ...prev, count: prev.count - 1 })),
  }),
);

function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <Counter />
    </StoreProvider>
  );
}
```

### Complex Store Example

```typescript
import createStoreContext from "@utilityjs/create-store-context";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
};

const { StoreProvider, useStore } = createStoreContext<TodoStore>(
  (setState) => ({
    todos: [],
    addTodo: (text) =>
      setState((prev) => ({
        ...prev,
        todos: [...prev.todos, { id: Date.now().toString(), text, completed: false }],
      })),
    toggleTodo: (id) =>
      setState((prev) => ({
        ...prev,
        todos: prev.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),
    removeTodo: (id) =>
      setState((prev) => ({
        ...prev,
        todos: prev.todos.filter((todo) => todo.id !== id),
      })),
  }),
);

// Component only re-renders when todos array changes
function TodoList() {
  const todos = useStore((state) => state.todos);
  const toggleTodo = useStore((state) => state.toggleTodo);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.text} {todo.completed ? "✓" : ""}
        </li>
      ))}
    </ul>
  );
}

// Component only re-renders when addTodo function changes (never)
function AddTodo() {
  const addTodo = useStore((state) => state.addTodo);
  const [text, setText] = React.useState("");

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => addTodo(text)}>Add</button>
    </div>
  );
}
```

### Using getState for Reading Current State

```typescript
type Store = {
  count: number;
  increment: () => void;
  logCount: () => void;
};

const { StoreProvider, useStore } = createStoreContext<Store>(
  (setState, getState) => ({
    count: 0,
    increment: () => setState(prev => ({ ...prev, count: prev.count + 1 })),
    logCount: () => {
      const currentState = getState();
      console.log("Current count:", currentState.count);
    },
  }),
);
```

## API

### `createStoreContext<S>(stateFactory: StateFactory<S>)`

Creates a React context-based store with optimized re-rendering.

**Type Parameters:**

- `S` - The store state type

**Parameters:**

- `stateFactory: StateFactory<S>` - Factory function that creates the initial
  store state
  - Receives `setState` and `getState` functions
  - Returns the initial store state object

**Returns:**

An object containing:

- `StoreProvider: (props: { children: React.ReactNode }) => JSX.Element` -
  Provider component
- `useStore: UseStoreHook<S>` - Hook to access store state

### `StoreProvider`

Provider component that wraps the component tree and provides store access.

**Props:**

- `children: React.ReactNode` - Child components that can access the store

### `useStore<PartialState>(selector: StateSelector<S, PartialState>): PartialState`

Hook to access and subscribe to store state. Only re-renders when the selected
portion of state changes.

**Type Parameters:**

- `PartialState` - The type of the selected state (defaults to full state `S`)

**Parameters:**

- `selector: (state: S) => PartialState` - Function that selects a portion of
  the store state

**Returns:**

- The selected portion of the state

**Throws:**

- Error if used outside of `StoreProvider`

### Types

#### `StateFactory<S>`

```typescript
type StateFactory<S> = (
  setState: (setter: (prevState: S) => S) => void,
  getState: () => S,
) => S;
```

Factory function that creates the initial store state.

#### `StateSelector<State, PartialState>`

```typescript
type StateSelector<State, PartialState> = (store: State) => PartialState;
```

Function that selects a portion of the store state.

#### `UseStoreHook<State>`

```typescript
type UseStoreHook<State> = <PartialState = State>(
  selector: StateSelector<State, PartialState>,
) => PartialState;
```

Hook for accessing and subscribing to store state.

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
