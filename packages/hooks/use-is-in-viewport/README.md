<div align="center">

# UtilityJS | useIsInViewport

A React hook that tells you when an element enters or leaves the viewport.

</div>

<hr />

## Features

- **Intersection Observer API**: Uses the native Intersection Observer for
  efficient viewport detection
- **Shared Observers**: Automatically shares observers between elements with
  identical configurations
- **Flexible Configuration**: Supports all IntersectionObserver options
  (threshold, rootMargin, root)
- **Performance Optimized**: Lazy loading and idle callback fallbacks for better
  performance
- **One-time Detection**: Optional `once` mode to stop observing after first
  intersection
- **TypeScript Support**: Full type safety with proper TypeScript definitions
- **Cross-platform**: Works in all environments with proper fallbacks

## Installation

```bash
npm install @utilityjs/use-is-in-viewport
```

or

```bash
pnpm add @utilityjs/use-is-in-viewport
```

## Usage

### Basic Usage

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";

function BasicExample() {
  const { registerNode, isInViewport } = useIsInViewport();

  return (
    <div
      ref={registerNode}
      style={{
        height: "200px",
        backgroundColor: isInViewport ? "green" : "red",
      }}
    >
      {isInViewport ? "In viewport!" : "Not in viewport"}
    </div>
  );
}
```

### Lazy Loading Images

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";

function LazyImage({
  src,
  alt,
  placeholder,
}: {
  src: string;
  alt: string;
  placeholder?: string;
}) {
  const { registerNode, isInViewport } = useIsInViewport({
    threshold: 0.1,
    once: true, // Stop observing after first intersection
  });

  return (
    <div
      ref={registerNode}
      style={{ minHeight: "200px" }}
    >
      {isInViewport ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
        />
      ) : (
        <div style={{ backgroundColor: "#f0f0f0", height: "200px" }}>
          {placeholder || "Loading..."}
        </div>
      )}
    </div>
  );
}
```

### Scroll Animations

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const { registerNode, isInViewport } = useIsInViewport({
    threshold: 0.5,
    rootMargin: "50px", // Trigger 50px before entering viewport
  });

  return (
    <section
      ref={registerNode}
      style={{
        transform: isInViewport ? "translateY(0)" : "translateY(50px)",
        opacity: isInViewport ? 1 : 0,
        transition: "all 0.6s ease-out",
      }}
    >
      {children}
    </section>
  );
}
```

### Infinite Scrolling

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";
import { useEffect, useState } from "react";

function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);

  const { registerNode, isInViewport } = useIsInViewport({
    threshold: 1.0, // Fully visible
  });

  useEffect(() => {
    if (isInViewport && !loading) {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setItems(prev => [
          ...prev,
          ...Array.from({ length: 10 }, (_, i) => prev.length + i),
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [isInViewport, loading]);

  return (
    <div>
      {items.map(item => (
        <div
          key={item}
          style={{
            height: "100px",
            border: "1px solid #ccc",
            margin: "10px 0",
          }}
        >
          Item {item}
        </div>
      ))}

      <div
        ref={registerNode}
        style={{ height: "50px", textAlign: "center" }}
      >
        {loading ? "Loading more..." : "Scroll to load more"}
      </div>
    </div>
  );
}
```

### Analytics Tracking

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";
import { useEffect } from "react";

function TrackableSection({
  sectionName,
  children,
}: {
  sectionName: string;
  children: React.ReactNode;
}) {
  const { registerNode, isInViewport } = useIsInViewport({
    threshold: 0.5,
    once: true,
  });

  useEffect(() => {
    if (isInViewport) {
      // Track section view
      console.log(`Section "${sectionName}" viewed`);
      // analytics.track('section_viewed', { section: sectionName });
    }
  }, [isInViewport, sectionName]);

  return <section ref={registerNode}>{children}</section>;
}
```

### Custom Root Element

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";
import { useRef } from "react";

function ScrollableContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { registerNode, isInViewport } = useIsInViewport({
    root: containerRef.current, // Use custom container as root
    threshold: 0.5,
  });

  return (
    <div
      ref={containerRef}
      style={{ height: "300px", overflow: "auto", border: "1px solid #ccc" }}
    >
      <div style={{ height: "200px" }}>Scroll down...</div>

      <div
        ref={registerNode}
        style={{
          height: "100px",
          backgroundColor: isInViewport ? "green" : "red",
        }}
      >
        {isInViewport ? "Visible in container!" : "Not visible in container"}
      </div>

      <div style={{ height: "200px" }}>More content...</div>
    </div>
  );
}
```

### Multiple Thresholds

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";

function ProgressiveReveal() {
  const { registerNode, isInViewport } = useIsInViewport({
    threshold: [0, 0.25, 0.5, 0.75, 1.0], // Multiple intersection points
  });

  return (
    <div
      ref={registerNode}
      style={{
        height: "400px",
        background: `linear-gradient(to bottom, ${isInViewport ? "blue" : "gray"}, white)`,
        transition: "background 0.3s ease",
      }}
    >
      Progressive reveal content
    </div>
  );
}
```

### Conditional Observing

```tsx
import { useIsInViewport } from "@utilityjs/use-is-in-viewport";
import { useState } from "react";

function ConditionalObserver() {
  const [enabled, setEnabled] = useState(true);

  const { registerNode, isInViewport } = useIsInViewport({
    disabled: !enabled, // Disable observation when not needed
    threshold: 0.5,
  });

  return (
    <div>
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? "Disable" : "Enable"} Observer
      </button>

      <div
        ref={registerNode}
        style={{ height: "200px", marginTop: "20px" }}
      >
        Observer {enabled ? "enabled" : "disabled"}:{" "}
        {isInViewport ? "In view" : "Not in view"}
      </div>
    </div>
  );
}
```

## API

### `useIsInViewport(options?: IntersectionObserverInit & Options)`

Detects when an element enters or leaves the viewport using the Intersection
Observer API.

#### Parameters

- **`options`** (`IntersectionObserverInit & Options`, optional): Configuration
  options

##### IntersectionObserverInit Options

- **`threshold`** (`number | number[]`, default: `[0, 1]`): Threshold(s) at
  which to trigger intersection
- **`root`** (`Element | Document | null`, default: `null`): Root element for
  intersection (viewport if null)
- **`rootMargin`** (`string`, default: `"0px"`): Margin around the root element

##### Custom Options

- **`once`** (`boolean`, default: `false`): Stop observing after first
  intersection
- **`disabled`** (`boolean`, default: `false`): Disable the observer

#### Returns

An object containing:

- **`registerNode`** (`(node: HTMLElement | null) => void`): Function to
  register a DOM element for observation
- **`isInViewport`** (`boolean`): Whether the element is currently in the
  viewport

#### Example

```tsx
const { registerNode, isInViewport } = useIsInViewport({
  threshold: 0.5,
  rootMargin: "50px",
  once: true,
  disabled: false,
});
```

## Performance Considerations

- **Shared Observers**: The hook automatically shares IntersectionObserver
  instances between elements with identical configurations
- **Automatic Cleanup**: Observers are automatically cleaned up when no elements
  are being watched
- **Idle Callback Fallback**: Uses requestIdleCallback for better performance
  when IntersectionObserver is not available
- **Memory Efficient**: Weak references are used to prevent memory leaks

## Browser Support

- **Modern Browsers**: Full support with native IntersectionObserver
- **Legacy Browsers**: Graceful fallback using idle callbacks
- **Server-Side Rendering**: Safe to use with SSR frameworks

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
