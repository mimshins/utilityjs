<div align="center">

# UtilityJS | retryWithBackoff

Executes an asynchronous function with exponential backoff retry logic.
Automatically retries on failure with increasing delays between attempts, making
your applications more resilient to transient failures.

</div>

<hr />

## Features

- **Exponential Backoff**: Automatically increases delay between retries using
  exponential backoff algorithm
- **Jitter**: Adds randomness to prevent thundering herd problem
- **Configurable**: Customize max retries, base delay, and retry conditions
- **Conditional Retry**: Optional predicate to determine which errors should
  trigger retries
- **TypeScript Support**: Full type safety with generic return types
- **Zero Dependencies**: Lightweight implementation with no external
  dependencies

## Installation

```bash
npm install @utilityjs/retry-with-backoff
```

or

```bash
pnpm add @utilityjs/retry-with-backoff
```

## Usage

### Basic Example

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

const fetchData = async () => {
  const response = await fetch("/api/data");
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

const data = await retryWithBackoff(fetchData);
```

### With Custom Options

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

const data = await retryWithBackoff(fetchData, {
  maxRetries: 5,
  baseDelay: 500,
  shouldRetry: error => error.message.includes("network"),
});
```

### Network Request with Retry

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

async function fetchWithRetry(url: string) {
  return retryWithBackoff(
    async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
    },
  );
}

const data = await fetchWithRetry("/api/users");
```

### Conditional Retry

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new NetworkError("Failed to fetch user", response.status);
  }
  return response.json();
};

// Only retry on 5xx errors, not 4xx
const user = await retryWithBackoff(() => fetchUser("123"), {
  shouldRetry: error => {
    if (error instanceof NetworkError) {
      return error.statusCode >= 500;
    }
    return true;
  },
});
```

### Database Connection

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

async function connectToDatabase() {
  return retryWithBackoff(
    async () => {
      const connection = await db.connect();
      if (!connection.isConnected) {
        throw new Error("Connection failed");
      }
      return connection;
    },
    {
      maxRetries: 5,
      baseDelay: 2000,
    },
  );
}
```

### React Component Example

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";
import { useState, useEffect } from "react";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await retryWithBackoff(
          async () => {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user");
            return response.json();
          },
          { maxRetries: 3 },
        );
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>User: {user?.name}</div>;
}
```

### File Upload with Retry

```typescript
import { retryWithBackoff } from "@utilityjs/retry-with-backoff";

async function uploadFile(file: File) {
  return retryWithBackoff(
    async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return response.json();
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      shouldRetry: error => !error.message.includes("413"), // Don't retry if file too large
    },
  );
}
```

## API

### `retryWithBackoff<T>(cb: () => Promise<T>, options?: Options): Promise<T>`

Executes an asynchronous function with exponential backoff retry logic.

**Type Parameters:**

- `T` - The return type of the callback function

**Parameters:**

- `cb: () => Promise<T>` - The asynchronous function to execute with retries
- `options?: Options` - Configuration options for retry behavior

**Returns:**

- `Promise<T>` - A promise that resolves with the callback result or rejects
  after all retries are exhausted

### Options

```typescript
type Options = {
  /**
   * Maximum number of retry attempts.
   * @default 3
   */
  maxRetries?: number;

  /**
   * Base delay in milliseconds for exponential backoff.
   * @default 1000
   */
  baseDelay?: number;

  /**
   * Optional predicate to determine if an error should trigger a retry.
   * If not provided, all errors will trigger retries.
   */
  shouldRetry?: (error: Error) => boolean;
};
```

### Utility Functions

#### `calculateBackoff(attempt: number, baseDelay?: number): number`

Calculates exponential backoff delay with jitter.

**Formula:** `baseDelay * 2^attempt + random(0-1000ms)`

**Parameters:**

- `attempt: number` - The retry attempt number (0-indexed)
- `baseDelay?: number` - The base delay in milliseconds (default: 1000)

**Returns:**

- `number` - Delay in milliseconds

#### `delay(ms: number): Promise<void>`

Delays execution for the specified duration.

**Parameters:**

- `ms: number` - Milliseconds to delay

**Returns:**

- `Promise<void>` - A promise that resolves after the delay

## Backoff Strategy

The module uses exponential backoff with jitter to prevent thundering herd
problems:

```
Delay = baseDelay * 2^attempt + random(0-1000ms)
```

**Example delays with baseDelay=1000ms:**

- Attempt 0: 1000-2000ms
- Attempt 1: 2000-3000ms
- Attempt 2: 4000-5000ms
- Attempt 3: 8000-9000ms

The jitter (random 0-1000ms) helps distribute retry attempts when multiple
clients fail simultaneously.

## Error Handling

The function will:

1. Execute the callback
2. If it succeeds, return the result
3. If it fails:
   - Check `shouldRetry` predicate (if provided)
   - If retry is allowed and attempts remain, wait with exponential backoff
   - If no retries remain, throw the last error

## Benefits

**Resilience:**

- Handles transient failures automatically
- Prevents cascading failures with backoff delays

**Flexibility:**

- Configurable retry count and delays
- Conditional retry logic for different error types

**Performance:**

- Exponential backoff prevents overwhelming failing services
- Jitter prevents thundering herd problem

**Type Safety:**

- Full TypeScript support
- Generic return types preserved

## Best Practices

1. **Set appropriate maxRetries**: Too many retries can delay error feedback
2. **Use shouldRetry wisely**: Don't retry on client errors (4xx)
3. **Consider timeout**: Combine with timeout mechanisms for long operations
4. **Log retry attempts**: Track retry patterns for monitoring
5. **Adjust baseDelay**: Match your service's recovery time

## Comparison with Manual Retry

**Manual approach:**

```typescript
let retries = 0;
while (retries < 3) {
  try {
    return await fetchData();
  } catch (error) {
    retries++;
    if (retries >= 3) throw error;
    await new Promise(resolve =>
      setTimeout(resolve, 1000 * Math.pow(2, retries)),
    );
  }
}
```

**With retryWithBackoff:**

```typescript
return retryWithBackoff(fetchData, { maxRetries: 3 });
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
