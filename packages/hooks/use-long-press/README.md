<div align="center">

# UtilityJS | useLongPress

A React hook that detects long clicks/taps.

</div>

<hr />

## Features

- **Cross-Platform**: Works with both mouse and touch events
- **Customizable Timing**: Configure press duration with `pressDelay` option
- **Movement Detection**: Cancel long press if user moves beyond threshold
- **Context Menu Control**: Option to prevent context menu on long press
- **TypeScript Support**: Full type safety with TypeScript definitions
- **Lightweight**: Minimal dependencies and optimized performance

## Installation

```bash
npm install @utilityjs/use-long-press
```

or

```bash
pnpm add @utilityjs/use-long-press
```

## Usage

### Basic Usage

```tsx
import { useLongPress } from "@utilityjs/use-long-press";

function MyComponent() {
  const { registerNode } = useLongPress(() => {
    console.log("Long press detected!");
  });

  return <button ref={registerNode}>Long press me</button>;
}
```

### With Custom Options

```tsx
import { useLongPress } from "@utilityjs/use-long-press";

function CustomLongPress() {
  const { registerNode } = useLongPress(
    () => {
      alert("Long press triggered!");
    },
    {
      pressDelay: 1000, // 1 second delay
      moveThreshold: 10, // 10px movement threshold
      preventContextMenuOnLongPress: true,
      preventLongPressOnMove: true,
    },
  );

  return (
    <div
      ref={registerNode}
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        userSelect: "none",
      }}
    >
      Long press this area
    </div>
  );
}
```

### Multiple Elements

```tsx
import { useLongPress } from "@utilityjs/use-long-press";

function MultipleElements() {
  const { registerNode: registerButton } = useLongPress(() => {
    console.log("Button long pressed");
  });

  const { registerNode: registerDiv } = useLongPress(
    () => {
      console.log("Div long pressed");
    },
    { pressDelay: 800 },
  );

  return (
    <div>
      <button ref={registerButton}>Long press button</button>
      <div ref={registerDiv}>Long press div</div>
    </div>
  );
}
```

### Context Menu Example

```tsx
import { useLongPress } from "@utilityjs/use-long-press";
import { useState } from "react";

function ContextMenuExample() {
  const [showMenu, setShowMenu] = useState(false);

  const { registerNode } = useLongPress(() => setShowMenu(true), {
    pressDelay: 500,
    preventContextMenuOnLongPress: true,
  });

  return (
    <div>
      <div
        ref={registerNode}
        style={{
          padding: "40px",
          backgroundColor: "#f0f0f0",
          position: "relative",
        }}
      >
        Long press for context menu
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "white",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <button onClick={() => setShowMenu(false)}>Close</button>
            <div>Menu Item 1</div>
            <div>Menu Item 2</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## API

### `useLongPress(callback, options?)`

A React hook that detects long press gestures on DOM elements.

#### Parameters

- `callback: () => void` - Function to call when long press is detected
- `options?: Options` - Configuration options (optional)

#### Options

```typescript
type Options = {
  /** Duration in milliseconds to wait before triggering long press (default: 500) */
  pressDelay?: number;
  /** Maximum movement in pixels before canceling long press (default: 25) */
  moveThreshold?: number;
  /** Whether to prevent context menu on long press (default: false) */
  preventContextMenuOnLongPress?: boolean;
  /** Whether to cancel long press when user moves (default: false) */
  preventLongPressOnMove?: boolean;
};
```

#### Returns

```typescript
{
  /** Function to register a DOM node for long press detection */
  registerNode: <T extends HTMLElement>(node: T | null) => void;
}
```

### Event Handling

The hook handles the following events:

- **Mouse Events**: `mousedown`, `mouseup`, `mousemove`, `mouseleave`
- **Touch Events**: `touchstart`, `touchend`, `touchmove`
- **Context Menu**: `contextmenu` (when `preventContextMenuOnLongPress` is true)

### Behavior Details

- **Press Detection**: Long press is triggered only on the main mouse button
  (left click)
- **Movement Cancellation**: If `preventLongPressOnMove` is enabled, moving
  beyond `moveThreshold` cancels the long press
- **Context Menu**: When `preventContextMenuOnLongPress` is enabled, the context
  menu is prevented during active press
- **Cleanup**: All timers and event listeners are properly cleaned up on unmount

## Use Cases

- **Context Menus**: Show custom context menus on long press
- **Mobile Interactions**: Implement mobile-friendly long press actions
- **Drag and Drop**: Initiate drag operations after long press
- **Selection Mode**: Enter selection mode on long press
- **Custom Actions**: Trigger special actions that require intentional user
  input

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
