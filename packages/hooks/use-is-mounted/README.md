<div align="center">

# UtilityJS | useIsMounted

A React hook that returns `true` if the component is mounted.

</div>

<hr />

## Features

- **Mount State Tracking**: Accurately tracks component mount/unmount state
- **Memory Leak Prevention**: Prevents state updates on unmounted components
- **Async Operation Safety**: Safe to use with async operations and timers
- **Performance Optimized**: Uses useCallback for stable function reference
- **TypeScript Support**: Full type safety with proper TypeScript definitions
- **Zero Dependencies**: Lightweight implementation using only React hooks

## Installation

```bash
npm install @utilityjs/use-is-mounted
```

or

```bash
pnpm add @utilityjs/use-is-mounted
```

## Usage

### Basic Usage

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState } from "react";

function BasicExample() {
  const [count, setCount] = useState(0);
  const isMounted = useIsMounted();

  const delayedIncrement = () => {
    setTimeout(() => {
      // Only update state if component is still mounted
      if (isMounted()) {
        setCount(prev => prev + 1);
      }
    }, 1000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={delayedIncrement}>Increment after 1s</button>
    </div>
  );
}
```

### Async Data Fetching

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();

        // Only update state if component is still mounted
        if (isMounted()) {
          setUser(userData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted()) {
          setError(err instanceof Error ? err.message : "Failed to fetch user");
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [userId, isMounted]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Timer and Interval Management

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    const interval = setInterval(() => {
      // Only update if component is mounted
      if (isMounted()) {
        setSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <div>
      <p>Timer: {seconds} seconds</p>
    </div>
  );
}
```

### WebSocket Connection

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState, useEffect } from "react";

function WebSocketComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const isMounted = useIsMounted();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    setConnectionStatus("connecting");

    ws.onopen = () => {
      if (isMounted()) {
        setConnectionStatus("connected");
      }
    };

    ws.onmessage = event => {
      if (isMounted()) {
        setMessages(prev => [...prev, event.data]);
      }
    };

    ws.onclose = () => {
      if (isMounted()) {
        setConnectionStatus("disconnected");
      }
    };

    return () => {
      ws.close();
    };
  }, [isMounted]);

  return (
    <div>
      <p>Status: {connectionStatus}</p>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
}
```

### Form Submission

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMounted = useIsMounted();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Only update state if component is still mounted
      if (isMounted()) {
        setSubmitted(true);
        setSubmitting(false);
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      if (isMounted()) {
        setSubmitting(false);
        // Handle error
      }
    }
  };

  if (submitted) {
    return <div>Thank you! Your message has been sent.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        disabled={submitting}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={e =>
          setFormData(prev => ({ ...prev, email: e.target.value }))
        }
        disabled={submitting}
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={e =>
          setFormData(prev => ({ ...prev, message: e.target.value }))
        }
        disabled={submitting}
      />
      <button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
```

### Custom Hook Integration

```tsx
import { useIsMounted } from "@utilityjs/use-is-mounted";
import { useState, useCallback } from "react";

function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const execute = useCallback(
    async (asyncFn: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await asyncFn();

        if (isMounted()) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted()) {
          setError(err instanceof Error ? err.message : "An error occurred");
          setLoading(false);
        }
      }
    },
    [isMounted],
  );

  return { data, loading, error, execute };
}

function AsyncOperationExample() {
  const { data, loading, error, execute } = useAsyncOperation<string>();

  const handleFetch = () => {
    execute(async () => {
      const response = await fetch("/api/data");
      return response.text();
    });
  };

  return (
    <div>
      <button
        onClick={handleFetch}
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>
      {error && <p>Error: {error}</p>}
      {data && <p>Data: {data}</p>}
    </div>
  );
}
```

## API

### `useIsMounted(): () => boolean`

Returns a function that indicates whether the component is currently mounted.

#### Returns

- **`() => boolean`**: A function that returns `true` if the component is
  mounted, `false` otherwise

#### Example

```tsx
const isMounted = useIsMounted();

// Use in async operations
setTimeout(() => {
  if (isMounted()) {
    // Safe to update state
    setState(newValue);
  }
}, 1000);
```

## Common Use Cases

- **Async Operations**: Prevent state updates after component unmounts
- **API Calls**: Avoid memory leaks from pending HTTP requests
- **Timers and Intervals**: Safely update state in timed operations
- **WebSocket Connections**: Handle connection state changes safely
- **Form Submissions**: Prevent state updates during navigation
- **Animation Callbacks**: Avoid updating unmounted components

## Best Practices

1. **Always Check Before State Updates**: Use `isMounted()` before any
   asynchronous state update
2. **Combine with Cleanup**: Use with useEffect cleanup functions for complete
   safety
3. **Custom Hooks**: Integrate into custom hooks for reusable async logic
4. **Error Handling**: Check mount state in error handlers too

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
