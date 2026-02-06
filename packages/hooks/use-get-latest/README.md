<div align="center">

# UtilityJS | useGetLatest

A React hook that stores & updates `ref.current` with the most recent value.

</div>

<hr />

## Features

- **Stale Closure Prevention**: Avoid stale closures in callbacks and async
  operations
- **Stable References**: Create stable callback references without exhaustive
  dependencies
- **SSR Compatible**: Uses isomorphic layout effect for server-side rendering
  compatibility
- **TypeScript Support**: Full type safety with generic support
- **Performance Optimized**: Minimal re-renders by avoiding dependency arrays
- **Simple API**: Easy to use with any value type

## Installation

```bash
npm install @utilityjs/use-get-latest
```

or

```bash
pnpm add @utilityjs/use-get-latest
```

## Usage

### Basic Example - Avoiding Stale Closures

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useState, useCallback } from "react";

function SearchComponent({ onSearch, query }) {
  const latestOnSearch = useGetLatest(onSearch);
  const latestQuery = useGetLatest(query);

  const handleSearch = useCallback(async () => {
    // These values are always fresh, even if props change
    // after this callback was created
    const results = await searchAPI(latestQuery.current);
    latestOnSearch.current(results);
  }, []); // No dependencies needed!

  return <button onClick={handleSearch}>Search for: {query}</button>;
}
```

### Interval with Dynamic Values

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useState, useEffect } from "react";

function Counter({ step, isRunning }) {
  const [count, setCount] = useState(0);
  const latestStep = useGetLatest(step);
  const latestIsRunning = useGetLatest(isRunning);

  useEffect(() => {
    const interval = setInterval(() => {
      if (latestIsRunning.current) {
        setCount(c => c + latestStep.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No need to restart interval when step or isRunning changes

  return (
    <div>
      <p>Count: {count}</p>
      <p>Step: {step}</p>
      <p>Running: {isRunning ? "Yes" : "No"}</p>
    </div>
  );
}
```

### Event Handlers with Latest State

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useState, useCallback } from "react";

function FormComponent({ onSubmit, validationRules }) {
  const [formData, setFormData] = useState({});
  const latestFormData = useGetLatest(formData);
  const latestValidationRules = useGetLatest(validationRules);
  const latestOnSubmit = useGetLatest(onSubmit);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    // Always use the latest values
    const isValid = validateForm(
      latestFormData.current,
      latestValidationRules.current,
    );

    if (isValid) {
      await latestOnSubmit.current(latestFormData.current);
    }
  }, []); // Stable callback reference

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### WebSocket with Latest Handlers

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useEffect } from "react";

function WebSocketComponent({ onMessage, onError, url }) {
  const latestOnMessage = useGetLatest(onMessage);
  const latestOnError = useGetLatest(onError);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = event => {
      // Always calls the latest onMessage handler
      latestOnMessage.current(JSON.parse(event.data));
    };

    ws.onerror = error => {
      // Always calls the latest onError handler
      latestOnError.current(error);
    };

    return () => ws.close();
  }, [url]); // Only reconnect when URL changes

  return <div>WebSocket connection active</div>;
}
```

### Debounced Function with Latest Value

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useState, useCallback, useRef } from "react";

function SearchInput({ onSearch, debounceMs = 300 }) {
  const [query, setQuery] = useState("");
  const latestQuery = useGetLatest(query);
  const latestOnSearch = useGetLatest(onSearch);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      // Uses the latest query and onSearch function
      latestOnSearch.current(latestQuery.current);
    }, debounceMs);
  }, [debounceMs]); // Only recreate when debounce time changes

  const handleInputChange = e => {
    setQuery(e.target.value);
    debouncedSearch();
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  );
}
```

### Animation with Latest Values

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useState, useEffect } from "react";

function AnimatedComponent({ targetValue, duration, onComplete }) {
  const [currentValue, setCurrentValue] = useState(0);
  const latestTargetValue = useGetLatest(targetValue);
  const latestOnComplete = useGetLatest(onComplete);

  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();
    const startValue = currentValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Always animate towards the latest target value
      const target = latestTargetValue.current;
      const newValue = startValue + (target - startValue) * progress;

      setCurrentValue(newValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Call the latest completion handler
        latestOnComplete.current?.(target);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [duration]); // Only restart animation when duration changes

  return (
    <div>
      Current: {currentValue.toFixed(2)} / Target: {targetValue}
    </div>
  );
}
```

### Custom Hook with Latest Values

```tsx
import { useGetLatest } from "@utilityjs/use-get-latest";
import { useEffect, useState } from "react";

function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[],
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const latestFetchFn = useGetLatest(fetchFn);
  const latestOnSuccess = useGetLatest(onSuccess);
  const latestOnError = useGetLatest(onError);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Always use the latest fetch function
        const result = await latestFetchFn.current();

        if (!cancelled) {
          setData(result);
          latestOnSuccess.current?.(result);
        }
      } catch (err) {
        if (!cancelled) {
          const error = err as Error;
          setError(error);
          latestOnError.current?.(error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, dependencies);

  return { data, loading, error };
}
```

## API

### `useGetLatest<T>(value)`

#### Parameters

- `value: T` - The value to store and keep updated in the ref

#### Returns

- `RefObject<T>` - A ref object with a `.current` property containing the latest
  value

#### Type Parameter

- `T` - The type of the value being stored

#### Behavior

1. **Initial Value**: The ref is initialized with the provided value
2. **Updates**: The ref is updated with the latest value on every render using
   `useLayoutEffect`
3. **SSR Safe**: Uses `useEffect` on the server and `useLayoutEffect` on the
   client
4. **Synchronous**: Updates happen synchronously during the render phase
   (client-side)

#### Use Cases

- **Stale Closures**: Prevent stale closures in event handlers, intervals, and
  async operations
- **Stable Callbacks**: Create stable callback references without exhaustive
  dependency arrays
- **Latest Values**: Access the most recent value in long-running operations
- **Performance**: Avoid unnecessary re-renders by reducing dependency arrays

#### Best Practices

1. **Use for Callbacks**: Ideal for event handlers and callback functions that
   need latest values
2. **Async Operations**: Perfect for accessing latest state in promises,
   intervals, and timeouts
3. **Stable References**: Use to create stable function references without
   dependencies
4. **Don't Overuse**: Only use when you specifically need to avoid stale
   closures
5. **Combine with useCallback**: Often used together with `useCallback` for
   stable, latest-value callbacks

#### Common Patterns

```typescript
// Pattern 1: Stable callback with latest values
const latestValue = useGetLatest(value);
const stableCallback = useCallback(() => {
  doSomething(latestValue.current);
}, []); // No dependencies needed

// Pattern 2: Async operation with latest state
const latestState = useGetLatest(state);
useEffect(() => {
  const asyncOperation = async () => {
    const result = await api.call();
    // latestState.current always has the latest value
    updateUI(latestState.current, result);
  };
  asyncOperation();
}, [trigger]); // Only depend on trigger, not state

// Pattern 3: Event handler with latest props
const latestProps = useGetLatest(props);
const handleEvent = useCallback(event => {
  processEvent(event, latestProps.current);
}, []); // Stable reference
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
