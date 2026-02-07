<div align="center">

# UtilityJS | usePubSub

A React hook that provides the Publish/Subscribe pattern.

</div>

<hr />

## Features

- **Decoupled Communication**: Enable components to communicate without direct
  references
- **Global and Scoped**: Support for both global and scoped pub-sub systems
- **React Integration**: Seamless integration with React lifecycle and hooks
- **Type-Safe**: Full TypeScript support with proper type definitions
- **Lightweight**: Minimal overhead with efficient implementation
- **Automatic Cleanup**: Automatic subscription cleanup on component unmount

## Installation

```bash
npm install @utilityjs/use-pub-sub
```

or

```bash
pnpm add @utilityjs/use-pub-sub
```

## Usage

### Basic Usage

```tsx
import { createPubSub } from "@utilityjs/use-pub-sub";

// Create a pub-sub system
const { useSubscribe, publish } = createPubSub();

// Publisher component
function Publisher() {
  const handleClick = () => {
    publish("user-action");
  };

  return <button onClick={handleClick}>Trigger Action</button>;
}

// Subscriber component
function Subscriber() {
  useSubscribe("user-action", () => {
    console.log("User action triggered!");
  });

  return <div>Listening for user actions...</div>;
}
```

### Multiple Subscribers

```tsx
function App() {
  const { useSubscribe, publish } = createPubSub();

  return (
    <div>
      <Publisher publish={publish} />
      <Subscriber1 useSubscribe={useSubscribe} />
      <Subscriber2 useSubscribe={useSubscribe} />
      <Subscriber3 useSubscribe={useSubscribe} />
    </div>
  );
}

function Subscriber1({ useSubscribe }) {
  useSubscribe("notification", () => {
    console.log("Subscriber 1 received notification");
  });

  return <div>Subscriber 1</div>;
}

function Subscriber2({ useSubscribe }) {
  useSubscribe("notification", () => {
    console.log("Subscriber 2 received notification");
  });

  return <div>Subscriber 2</div>;
}
```

### Scoped Pub-Sub System

```tsx
// Create a scoped registry for isolation
const modalRegistry = {};
const { useSubscribe, publish } = createPubSub(modalRegistry);

function Modal() {
  useSubscribe("close-modal", () => {
    setIsOpen(false);
  });

  useSubscribe("open-modal", () => {
    setIsOpen(true);
  });

  return isOpen ? <div>Modal Content</div> : null;
}

function ModalControls() {
  return (
    <div>
      <button onClick={() => publish("open-modal")}>Open</button>
      <button onClick={() => publish("close-modal")}>Close</button>
    </div>
  );
}
```

### State Management Pattern

```tsx
const { useSubscribe, publish } = createPubSub();

// Global state updates
function useGlobalCounter() {
  const [count, setCount] = useState(0);

  useSubscribe("increment", () => setCount(c => c + 1));
  useSubscribe("decrement", () => setCount(c => c - 1));
  useSubscribe("reset", () => setCount(0));

  return count;
}

// Components can trigger state changes
function CounterControls() {
  return (
    <div>
      <button onClick={() => publish("increment")}>+</button>
      <button onClick={() => publish("decrement")}>-</button>
      <button onClick={() => publish("reset")}>Reset</button>
    </div>
  );
}

function CounterDisplay() {
  const count = useGlobalCounter();
  return <div>Count: {count}</div>;
}
```

### Manual Unsubscribe

```tsx
const { useSubscribe, publish, unsubscribe } = createPubSub();

function Component() {
  const callback = useCallback(() => {
    console.log("Event received");
  }, []);

  useEffect(() => {
    // Manual subscription management
    const unsub = makeSubscribe(registry)("my-channel", callback);

    return () => {
      // Manual cleanup if needed
      unsubscribe("my-channel", callback);
    };
  }, [callback, unsubscribe]);

  return <div>Component</div>;
}
```

### Event System

```tsx
const { useSubscribe, publish } = createPubSub();

// Event emitter pattern
function useEventSystem() {
  const emit = (event: string) => publish(event);

  return { emit };
}

function GameComponent() {
  const { emit } = useEventSystem();

  useSubscribe("player-died", () => {
    console.log("Game over!");
  });

  useSubscribe("level-completed", () => {
    console.log("Level completed!");
  });

  const handlePlayerDeath = () => emit("player-died");
  const handleLevelComplete = () => emit("level-completed");

  return (
    <div>
      <button onClick={handlePlayerDeath}>Player Dies</button>
      <button onClick={handleLevelComplete}>Complete Level</button>
    </div>
  );
}
```

## API

### `createPubSub(scopedRegistry?)`

Creates a pub-sub system with subscribe hook, publish, and unsubscribe
functions.

#### Parameters

- `scopedRegistry?: Registry` - Optional registry for scoped pub-sub system

#### Returns

Object containing:

- `useSubscribe: Subscribe` - React hook for subscribing to channels
- `publish: Publish` - Function to publish to channels
- `unsubscribe: Unsubscribe` - Function to manually unsubscribe

### `useSubscribe(channel, callback)`

React hook that subscribes to a channel and automatically cleans up on unmount.

#### Parameters

- `channel: string` - The channel name to subscribe to
- `callback: () => void` - Function to execute when the channel is published to

### `publish(channel)`

Publishes to a channel, executing all subscribed callbacks.

#### Parameters

- `channel: string` - The channel name to publish to

### `unsubscribe(channel, callback)`

Manually unsubscribes a callback from a channel.

#### Parameters

- `channel: string` - The channel name to unsubscribe from
- `callback: () => void` - The callback function to remove

## Types

```typescript
type Callback = () => void;
type Registry = Record<string, Callback[]>;
type Subscribe = (channel: string, callback: Callback) => void;
type Publish = (channel: string) => void;
type Unsubscribe = (channel: string, callback: Callback) => void;
```

## Use Cases

- **Component Communication**: Enable distant components to communicate
- **Event Systems**: Implement game events, UI events, or custom event systems
- **State Management**: Create simple global state management solutions
- **Modal Management**: Coordinate modal opening/closing across the app
- **Notification Systems**: Broadcast notifications to multiple subscribers
- **Theme Changes**: Notify components about theme or configuration changes

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
