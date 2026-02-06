<div align="center">

# UtilityJS | resolveThrowable

Executes a given asynchronous function and returns its result in a structured
object converting potential thrown errors into a safe `error` property. This
prevents the application from crashing due to uncaught promise rejections and
simplifies error handling in asynchronous code.

</div>

<hr />

## Features

- **Safe Error Handling**: Converts thrown errors into structured result objects
- **No Try-Catch Needed**: Eliminates the need for try-catch blocks
- **TypeScript Support**: Full type safety with generic error types
- **Promise-based**: Works with any async function
- **Discriminated Union**: Type-safe result checking with `data` and `error`
  properties

## Installation

```bash
npm install @utilityjs/resolve-throwable
```

or

```bash
pnpm add @utilityjs/resolve-throwable
```

## Usage

### Basic Example

```typescript
import { resolveThrowable } from "@utilityjs/resolve-throwable";

const fetchData = async () => {
  const response = await fetch("/api/data");
  return response.json();
};

const result = await resolveThrowable(fetchData);

if (result.error) {
  console.error("Failed to fetch data:", result.error);
} else {
  console.log("Data:", result.data);
}
```

### With Custom Error Types

```typescript
import { resolveThrowable } from "@utilityjs/resolve-throwable";

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new NetworkError("Failed to fetch user", response.status);
  }
  return response.json();
};

const result = await resolveThrowable<NetworkError, typeof fetchUser>(() =>
  fetchUser("123"),
);

if (result.error) {
  console.error(`Error ${result.error.statusCode}:`, result.error.message);
} else {
  console.log("User:", result.data);
}
```

### Multiple Operations

```typescript
import { resolveThrowable } from "@utilityjs/resolve-throwable";

async function loadUserData(userId: string) {
  const userResult = await resolveThrowable(() => fetchUser(userId));
  if (userResult.error) {
    return { error: "Failed to load user" };
  }

  const postsResult = await resolveThrowable(() =>
    fetchUserPosts(userResult.data.id),
  );
  if (postsResult.error) {
    return { error: "Failed to load posts" };
  }

  return {
    user: userResult.data,
    posts: postsResult.data,
  };
}
```

### React Component Example

```typescript
import { resolveThrowable } from "@utilityjs/resolve-throwable";
import { useState, useEffect } from "react";

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);

      const result = await resolveThrowable(async () => {
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
      });

      if (result.error) {
        setError(result.error);
      } else {
        setUser(result.data);
      }

      setLoading(false);
    };

    loadUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>User: {user?.name}</div>;
}
```

### Form Submission

```typescript
import { resolveThrowable } from "@utilityjs/resolve-throwable";

async function handleSubmit(formData: FormData) {
  const result = await resolveThrowable(async () => {
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  });

  if (result.error) {
    alert(`Submission failed: ${result.error.message}`);
    return false;
  }

  alert("Submission successful!");
  return true;
}
```

## API

### `resolveThrowable<E, F>(throwableFn: F): ThrowableResult<Awaited<ReturnType<F>>, E>`

Executes a given asynchronous function and returns its result in a structured
object.

**Type Parameters:**

- `E extends Error` - The type of error that might be thrown (defaults to
  `Error`)
- `F extends (...args: any[]) => any` - The type of the async function

**Parameters:**

- `throwableFn: F` - The asynchronous function to execute

**Returns:**

- `ThrowableResult<T, E>` - A promise that resolves to either:
  - `Success<T>`: `{ data: T, error: null }` when successful
  - `Failure<E>`: `{ data: null, error: E }` when an error is thrown

### Types

#### `ThrowableResult<T, E>`

```typescript
type ThrowableResult<T, E extends Error = Error> = Promise<
  Success<T> | Failure<E>
>;
```

The unified return type that guarantees either `data` or `error` will be
present.

#### `Success<T>`

```typescript
type Success<T> = {
  data: T;
  error: null;
};
```

Represents a successful operation result.

#### `Failure<E>`

```typescript
type Failure<E> = {
  data: null;
  error: E;
};
```

Represents a failed operation result.

## Benefits

**Type Safety:**

- TypeScript discriminated unions ensure type-safe error checking
- No need for type assertions or unsafe casts

**Cleaner Code:**

- Eliminates nested try-catch blocks
- Makes error handling explicit and visible
- Easier to compose multiple async operations

**Predictable Behavior:**

- Always returns a structured result
- No uncaught promise rejections
- Consistent error handling pattern

## Comparison with Try-Catch

**Traditional approach:**

```typescript
try {
  const data = await fetchData();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

**With resolveThrowable:**

```typescript
const result = await resolveThrowable(fetchData);
if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data);
}
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
