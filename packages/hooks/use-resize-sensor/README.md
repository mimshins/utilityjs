<div align="center">

# UtilityJS | useResizeSensor

A React hook that handles element resizes using native `ResizeObserver`.

</div>

<hr />

## Features

- **Native ResizeObserver**: Uses the modern ResizeObserver API for efficient
  resize detection
- **Performance Optimized**: Built-in debouncing and throttling support
- **Type-Safe**: Full TypeScript support with generic HTML element types
- **Automatic Cleanup**: Handles observer cleanup automatically
- **Flexible Configuration**: Customizable refresh rates and modes
- **Memory Efficient**: Prevents memory leaks with proper cleanup

## Installation

```bash
npm install @utilityjs/use-resize-sensor
```

or

```bash
pnpm add @utilityjs/use-resize-sensor
```

## Usage

### Basic Usage

```tsx
import { useResizeSensor } from "@utilityjs/use-resize-sensor";

function ResizableComponent() {
  const { width, height, registerNode } = useResizeSensor();

  return (
    <div
      ref={registerNode}
      style={{
        resize: "both",
        overflow: "auto",
        border: "1px solid #ccc",
        padding: "20px",
      }}
    >
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p>Resize me by dragging the corner!</p>
    </div>
  );
}
```

### With Debouncing

```tsx
function DebouncedResize() {
  const { width, height, registerNode } = useResizeSensor({
    mode: "debounce",
    rate: 300,
    leading: false,
    trailing: true,
  });

  return (
    <div
      ref={registerNode}
      style={{ resize: "both", overflow: "auto" }}
    >
      <p>
        Debounced - Width: {width}px, Height: {height}px
      </p>
    </div>
  );
}
```

### With Throttling

```tsx
function ThrottledResize() {
  const { width, height, registerNode } = useResizeSensor({
    mode: "throttle",
    rate: 100,
    leading: true,
    trailing: true,
  });

  return (
    <div
      ref={registerNode}
      style={{ resize: "both", overflow: "auto" }}
    >
      <p>
        Throttled - Width: {width}px, Height: {height}px
      </p>
    </div>
  );
}
```

### Responsive Layout

```tsx
function ResponsiveLayout() {
  const { width, registerNode } = useResizeSensor();

  const getLayout = () => {
    if (width < 480) return "mobile";
    if (width < 768) return "tablet";
    return "desktop";
  };

  return (
    <div
      ref={registerNode}
      style={{ width: "100%", padding: "20px" }}
    >
      <h2>Current Layout: {getLayout()}</h2>
      <p>Container Width: {width}px</p>
      {getLayout() === "mobile" && <MobileLayout />}
      {getLayout() === "tablet" && <TabletLayout />}
      {getLayout() === "desktop" && <DesktopLayout />}
    </div>
  );
}
```

### Chart Resizing

```tsx
function ResponsiveChart({ data }: { data: number[] }) {
  const { width, height, registerNode } = useResizeSensor({
    mode: "debounce",
    rate: 250,
  });

  useEffect(() => {
    if (width > 0 && height > 0) {
      // Redraw chart with new dimensions
      drawChart(data, width, height);
    }
  }, [width, height, data]);

  return (
    <div
      ref={registerNode}
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid #ddd",
      }}
    >
      <canvas
        width={width}
        height={height}
      />
    </div>
  );
}
```

### Grid Layout Adjustment

```tsx
function DynamicGrid({ items }: { items: any[] }) {
  const { width, registerNode } = useResizeSensor();

  const getColumns = () => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    if (width < 1200) return 3;
    return 4;
  };

  const columns = getColumns();

  return (
    <div
      ref={registerNode}
      style={{ width: "100%" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "16px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{ padding: "16px", border: "1px solid #eee" }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Conditional Rendering

```tsx
function ConditionalContent() {
  const { width, height, registerNode } = useResizeSensor();

  const showSidebar = width > 768;
  const showDetails = height > 400;

  return (
    <div
      ref={registerNode}
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
      }}
    >
      <main style={{ flex: 1, padding: "20px" }}>
        <h1>Main Content</h1>
        {showDetails && (
          <div>
            <p>Additional details shown when height > 400px</p>
            <p>Current dimensions: {width} × {height}</p>
          </div>
        )}
      </main>
      {showSidebar && (
        <aside style={{ width: "250px", padding: "20px", background: "#f5f5f5" }}>
          <h2>Sidebar</h2>
          <p>Shown when width > 768px</p>
        </aside>
      )}
    </div>
  );
}
```

### Performance Monitoring

```tsx
function PerformanceMonitor() {
  const [resizeCount, setResizeCount] = useState(0);
  const { width, height, registerNode } = useResizeSensor({
    mode: "throttle",
    rate: 50,
  });

  useEffect(() => {
    setResizeCount(count => count + 1);
  }, [width, height]);

  return (
    <div
      ref={registerNode}
      style={{ resize: "both", overflow: "auto" }}
    >
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      <p>Resize events: {resizeCount}</p>
    </div>
  );
}
```

## API

### `useResizeSensor(refreshOptions?)`

#### Parameters

- `refreshOptions?: RefreshOptions` - Optional configuration for controlling
  resize event frequency

#### Returns

Object containing:

- `width: number` - Current width of the observed element
- `height: number` - Current height of the observed element
- `registerNode: <T extends HTMLElement>(node: T | null) => void` - Ref callback
  to attach to the element

### `RefreshOptions`

Configuration object for controlling resize event refresh rate:

```typescript
type RefreshOptions = {
  mode?: "debounce" | "throttle"; // Refresh mode
  rate?: number; // Rate in milliseconds (default: 250)
  leading?: boolean; // Execute on leading edge
  trailing?: boolean; // Execute on trailing edge
};
```

#### Mode Options

- **`debounce`**: Delays execution until after the specified time has elapsed
  since the last resize
  - `leading`: `false` (default), `trailing`: `true` (default)
- **`throttle`**: Limits execution to at most once per specified time period
  - `leading`: `true` (default), `trailing`: `true` (default)

## Behavior

### Initial State

The hook starts with `width: 0` and `height: 0` until an element is registered
and measured.

### Resize Detection

Uses the native ResizeObserver API to efficiently detect size changes without
polling.

### Performance Optimization

- **Debouncing**: Useful for expensive operations that should only run after
  resizing stops
- **Throttling**: Useful for smooth animations or frequent updates during
  resizing

### Cleanup

Automatically disconnects the ResizeObserver and cancels any pending
debounced/throttled calls when:

- The component unmounts
- A new element is registered
- The element is unregistered (null)

## Browser Support

ResizeObserver is supported in all modern browsers. For older browsers, consider

ResizeObserver is supported in all modern browsers. For older browsers, consider
using a polyfill:

```bash
npm install resize-observer-polyfill
```

## Use Cases

- **Responsive Components**: Adjust layout based on container size
- **Chart Libraries**: Resize charts when container dimensions change
- **Grid Systems**: Dynamically adjust grid columns based on available space
- **Conditional Rendering**: Show/hide content based on available space
- **Performance Monitoring**: Track resize frequency for optimization
- **Canvas Sizing**: Keep canvas elements properly sized
- **Text Scaling**: Adjust font sizes based on container dimensions

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
