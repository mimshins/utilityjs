<div align="center">

# UtilityJS | useOnOutsideClick

A React hook that invokes a callback when user clicks outside of the target
element.

</div>

<hr />

## Features

- **Flexible Target Support**: Works with refs, direct elements, or null values
- **SSR Safe**: Handles server-side rendering gracefully
- **Conditional Logic**: Optional condition function for additional control
- **Performance Optimized**: Uses stable callback references
- **TypeScript Support**: Full type safety with generic HTML element support
- **Event Delegation**: Efficient event handling using document-level listeners

## Installation

```bash
npm install @utilityjs/use-on-outside-click
```

or

```bash
pnpm add @utilityjs/use-on-outside-click
```

## Usage

### Basic Dropdown

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef, useState } from "react";

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Dropdown</button>
      {isOpen && (
        <div className="dropdown-menu">
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
        </div>
      )}
    </div>
  );
}
```

### Modal Dialog

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal-content"
      >
        <button
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2>Modal Content</h2>
        <p>Click outside to close this modal.</p>
      </Modal>
    </div>
  );
}
```

### Context Menu

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef, useState } from "react";

function ContextMenu() {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    show: boolean;
  }>({ x: 0, y: 0, show: false });

  const menuRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(menuRef, () => {
    setContextMenu(prev => ({ ...prev, show: false }));
  });

  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      show: true,
    });
  };

  return (
    <div>
      <div
        onContextMenu={handleRightClick}
        style={{
          width: 300,
          height: 200,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Right-click me for context menu
      </div>

      {contextMenu.show && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div className="menu-item">Copy</div>
          <div className="menu-item">Paste</div>
          <div className="menu-item">Delete</div>
        </div>
      )}
    </div>
  );
}
```

### Tooltip

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef, useState } from "react";

function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(tooltipRef, () => {
    setIsVisible(false);
  });

  return (
    <div
      ref={tooltipRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <div onClick={() => setIsVisible(!isVisible)}>{children}</div>

      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap",
            marginBottom: "8px",
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div>
      <Tooltip content="This is a helpful tooltip">
        <button>Hover or click me</button>
      </Tooltip>
    </div>
  );
}
```

### With Conditional Logic

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef, useState } from "react";

function ConditionalDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnOutsideClick(
    dropdownRef,
    () => {
      setIsOpen(false);
    },
    // Only close if not locked and not clicking on disabled elements
    event => {
      const target = event.target as HTMLElement;
      return !isLocked && !target.hasAttribute("data-disabled");
    },
  );

  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Dropdown</button>

      <label>
        <input
          type="checkbox"
          checked={isLocked}
          onChange={e => setIsLocked(e.target.checked)}
        />
        Lock dropdown (prevent outside click close)
      </label>

      {isOpen && (
        <div className="dropdown-menu">
          <div>Regular option</div>
          <div data-disabled>Disabled option</div>
          <div>Another option</div>
        </div>
      )}
    </div>
  );
}
```

### Multiple Elements

```tsx
import { useOnOutsideClick } from "@utilityjs/use-on-outside-click";
import { useRef, useState } from "react";

function MultipleDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdown1Ref = useRef<HTMLDivElement>(null);
  const dropdown2Ref = useRef<HTMLDivElement>(null);

  useOnOutsideClick(dropdown1Ref, () => {
    if (openDropdown === "dropdown1") {
      setOpenDropdown(null);
    }
  });

  useOnOutsideClick(dropdown2Ref, () => {
    if (openDropdown === "dropdown2") {
      setOpenDropdown(null);
    }
  });

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div ref={dropdown1Ref}>
        <button onClick={() => setOpenDropdown("dropdown1")}>Dropdown 1</button>
        {openDropdown === "dropdown1" && (
          <div className="dropdown-menu">
            <div>Option 1A</div>
            <div>Option 1B</div>
          </div>
        )}
      </div>

      <div ref={dropdown2Ref}>
        <button onClick={() => setOpenDropdown("dropdown2")}>Dropdown 2</button>
        {openDropdown === "dropdown2" && (
          <div className="dropdown-menu">
            <div>Option 2A</div>
            <div>Option 2B</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## API

### `useOnOutsideClick<T>(target, callback, extendCondition?)`

A React hook that detects clicks outside of a target element.

#### Parameters

- `target: RefObject<T> | T | null` - The target element to monitor. Can be:
  - A React ref object (`useRef` result)
  - A direct HTML element
  - `null` (hook will be inactive)

- `callback: (event: MouseEvent) => void` - Function called when clicking
  outside the target

- `extendCondition?: (event: MouseEvent) => boolean` - Optional condition
  function that must return `true` for the callback to be invoked (default:
  `() => true`)

#### Returns

- `void` - This hook doesn't return anything

#### Behavior

- **Outside Detection**: Triggers when click target is not the element itself
  and not contained within the element
- **Event Delegation**: Uses document-level click listener for efficiency
- **SSR Safety**: Gracefully handles server-side rendering where `document` is
  undefined
- **Stable References**: Uses `useGetLatest` to ensure callback reference is
  always current

### Dependencies

This hook depends on:

- `@utilityjs/use-event-listener` - For efficient event listener management
- `@utilityjs/use-get-latest` - For stable callback references

## Use Cases

- **Dropdown Menus**: Close dropdowns when clicking outside
- **Modal Dialogs**: Close modals when clicking on overlay
- **Context Menus**: Hide context menus on outside clicks
- **Tooltips**: Hide tooltips when clicking elsewhere
- **Popover Components**: Dismiss popovers on outside interaction
- **Mobile Navigation**: Close mobile menus when tapping outside
- **Form Validation**: Hide validation messages on outside clicks

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
