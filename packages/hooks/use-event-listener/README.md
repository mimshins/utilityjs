<div align="center">

# UtilityJS | useEventListener

A React hook that handles binding/unbinding event listeners in a smart way.

</div>

<hr />

## Features

- **Type Safety**: Full TypeScript support with proper event type inference
- **Multiple Targets**: Support for HTMLElement, Document, and Window event
  targets
- **Ref Support**: Works with React refs and direct element references
- **Smart Options**: Automatic browser compatibility handling for event listener
  options
- **Automatic Cleanup**: Automatically removes event listeners on unmount
- **Conditional Attachment**: Optional conditional event listener attachment
- **Performance Optimized**: Uses latest ref pattern to avoid unnecessary
  re-renders

## Installation

```bash
npm install @utilityjs/use-event-listener
```

or

```bash
pnpm add @utilityjs/use-event-listener
```

## Usage

### Window Events

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";

function WindowResizeComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEventListener({
    target: window,
    eventType: "resize",
    handler: () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    },
  });

  return (
    <div>
      Window size: {windowSize.width} x {windowSize.height}
    </div>
  );
}
```

### Element Events with Refs

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";
import { useRef } from "react";

function ButtonComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickCount, setClickCount] = useState(0);

  useEventListener({
    target: buttonRef,
    eventType: "click",
    handler: e => {
      console.log("Button clicked!", e);
      setClickCount(count => count + 1);
    },
  });

  return (
    <div>
      <button ref={buttonRef}>Click me! (Clicked {clickCount} times)</button>
    </div>
  );
}
```

### Document Events

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";

function KeyboardShortcuts() {
  const [lastKey, setLastKey] = useState<string>("");

  useEventListener({
    target: document,
    eventType: "keydown",
    handler: e => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        console.log("Save shortcut pressed!");
      }
      setLastKey(e.key);
    },
  });

  return (
    <div>
      Last key pressed: {lastKey}
      <p>Try pressing Ctrl+S</p>
    </div>
  );
}
```

### With Event Listener Options

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";

function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);

  useEventListener({
    target: window,
    eventType: "scroll",
    handler: () => {
      setScrollY(window.scrollY);
    },
    options: {
      passive: true, // Better performance for scroll events
      capture: false,
    },
  });

  return (
    <div style={{ height: "200vh" }}>
      <div style={{ position: "fixed", top: 0 }}>
        Scroll position: {scrollY}px
      </div>
    </div>
  );
}
```

### Conditional Event Listening

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";

function ConditionalListener({ isListening }: { isListening: boolean }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEventListener(
    {
      target: document,
      eventType: "mousemove",
      handler: e => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      },
    },
    isListening,
  ); // Only listen when isListening is true

  return (
    <div>
      <p>Listening: {isListening ? "Yes" : "No"}</p>
      {isListening && (
        <p>
          Mouse position: {mousePosition.x}, {mousePosition.y}
        </p>
      )}
    </div>
  );
}
```

### Multiple Event Listeners

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";

function MultipleListeners() {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (eventName: string) => {
    setEvents(prev => [...prev.slice(-4), eventName]); // Keep last 5 events
  };

  useEventListener({
    target: window,
    eventType: "focus",
    handler: () => addEvent("Window focused"),
  });

  useEventListener({
    target: window,
    eventType: "blur",
    handler: () => addEvent("Window blurred"),
  });

  useEventListener({
    target: document,
    eventType: "visibilitychange",
    handler: () => {
      addEvent(document.hidden ? "Page hidden" : "Page visible");
    },
  });

  return (
    <div>
      <h3>Recent Events:</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Custom Hook with Event Listener

```tsx
import { useEventListener } from "@utilityjs/use-event-listener";
import { useState, useCallback } from "react";

function useClickOutside<T extends HTMLElement>(
  callback: () => void,
): [React.RefObject<T>] {
  const ref = useRef<T>(null);

  useEventListener({
    target: document,
    eventType: "mousedown",
    handler: e => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    },
  });

  return [ref];
}

// Usage
function DropdownComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownRef] = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Dropdown</button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="dropdown"
        >
          <p>Dropdown content</p>
          <p>Click outside to close</p>
        </div>
      )}
    </div>
  );
}
```

## API

### `useEventListener(config, shouldAttach?)`

#### Parameters

- `config: EventListenerConfig` - Configuration object for the event listener
- `shouldAttach?: boolean` - Whether to attach the event listener (default:
  `true`)

#### Config Object

```typescript
type EventListenerConfig = {
  target: RefObject<HTMLElement> | HTMLElement | Window | Document | null;
  eventType: string; // Event name (e.g., "click", "resize", "keydown")
  handler: EventListener; // Event handler function
  options?: Options; // Event listener options
};
```

#### Options

```typescript
type Options = boolean | AddEventListenerOptions;

// AddEventListenerOptions includes:
// {
//   capture?: boolean;
//   once?: boolean;
//   passive?: boolean;
//   signal?: AbortSignal;
// }
```

#### Target Types

The hook supports three types of event targets:

1. **HTMLElement**: Direct element reference or ref object
2. **Document**: The document object
3. **Window**: The window object

#### Event Type Safety

The hook provides full TypeScript support with proper event type inference:

- **HTMLElement events**: `click`, `mousedown`, `keyup`, etc.
- **Document events**: `DOMContentLoaded`, `readystatechange`, etc.
- **Window events**: `resize`, `scroll`, `beforeunload`, etc.

#### Behavior

- **Automatic Cleanup**: Event listeners are automatically removed when the
  component unmounts or dependencies change
- **Ref Handling**: Supports both direct element references and React ref
  objects
- **Browser Compatibility**: Automatically handles browser differences in event
  listener options support
- **Performance**: Uses the latest ref pattern to avoid unnecessary effect
  re-runs
- **Conditional Listening**: Can conditionally attach/detach listeners based on
  the `shouldAttach` parameter

#### Best Practices

1. **Use passive listeners** for scroll and touch events to improve performance
2. **Memoize handler functions** if they depend on props/state to avoid
   unnecessary re-attachments
3. **Use conditional attachment** instead of adding/removing listeners in
   effects
4. **Prefer refs over direct element queries** for better React integration

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
