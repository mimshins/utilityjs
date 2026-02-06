<div align="center">

# UtilityJS | useHover

A React hook that determines if the mouse is hovering an element.

</div>

<hr />

## Features

- **Simple Hover Detection**: Easy-to-use hook for tracking mouse hover state
- **Automatic Event Management**: Handles mouseenter and mouseleave events
  automatically
- **Manual Control**: Provides setter function for programmatic hover state
  control
- **TypeScript Support**: Full type safety with proper TypeScript definitions
- **Lightweight**: Minimal overhead with efficient event handling

## Installation

```bash
npm install @utilityjs/use-hover
```

or

```bash
pnpm add @utilityjs/use-hover
```

## Usage

### Basic Usage

```tsx
import { useHover } from "@utilityjs/use-hover";

function HoverExample() {
  const { isHovered, registerRef } = useHover();

  return (
    <div
      ref={registerRef}
      style={{
        padding: "20px",
        backgroundColor: isHovered ? "lightblue" : "lightgray",
      }}
    >
      {isHovered ? "Mouse is hovering!" : "Mouse is not hovering"}
    </div>
  );
}
```

### Manual Control

```tsx
import { useHover } from "@utilityjs/use-hover";

function ManualHoverExample() {
  const { isHovered, setIsHovered, registerRef } = useHover();

  return (
    <div>
      <div
        ref={registerRef}
        style={{ padding: "20px", border: "1px solid black" }}
      >
        Hover target: {isHovered ? "Hovered" : "Not hovered"}
      </div>
      <button onClick={() => setIsHovered(true)}>Force Hover</button>
      <button onClick={() => setIsHovered(false)}>Clear Hover</button>
    </div>
  );
}
```

### Conditional Styling

```tsx
import { useHover } from "@utilityjs/use-hover";

function StyledHoverExample() {
  const { isHovered, registerRef } = useHover();

  return (
    <button
      ref={registerRef}
      className={`btn ${isHovered ? "btn-hovered" : ""}`}
      style={{
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.2s ease",
      }}
    >
      Hover me for animation
    </button>
  );
}
```

## API

### `useHover()`

A hook that tracks hover state for an element.

#### Returns

An object with the following properties:

- **`isHovered`** (`boolean`): Current hover state of the element
- **`setIsHovered`** (`Dispatch<SetStateAction<boolean>>`): Function to manually
  set the hover state
- **`registerRef`** (`<T extends HTMLElement>(node: T | null) => void`): Ref
  callback to register an element for hover tracking

#### Example

```tsx
const { isHovered, setIsHovered, registerRef } = useHover();
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
