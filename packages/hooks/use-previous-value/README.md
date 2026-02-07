<div align="center">

# UtilityJS | usePreviousValue

A React hook that returns a value from the previous render.

</div>

<hr />

## Features

- **Simple API**: Easy-to-use hook with minimal setup
- **Type-Safe**: Full TypeScript support with generic types
- **Lightweight**: Minimal overhead with efficient implementation
- **Versatile**: Works with any type of value (primitives, objects, arrays)
- **Reliable**: Consistent behavior across re-renders

## Installation

```bash
npm install @utilityjs/use-previous-value
```

or

```bash
pnpm add @utilityjs/use-previous-value
```

## Usage

### Basic Usage

```tsx
import { useState } from "react";
import { usePreviousValue } from "@utilityjs/use-previous-value";

function Counter() {
  const [count, setCount] = useState(0);
  const previousCount = usePreviousValue(count);

  return (
    <div>
      <p>Current count: {count}</p>
      <p>Previous count: {previousCount ?? "None"}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
```

### Detecting Changes

```tsx
function UserProfile({ userId }: { userId: string }) {
  const previousUserId = usePreviousValue(userId);

  useEffect(() => {
    if (previousUserId && previousUserId !== userId) {
      console.log(`User changed from ${previousUserId} to ${userId}`);
      // Perform cleanup or fetch new data
    }
  }, [userId, previousUserId]);

  return <div>User ID: {userId}</div>;
}
```

### Animation Triggers

```tsx
function AnimatedValue({ value }: { value: number }) {
  const previousValue = usePreviousValue(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  return (
    <div className={isAnimating ? "animate-pulse" : ""}>Value: {value}</div>
  );
}
```

### Form Validation

```tsx
function FormField({ value }: { value: string }) {
  const previousValue = usePreviousValue(value);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setHasChanged(true);
    }
  }, [value, previousValue]);

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
      />
      {hasChanged && <span>Field has been modified</span>}
    </div>
  );
}
```

### Complex Objects

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

function UserComponent({ user }: { user: User }) {
  const previousUser = usePreviousValue(user);

  useEffect(() => {
    if (previousUser && previousUser.id !== user.id) {
      console.log("User ID changed, refetching data...");
    }
    if (previousUser && previousUser.email !== user.email) {
      console.log("Email changed, updating subscription...");
    }
  }, [user, previousUser]);

  return (
    <div>
      {user.name} ({user.email})
    </div>
  );
}
```

## API

### `usePreviousValue<T>(value)`

#### Parameters

- `value: T` - The current value to track

#### Returns

- `T | undefined` - The value from the previous render, or `undefined` on first
  render

## Behavior

### First Render

On the first render, the hook returns `undefined` since there's no previous
value to return.

### Subsequent Renders

On each subsequent render, the hook returns the value from the previous render
and updates its internal reference to the current value.

### Memory Management

The hook uses a single `useRef` to store the previous value, making it
memory-efficient and preventing unnecessary re-renders.

## Use Cases

- **Change Detection**: Compare current and previous values to detect changes
- **Animation Triggers**: Trigger animations when values change
- **Form Validation**: Track field modifications for validation purposes
- **Data Fetching**: Prevent unnecessary API calls by comparing previous
  parameters
- **Debugging**: Log value changes during development
- **Conditional Effects**: Run effects only when specific values have changed

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
