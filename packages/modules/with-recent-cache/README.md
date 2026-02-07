<div align="center">

# UtilityJS | withRecentCache

Memoizes a function by caching only the most recent call result. Compares
arguments with the previous call using shallow equality.

</div>

<hr />

## Features

- **Single Result Cache**: Caches only the most recent function call result
- **Shallow Equality**: Compares arguments using shallow equality for efficiency
- **TypeScript Support**: Full type safety with generic support
- **Zero Dependencies**: Lightweight implementation
- **Performance Optimization**: Prevents redundant calculations for repeated
  calls

## Installation

```bash
npm install @utilityjs/with-recent-cache
```

or

```bash
pnpm add @utilityjs/with-recent-cache
```

## Usage

### Basic Example

```typescript
import { withRecentCache } from "@utilityjs/with-recent-cache";

const expensiveCalculation = (a: number, b: number) => {
  console.log("Computing...");
  return a * b;
};

const memoized = withRecentCache(expensiveCalculation);

memoized(2, 3); // Logs "Computing..." and returns 6
memoized(2, 3); // Returns 6 (cached, no log)
memoized(3, 4); // Logs "Computing..." and returns 12
memoized(2, 3); // Logs "Computing..." again (cache was replaced)
```

### React Component Example

```typescript
import { withRecentCache } from "@utilityjs/with-recent-cache";
import { useMemo } from "react";

function DataProcessor({ data }: { data: string[] }) {
  const processData = useMemo(
    () =>
      withRecentCache((items: string[]) => {
        console.log("Processing data...");
        return items.map((item) => item.toUpperCase());
      }),
    [],
  );

  const processed = processData(data);

  return <div>{processed.join(", ")}</div>;
}
```

### API Request Caching

```typescript
import { withRecentCache } from "@utilityjs/with-recent-cache";

const fetchUser = async (userId: string) => {
  console.log(`Fetching user ${userId}...`);
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

const cachedFetchUser = withRecentCache(fetchUser);

// First call - makes API request
await cachedFetchUser("123");

// Second call with same ID - returns cached result
await cachedFetchUser("123");

// Different ID - makes new API request and replaces cache
await cachedFetchUser("456");
```

### Complex Arguments

```typescript
import { withRecentCache } from "@utilityjs/with-recent-cache";

type Options = {
  format: string;
  locale: string;
};

const formatDate = (date: Date, options: Options) => {
  console.log("Formatting date...");
  return new Intl.DateTimeFormat(options.locale, {
    dateStyle: options.format as any,
  }).format(date);
};

const cachedFormat = withRecentCache(formatDate);

const date = new Date();
const options = { format: "short", locale: "en-US" };

cachedFormat(date, options); // Logs "Formatting date..."
cachedFormat(date, options); // Returns cached result (same references)

// New options object with same values - cache miss (different reference)
cachedFormat(date, { format: "short", locale: "en-US" });
```

## API

### `withRecentCache<TArgs, TReturn>(fn: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn`

Memoizes a function by caching only the most recent call result.

**Type Parameters:**

- `TArgs extends readonly unknown[]` - The function arguments type (tuple)
- `TReturn` - The function return type

**Parameters:**

- `fn: (...args: TArgs) => TReturn` - The function to memoize

**Returns:**

- `(...args: TArgs) => TReturn` - Memoized function that caches only the last
  result

**Behavior:**

1. Compares new arguments with cached arguments using shallow equality
2. If all arguments match (using `===`), returns cached result
3. If any argument differs, calls the original function and updates cache
4. Only stores one result at a time (most recent)

**Important Notes:**

- Uses shallow equality (`===`) for argument comparison
- Objects and arrays are compared by reference, not by value
- Cache is replaced on every new unique call
- Not suitable for functions that need to cache multiple results
- Best for functions called repeatedly with the same arguments

## When to Use

**Good use cases:**

- React render functions that receive the same props repeatedly
- Expensive calculations called multiple times with same inputs
- API requests that might be called multiple times in quick succession
- Formatting functions called repeatedly with same arguments

**Not recommended for:**

- Functions that need to cache multiple different results
- Functions where arguments are always new object/array instances
- Functions with many different argument combinations
- Long-term caching needs (use a proper cache library instead)

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
