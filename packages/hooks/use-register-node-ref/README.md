<div align="center">

# UtilityJS | useRegisterNodeRef

A React hook that helps you to run some code when a DOM node mounts/dismounts.

</div>

<hr />

## Features

- **Mount/Unmount Callbacks**: Execute code when DOM nodes mount and unmount
- **Automatic Cleanup**: Handles cleanup functions automatically
- **Type-Safe**: Full TypeScript support with generic HTML element types
- **Dependency Control**: Re-register callbacks when dependencies change
- **Memory Safe**: Prevents memory leaks with proper cleanup handling
- **Flexible**: Works with any HTML element type

## Installation

```bash
npm install @utilityjs/use-register-node-ref
```

or

```bash
pnpm add @utilityjs/use-register-node-ref
```

## Usage

### Basic Usage

```tsx
import { useRegisterNodeRef } from "@utilityjs/use-register-node-ref";

function Component() {
  const registerRef = useRegisterNodeRef<HTMLDivElement>(node => {
    console.log("Node mounted:", node);

    // Return cleanup function (optional)
    return () => {
      console.log("Node unmounted");
    };
  });

  return <div ref={registerRef}>Hello World</div>;
}
```

### Event Listeners

```tsx
function ClickTracker() {
  const registerRef = useRegisterNodeRef<HTMLButtonElement>(button => {
    const handleClick = (event: MouseEvent) => {
      console.log("Button clicked:", event);
    };

    button.addEventListener("click", handleClick);

    // Cleanup event listener
    return () => {
      button.removeEventListener("click", handleClick);
    };
  });

  return <button ref={registerRef}>Click me</button>;
}
```

### Intersection Observer

```tsx
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const registerRef = useRegisterNodeRef<HTMLImageElement>(img => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  });

  return (
    <img
      ref={registerRef}
      src={isVisible ? src : "placeholder.jpg"}
      alt={alt}
    />
  );
}
```

### Resize Observer

```tsx
function ResizeTracker() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const registerRef = useRegisterNodeRef<HTMLDivElement>(div => {
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(div);

    return () => {
      resizeObserver.disconnect();
    };
  });

  return (
    <div
      ref={registerRef}
      style={{ resize: "both", overflow: "auto" }}
    >
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

### Focus Management

```tsx
function AutoFocusInput({ shouldFocus }: { shouldFocus: boolean }) {
  const registerRef = useRegisterNodeRef<HTMLInputElement>(
    input => {
      if (shouldFocus) {
        input.focus();
      }
    },
    [shouldFocus], // Re-register when shouldFocus changes
  );

  return (
    <input
      ref={registerRef}
      placeholder="Auto-focus input"
    />
  );
}
```

### Animation Setup

```tsx
function AnimatedBox() {
  const registerRef = useRegisterNodeRef<HTMLDivElement>(div => {
    // Setup animation
    const animation = div.animate(
      [{ transform: "translateX(0px)" }, { transform: "translateX(100px)" }],
      {
        duration: 2000,
        iterations: Infinity,
        direction: "alternate",
      },
    );

    return () => {
      animation.cancel();
    };
  });

  return (
    <div
      ref={registerRef}
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "blue",
      }}
    />
  );
}
```

### Third-Party Library Integration

```tsx
function ChartComponent({ data }: { data: number[] }) {
  const registerRef = useRegisterNodeRef<HTMLCanvasElement>(
    canvas => {
      // Initialize chart library
      const chart = new SomeChartLibrary(canvas, {
        data,
        type: "line",
      });

      return () => {
        // Cleanup chart instance
        chart.destroy();
      };
    },
    [data], // Re-initialize when data changes
  );

  return <canvas ref={registerRef} />;
}
```

### Multiple Event Listeners

```tsx
function InteractiveElement() {
  const registerRef = useRegisterNodeRef<HTMLDivElement>(div => {
    const handleMouseEnter = () => console.log("Mouse entered");
    const handleMouseLeave = () => console.log("Mouse left");
    const handleClick = () => console.log("Clicked");

    div.addEventListener("mouseenter", handleMouseEnter);
    div.addEventListener("mouseleave", handleMouseLeave);
    div.addEventListener("click", handleClick);

    return () => {
      div.removeEventListener("mouseenter", handleMouseEnter);
      div.removeEventListener("mouseleave", handleMouseLeave);
      div.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={registerRef}
      style={{ padding: "20px", border: "1px solid" }}
    >
      Interactive Element
    </div>
  );
}
```

## API

### `useRegisterNodeRef<T>(callback, deps?)`

#### Parameters

- `callback: Callback<T>` - Function to execute when the node mounts
- `deps?: DependencyList` - Optional dependency array (default: `[]`)

#### Returns

- `(node: T | null) => void` - Ref callback function to attach to a DOM element

### Types

```typescript
type Destructor = () => void | undefined;

type Callback<T extends HTMLElement> = (node: T) => void | Destructor;
```

## Behavior

### Mount Behavior

When a DOM node is attached to the ref:

1. Any existing cleanup function is called
2. The callback is executed with the new node
3. If the callback returns a function, it's stored as the cleanup function

### Unmount Behavior

When a DOM node is detached or the component unmounts:

1. The cleanup function (if any) is called
2. The cleanup reference is cleared

### Dependency Changes

When dependencies change:

When dependencies change:

1. The existing cleanup function is called
2. The callback is re-registered with the current node (if any)

## Use Cases

- **Event Listeners**: Attach and clean up event listeners
- **Observers**: Set up Intersection, Resize, or Mutation observers
- **Third-Party Libraries**: Initialize and cleanup library instances
- **Focus Management**: Control focus behavior on mount
- **Animation**: Set up and tear down animations
- **DOM Measurements**: Measure and track DOM element properties
- **Custom Directives**: Implement Vue-like directive behavior in React

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
