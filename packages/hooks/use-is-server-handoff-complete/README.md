<div align="center">

# UtilityJS | useIsServerHandoffComplete

A React hook that returns `true` if the SSR handoff completes.

</div>

<hr />

## Features

- **SSR Handoff Detection**: Detects when client-side hydration is complete
- **Hydration Safety**: Prevents hydration mismatches by providing a reliable
  way to detect client-side rendering
- **Global State**: Uses shared state across all hook instances for consistency
- **Zero Dependencies**: Lightweight implementation using only React hooks
- **TypeScript Support**: Full type safety with TypeScript definitions

## Installation

```bash
npm install @utilityjs/use-is-server-handoff-complete
```

or

```bash
pnpm add @utilityjs/use-is-server-handoff-complete
```

## Usage

### Basic Usage

```tsx
import { useIsServerHandoffComplete } from "@utilityjs/use-is-server-handoff-complete";

function MyComponent() {
  const isHandoffComplete = useIsServerHandoffComplete();

  if (!isHandoffComplete) {
    return <div>Loading...</div>;
  }

  return <div>Client-side content</div>;
}
```

### Conditional Client-Only Rendering

```tsx
import { useIsServerHandoffComplete } from "@utilityjs/use-is-server-handoff-complete";

function ClientOnlyComponent() {
  const isHandoffComplete = useIsServerHandoffComplete();

  return (
    <div>
      <h1>My App</h1>
      {isHandoffComplete && (
        <div>
          {/* This content only renders on the client */}
          <ClientSpecificWidget />
        </div>
      )}
    </div>
  );
}
```

### Preventing Hydration Mismatches

```tsx
import { useIsServerHandoffComplete } from "@utilityjs/use-is-server-handoff-complete";

function ResponsiveComponent() {
  const isHandoffComplete = useIsServerHandoffComplete();
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (isHandoffComplete) {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isHandoffComplete]);

  return (
    <div>
      {isHandoffComplete ? (
        <p>Window width: {windowWidth}px</p>
      ) : (
        <p>Calculating window size...</p>
      )}
    </div>
  );
}
```

## API

### `useIsServerHandoffComplete()`

A React hook that tracks the completion of server-side rendering handoff.

#### Returns

- `boolean` - `true` when the SSR handoff is complete and the component is
  running on the client, `false` during initial server render and hydration

#### Behavior

- Returns `false` during server-side rendering
- Returns `false` during the initial client-side render (hydration phase)
- Returns `true` after the first `useEffect` has run, indicating the component
  is fully hydrated
- Uses a global state that persists across all instances of the hook

## Use Cases

- **Conditional Client Rendering**: Show different content based on whether the
  app is server or client rendered
- **Hydration Safety**: Prevent hydration mismatches when using browser-only
  APIs
- **Progressive Enhancement**: Gradually enable client-side features after
  hydration
- **Performance Optimization**: Defer expensive client-side operations until
  after hydration

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
