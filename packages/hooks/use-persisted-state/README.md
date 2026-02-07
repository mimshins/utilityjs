<div align="center">

# UtilityJS | usePersistedState

A React hook that provides a SSR-friendly multi-tab persistent state.

</div>

<hr />

## Features

- **SSR-Friendly**: Handles server-side rendering without hydration mismatches
- **Multi-Tab Synchronization**: Automatically syncs state across browser tabs
- **Storage Agnostic**: Works with any storage implementation (localStorage,
  sessionStorage, custom)
- **Type-Safe**: Full TypeScript support with generic types
- **Instance Synchronization**: Syncs multiple instances of the same hook within
  a single tab
- **Error Handling**: Graceful fallback to initial value on storage errors

## Installation

```bash
npm install @utilityjs/use-persisted-state
```

or

```bash
pnpm add @utilityjs/use-persisted-state
```

## Usage

### Basic Usage

```tsx
import { usePersistedState } from "@utilityjs/use-persisted-state";

function Counter() {
  const [count, setCount] = usePersistedState(0, {
    name: "counter",
    storage: localStorage,
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
```

### With Function Initial Value

```tsx
const [user, setUser] = usePersistedState(() => ({ name: "", email: "" }), {
  name: "user-profile",
  storage: localStorage,
});
```

### Custom Storage Implementation

```tsx
// Custom storage that encrypts data
const encryptedStorage = {
  setItem: (key: string, value: any) => {
    const encrypted = encrypt(JSON.stringify(value));
    localStorage.setItem(key, encrypted);
  },
  getItem: (key: string) => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    try {
      return JSON.parse(decrypt(encrypted));
    } catch {
      return null;
    }
  },
};

const [sensitiveData, setSensitiveData] = usePersistedState(
  { token: "", userId: "" },
  {
    name: "auth-data",
    storage: encryptedStorage,
  },
);
```

### Session Storage

```tsx
const [tempData, setTempData] = usePersistedState(
  { sessionId: "", preferences: {} },
  {
    name: "session-data",
    storage: sessionStorage,
  },
);
```

## API

### `usePersistedState<T>(initialValue, config)`

#### Parameters

- `initialValue: T | (() => T)` - The initial state value or a function that
  returns it
- `config: Config<T>` - Configuration object

#### Returns

- `[T, Dispatch<SetStateAction<T>>]` - A tuple containing the current state and
  setter function

### `Config<T>`

Configuration object for the hook:

```typescript
type Config<T> = {
  name: string; // Unique key for the persisted state
  storage: DataStorage<T>; // Storage implementation
};
```

### `DataStorage<T>`

Interface for storage implementations:

```typescript
interface DataStorage<T> {
  setItem(key: string, value: T): void;
  getItem(key: string): T | null;
}
```

## Behavior

### SSR Handling

The hook automatically detects server-side rendering and uses the initial value
during SSR to prevent hydration mismatches. Once the client is ready, it loads
the persisted value.

### Multi-Tab Synchronization

When the persisted state changes in one tab, all other tabs using the same state
name will automatically update. This works through the browser's `storage`
event.

### Instance Synchronization

Multiple instances of the hook with the same name within a single tab will stay
synchronized. When one instance updates, all others update immediately.

### Error Handling

If storage operations fail or stored data is corrupted, the hook gracefully
falls back to the initial value without throwing errors.

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
