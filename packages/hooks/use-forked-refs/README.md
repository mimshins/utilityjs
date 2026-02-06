<div align="center">

# UtilityJS | useForkedRefs

A React hook for forking/merging multiple refs into a single one.

</div>

<hr />

## Features

- **Multiple Ref Support**: Merge any number of refs into a single ref callback
- **Ref Type Agnostic**: Works with both callback refs and ref objects
- **Null Safe**: Safely handles undefined/null refs
- **TypeScript Support**: Full type safety with generic support
- **Performance Optimized**: Uses useCallback to prevent unnecessary re-renders
- **Flexible**: Works with forwarded refs, internal refs, and callback refs

## Installation

```bash
npm install @utilityjs/use-forked-refs
```

or

```bash
pnpm add @utilityjs/use-forked-refs
```

## Usage

### Basic Example with Forwarded Ref

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { forwardRef, useRef } from "react";

const MyInput = forwardRef<HTMLInputElement, { placeholder?: string }>(
  ({ placeholder }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const mergedRef = useForkedRefs(internalRef, forwardedRef);

    // Now you can use internalRef for internal logic
    // while still supporting the forwarded ref
    const focusInput = () => {
      internalRef.current?.focus();
    };

    return (
      <div>
        <input
          ref={mergedRef}
          placeholder={placeholder}
        />
        <button onClick={focusInput}>Focus Input</button>
      </div>
    );
  },
);
```

### Multiple Refs Example

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { useRef, useState } from "react";

function MultiRefComponent() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [callbackRef, setCallbackRef] = useState<HTMLDivElement | null>(null);

  const mergedRef = useForkedRefs(ref1, ref2, setCallbackRef);

  const logRefs = () => {
    console.log("Ref 1:", ref1.current);
    console.log("Ref 2:", ref2.current);
    console.log("Callback ref:", callbackRef);
    // All three will point to the same element
  };

  return (
    <div>
      <div ref={mergedRef}>Element with multiple refs</div>
      <button onClick={logRefs}>Log Refs</button>
    </div>
  );
}
```

### With Third-Party Libraries

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { useRef } from "react";

// Example with a hypothetical animation library
function AnimatedComponent() {
  const myRef = useRef<HTMLDivElement>(null);
  const animationRef = useAnimationLibrary(); // Returns a ref from library
  const observerRef = useIntersectionObserver(); // Returns another ref

  const mergedRef = useForkedRefs(myRef, animationRef, observerRef);

  return (
    <div
      ref={mergedRef}
      className="animated-element"
    >
      This element is tracked by multiple systems
    </div>
  );
}
```

### Custom Hook with Forked Refs

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { useRef, useEffect } from "react";

function useClickOutside<T extends HTMLElement>(
  callback: () => void,
  externalRef?: React.Ref<T>,
) {
  const internalRef = useRef<T>(null);
  const mergedRef = useForkedRefs(internalRef, externalRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        internalRef.current &&
        !internalRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return mergedRef;
}

// Usage
function DropdownWithForwardedRef({
  onClose,
  forwardedRef,
}: {
  onClose: () => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
}) {
  const dropdownRef = useClickOutside(onClose, forwardedRef);

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
    >
      Dropdown content
    </div>
  );
}
```

### Conditional Refs

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { useRef } from "react";

function ConditionalRefComponent({
  enableTracking,
  externalRef,
}: {
  enableTracking: boolean;
  externalRef?: React.Ref<HTMLDivElement>;
}) {
  const internalRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef<HTMLDivElement>(null);

  // Only include tracking ref when enabled
  const mergedRef = useForkedRefs(
    internalRef,
    externalRef,
    enableTracking ? trackingRef : undefined,
  );

  return <div ref={mergedRef}>Content with conditional tracking</div>;
}
```

### Form Field with Validation

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { forwardRef, useRef, useImperativeHandle } from "react";

interface FormFieldHandle {
  focus: () => void;
  validate: () => boolean;
}

const FormField = forwardRef<
  FormFieldHandle,
  {
    label: string;
    validation?: (value: string) => boolean;
    inputRef?: React.Ref<HTMLInputElement>;
  }
>(({ label, validation, inputRef }, ref) => {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const mergedInputRef = useForkedRefs(internalInputRef, inputRef);

  useImperativeHandle(ref, () => ({
    focus: () => internalInputRef.current?.focus(),
    validate: () => {
      const value = internalInputRef.current?.value || "";
      return validation ? validation(value) : true;
    },
  }));

  return (
    <div>
      <label>{label}</label>
      <input ref={mergedInputRef} />
    </div>
  );
});
```

### Higher-Order Component Pattern

```tsx
import { useForkedRefs } from "@utilityjs/use-forked-refs";
import { forwardRef } from "react";

function withClickTracking<T extends HTMLElement, P extends object>(
  Component: React.ComponentType<P & { ref?: React.Ref<T> }>,
) {
  return forwardRef<T, P>((props, ref) => {
    const trackingRef = useRef<T>(null);
    const mergedRef = useForkedRefs(trackingRef, ref);

    const handleClick = () => {
      console.log("Element clicked:", trackingRef.current);
    };

    return (
      <div onClick={handleClick}>
        <Component
          {...props}
          ref={mergedRef}
        />
      </div>
    );
  });
}

// Usage
const TrackedButton = withClickTracking(
  forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
    ({ children }, ref) => <button ref={ref}>{children}</button>,
  ),
);
```

## API

### `useForkedRefs<T>(...refs)`

#### Parameters

- `...refs: (React.Ref<T> | undefined)[]` - Variable number of refs to merge.
  Can include:
  - `React.RefObject<T>` - Objects with `.current` property (from `useRef`)
  - `React.RefCallback<T>` - Callback functions that receive the element
  - `undefined` or `null` - These are safely ignored

#### Returns

- `React.RefCallback<T>` - A callback ref that will update all provided refs
  when called

#### Type Parameter

- `T` - The type of the element being referenced (e.g., `HTMLDivElement`,
  `HTMLInputElement`)

#### Behavior

1. **Ref Merging**: All provided refs are updated when the returned callback is
   called
2. **Type Safety**: The returned callback is properly typed based on the element
   type
3. **Null Safety**: Undefined or null refs are safely ignored
4. **Performance**: Uses `useCallback` internally to prevent unnecessary
   re-renders
5. **Ref Types**: Supports both callback refs and ref objects seamlessly

#### Supported Ref Types

```typescript
// Ref objects (from useRef)
const refObject = useRef<HTMLDivElement>(null);

// Callback refs (state setters)
const [element, setElement] = useState<HTMLDivElement | null>(null);

// Function refs
const functionRef = (element: HTMLDivElement | null) => {
  console.log("Element:", element);
};

// All can be merged
const mergedRef = useForkedRefs(refObject, setElement, functionRef);
```

#### Best Practices

1. **Use with forwardRef**: Ideal for components that need to forward refs while
   maintaining internal refs
2. **Library Integration**: Perfect for combining refs from multiple libraries
   or hooks
3. **Conditional Refs**: Pass `undefined` for refs that should be conditionally
   applied
4. **Type Consistency**: Ensure all refs are for the same element type
5. **Performance**: The hook is already optimized with `useCallback`, no
   additional memoization needed

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
