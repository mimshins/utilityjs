<div align="center">

# UtilityJS | useInitOnce

A React hook that holds a lazy-initialized value for a component's lifecycle.

</div>

<hr />

## Features

- **Lazy Initialization**: Initialize values only when needed, not on every
  render
- **Performance Optimization**: Avoid expensive calculations on re-renders
- **Stable References**: Maintain the same reference across component re-renders
- **TypeScript Support**: Full type safety with generic support
- **Simple API**: Easy-to-use hook with minimal overhead

## Installation

```bash
npm install @utilityjs/use-init-once
```

or

```bash
pnpm add @utilityjs/use-init-once
```

## Usage

### Basic Usage

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";

function ExpensiveComponent() {
  // This expensive calculation only runs once
  const expensiveValue = useInitOnce(() => {
    console.log("This only runs once!");
    return performExpensiveCalculation();
  });

  return <div>Result: {expensiveValue}</div>;
}

function performExpensiveCalculation() {
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.random();
  }
  return result;
}
```

### Unique ID Generation

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";

function ComponentWithUniqueId() {
  // Generate a unique ID that persists across re-renders
  const id = useInitOnce(
    () => `component-${Math.random().toString(36).substr(2, 9)}`,
  );

  return <div id={id}>Component with stable ID: {id}</div>;
}
```

### Complex Object Initialization

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";

interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

function ApiComponent() {
  // Initialize complex configuration object once
  const config = useInitOnce<Config>(() => ({
    apiUrl: process.env.REACT_APP_API_URL || "https://api.example.com",
    timeout: 5000,
    retries: 3,
  }));

  const fetchData = async () => {
    // Use the stable config object
    const response = await fetch(config.apiUrl, {
      timeout: config.timeout,
    });
    return response.json();
  };

  return (
    <div>
      <p>API URL: {config.apiUrl}</p>
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### Date/Time Initialization

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";

function TimestampComponent() {
  // Capture the component's creation time
  const createdAt = useInitOnce(() => new Date());

  // Generate a session ID that persists
  const sessionId = useInitOnce(
    () => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  );

  return (
    <div>
      <p>Component created at: {createdAt.toLocaleString()}</p>
      <p>Session ID: {sessionId}</p>
    </div>
  );
}
```

### Class Instance Initialization

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";

class DataProcessor {
  private cache = new Map();

  process(data: string): string {
    if (this.cache.has(data)) {
      return this.cache.get(data);
    }

    const result = data.toUpperCase().split("").reverse().join("");
    this.cache.set(data, result);
    return result;
  }
}

function ProcessorComponent() {
  // Initialize class instance once
  const processor = useInitOnce(() => new DataProcessor());

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleProcess = () => {
    setOutput(processor.process(input));
  };

  return (
    <div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter text to process"
      />
      <button onClick={handleProcess}>Process</button>
      <p>Output: {output}</p>
    </div>
  );
}
```

### Comparison with useMemo

```tsx
import { useInitOnce } from "@utilityjs/use-init-once";
import { useMemo } from "react";

function ComparisonExample({ dependency }: { dependency: string }) {
  // useMemo: Re-runs when dependency changes
  const memoizedValue = useMemo(() => {
    console.log("useMemo: Recalculating...");
    return `Processed: ${dependency}`;
  }, [dependency]);

  // useInitOnce: Only runs once, ignores dependency changes
  const initOnceValue = useInitOnce(() => {
    console.log("useInitOnce: Calculating once...");
    return `Initial: ${dependency}`;
  });

  return (
    <div>
      <p>Memoized: {memoizedValue}</p>
      <p>Init Once: {initOnceValue}</p>
    </div>
  );
}
```

## API

### `useInitOnce<T>(initFactory: () => T): T`

Initializes a value only once during the component's lifecycle.

#### Parameters

- **`initFactory`** (`() => T`): A function that returns the initial value. This
  function is called only once during the component's first render.

#### Returns

- **`T`**: The initialized value that persists across re-renders.

#### Type Parameters

- **`T`**: The type of the value to be initialized.

#### Example

```tsx
const value = useInitOnce(() => expensiveCalculation());
```

## Use Cases

- **Performance Optimization**: Avoid expensive calculations on every render
- **Unique ID Generation**: Create stable IDs that don't change on re-render
- **Class Instance Creation**: Initialize class instances once per component
- **Configuration Objects**: Create configuration objects that persist
- **Date/Time Snapshots**: Capture timestamps at component creation
- **Cache Initialization**: Set up caches or data structures once

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
