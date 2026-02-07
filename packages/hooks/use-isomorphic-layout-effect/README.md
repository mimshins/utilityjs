<div align="center">

# UtilityJS | useIsomorphicLayoutEffect

A React hook that schedules a `React.useLayoutEffect` with a fallback to a
`React.useEffect` for environments where layout effects should not be used (such
as server-side rendering).

</div>

<hr />

## Features

- **SSR Safe**: Prevents hydration mismatches and SSR warnings
- **Client Optimization**: Uses `useLayoutEffect` for synchronous DOM updates on
  client
- **Server Compatibility**: Falls back to `useEffect` on server environments
- **Drop-in Replacement**: Same API as `useLayoutEffect`
- **TypeScript Support**: Full type safety with proper TypeScript definitions
- **Zero Runtime Cost**: Simple conditional export with no overhead

## Installation

```bash
npm install @utilityjs/use-isomorphic-layout-effect
```

or

```bash
pnpm add @utilityjs/use-isomorphic-layout-effect
```

## Usage

### Basic Usage

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef, useState } from "react";

function MeasuredComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    if (ref.current) {
      // This runs synchronously after DOM mutations on client
      // but as regular effect on server to avoid SSR issues
      const { offsetWidth, offsetHeight } = ref.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  return (
    <div
      ref={ref}
      style={{ padding: "20px", border: "1px solid #ccc" }}
    >
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

### DOM Manipulation

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef } from "react";

function FocusedInput({ autoFocus }: { autoFocus?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (autoFocus && inputRef.current) {
      // Focus input synchronously on client, safely on server
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      placeholder="Type here..."
    />
  );
}
```

### Scroll Position Management

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRouter } from "next/router";

function ScrollToTop() {
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    // Scroll to top on route change, but only on client
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [router.pathname]);

  return null;
}
```

### Dynamic Styling

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef, useState } from "react";

function ResponsiveText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);

  useIsomorphicLayoutEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Adjust font size based on container width
        const newFontSize = Math.max(12, Math.min(24, containerWidth / 20));
        setFontSize(newFontSize);
      }
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", border: "1px solid #ccc" }}
    >
      <p style={{ fontSize: `${fontSize}px`, margin: 0 }}>
        This text scales with container width
      </p>
    </div>
  );
}
```

### Animation Setup

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef, useState } from "react";

function AnimatedBox() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (boxRef.current) {
      // Set initial state synchronously to prevent flash
      boxRef.current.style.transform = "translateY(20px)";
      boxRef.current.style.opacity = "0";

      // Trigger animation
      const timer = setTimeout(() => {
        if (boxRef.current) {
          boxRef.current.style.transition = "all 0.3s ease";
          boxRef.current.style.transform = "translateY(0)";
          boxRef.current.style.opacity = "1";
          setIsVisible(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      ref={boxRef}
      style={{
        width: "200px",
        height: "100px",
        backgroundColor: "#007bff",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isVisible ? "Animated!" : "Loading..."}
    </div>
  );
}
```

### Canvas Setup

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef } from "react";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Draw something
    ctx.fillStyle = "#007bff";
    ctx.fillRect(10, 10, 100, 50);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Canvas", 20, 35);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "200px", height: "100px", border: "1px solid #ccc" }}
    />
  );
}
```

### Third-party Library Integration

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef } from "react";

function ChartComponent({ data }: { data: number[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!chartRef.current || typeof window === "undefined") return;

    // Dynamically import chart library only on client
    import("chart.js").then(({ Chart, registerables }) => {
      Chart.register(...registerables);

      const canvas = document.createElement("canvas");
      chartRef.current!.appendChild(canvas);

      const chart = new Chart(canvas, {
        type: "line",
        data: {
          labels: data.map((_, i) => `Point ${i + 1}`),
          datasets: [
            {
              label: "Data",
              data: data,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
            },
          ],
        },
      });

      return () => chart.destroy();
    });
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: "400px", height: "200px" }}
    />
  );
}
```

### Custom Hook Integration

```tsx
import { useIsomorphicLayoutEffect } from "@utilityjs/use-isomorphic-layout-effect";
import { useRef, useState } from "react";

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateSize = () => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    };

    // Initial measurement
    updateSize();

    // Set up ResizeObserver if available
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }

    // Fallback to window resize
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { ref, size };
}

function SizeAwareComponent() {
  const { ref, size } = useElementSize<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        width: "50%",
        minHeight: "100px",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        resize: "both",
        overflow: "auto",
      }}
    >
      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
      <p>Resize me!</p>
    </div>
  );
}
```

## API

### `useIsomorphicLayoutEffect(effect: EffectCallback, deps?: DependencyList): void`

A hook that uses `useLayoutEffect` on the client and `useEffect` on the server.

#### Parameters

- **`effect`** (`EffectCallback`): The effect function to run
- **`deps`** (`DependencyList`, optional): Dependency array for the effect

#### Returns

- **`void`**: No return value

#### Example

```tsx
useIsomorphicLayoutEffect(() => {
  // Effect code here
  return () => {
    // Cleanup code here
  };
}, [dependency]);
```

## When to Use

### Use `useIsomorphicLayoutEffect` when:

- **DOM Measurements**: Reading layout properties like `offsetWidth`,
  `scrollTop`
- **Synchronous DOM Updates**: Preventing visual flicker during updates
- **Animation Setup**: Setting initial styles before animations
- **Focus Management**: Focusing elements immediately after render
- **Third-party Libraries**: Integrating libraries that need DOM access
- **SSR Applications**: Any layout effect in server-rendered apps

### Use regular `useEffect` when

- **Data Fetching**: Async operations that don't affect layout
- **Event Listeners**: Setting up non-layout related listeners
- **Timers**: setTimeout/setInterval that don't affect DOM
- **Side Effects**: Operations that don't need to be synchronous

## SSR Considerations

- **Hydration Safety**: Prevents React hydration warnings
- **Performance**: Avoids unnecessary work on the server
- **Compatibility**: Works with Next.js, Gatsby, and other SSR frameworks
- **Progressive Enhancement**: Gracefully handles server-to-client transition

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
