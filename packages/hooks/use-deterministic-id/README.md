<div align="center">

# UtilityJS | useDeterministicId

A React hook that generates a deterministic unique ID once per component.

</div>

<hr />

## Features

- **SSR Compatible**: Works seamlessly with server-side rendering and hydration
- **React Version Agnostic**: Uses React 18's `useId` when available, falls back
  gracefully for older versions
- **Deterministic**: Generates consistent IDs across renders
- **Customizable Prefix**: Support for custom prefixes to avoid conflicts
- **Override Support**: Allows manual ID specification when needed
- **TypeScript Support**: Full type safety with TypeScript

## Installation

```bash
npm install @utilityjs/use-deterministic-id
```

or

```bash
pnpm add @utilityjs/use-deterministic-id
```

## Usage

### Basic Example

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

function MyForm() {
  const nameId = useDeterministicId();
  const emailId = useDeterministicId();

  return (
    <form>
      <div>
        <label htmlFor={nameId}>Name:</label>
        <input
          id={nameId}
          type="text"
        />
      </div>
      <div>
        <label htmlFor={emailId}>Email:</label>
        <input
          id={emailId}
          type="email"
        />
      </div>
    </form>
  );
}
```

### With Custom Prefix

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

function UserProfile() {
  const profileId = useDeterministicId(undefined, "user-profile");
  const avatarId = useDeterministicId(undefined, "avatar");

  return (
    <div id={profileId}>
      <img
        id={avatarId}
        src="/avatar.jpg"
        alt="User avatar"
      />
      <h2>User Profile</h2>
    </div>
  );
}
```

### With ID Override

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

function CustomComponent({ id }: { id?: string }) {
  const componentId = useDeterministicId(id, "custom-component");

  return (
    <div id={componentId}>
      <p>This component has ID: {componentId}</p>
    </div>
  );
}

// Usage
<CustomComponent /> // Uses generated ID
<CustomComponent id="my-custom-id" /> // Uses provided ID
```

### Form Field Component

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

interface FieldProps {
  label: string;
  type?: string;
  id?: string;
  required?: boolean;
}

function Field({ label, type = "text", id, required }: FieldProps) {
  const fieldId = useDeterministicId(id, "field");
  const errorId = useDeterministicId(undefined, "field-error");

  return (
    <div>
      <label htmlFor={fieldId}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      <input
        id={fieldId}
        type={type}
        required={required}
        aria-describedby={errorId}
      />
      <div
        id={errorId}
        role="alert"
        aria-live="polite"
      >
        {/* Error messages would go here */}
      </div>
    </div>
  );
}
```

### Accessible Modal Component

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function Modal({ title, children, isOpen, onClose }: ModalProps) {
  const modalId = useDeterministicId(undefined, "modal");
  const titleId = useDeterministicId(undefined, "modal-title");

  if (!isOpen) return null;

  return (
    <div
      id={modalId}
      role="dialog"
      aria-labelledby={titleId}
      aria-modal="true"
    >
      <div className="modal-content">
        <header>
          <h2 id={titleId}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
```

### Multiple IDs in One Component

```tsx
import { useDeterministicId } from "@utilityjs/use-deterministic-id";

function SearchForm() {
  const formId = useDeterministicId(undefined, "search-form");
  const inputId = useDeterministicId(undefined, "search-input");
  const buttonId = useDeterministicId(undefined, "search-button");
  const resultsId = useDeterministicId(undefined, "search-results");

  return (
    <div>
      <form
        id={formId}
        role="search"
      >
        <input
          id={inputId}
          type="search"
          placeholder="Search..."
          aria-describedby={resultsId}
        />
        <button
          id={buttonId}
          type="submit"
        >
          Search
        </button>
      </form>
      <div
        id={resultsId}
        aria-live="polite"
      >
        {/* Search results */}
      </div>
    </div>
  );
}
```

## API

### `useDeterministicId(idOverride?, prefix?)`

#### Parameters

- `idOverride?: string` - Optional ID to use instead of generating one. When
  provided, this ID will be used directly
- `prefix?: string` - Optional prefix to prepend to generated IDs. Defaults to
  `"UTILITYJS-GEN-ID"`

#### Returns

- `string` - A stable, unique identifier that remains consistent across renders

#### Behavior

The hook follows this priority order for ID generation:

1. **Override ID**: If `idOverride` is provided, it's used directly
2. **React's useId**: If available (React 18+) and no override is provided, uses
   React's built-in `useId`
3. **Fallback Counter**: For older React versions, uses a global counter
   (client-side only)

#### ID Format

Generated IDs follow the format: `{prefix}-{identifier}`

Examples:

- Default: `UTILITYJS-GEN-ID-1`, `UTILITYJS-GEN-ID-2`
- Custom prefix: `my-component-1`, `my-component-2`
- React 18: `my-prefix-R1`, `my-prefix-R2` (actual format may vary)

#### SSR Considerations

- **React 18+**: Uses React's built-in `useId` which is SSR-safe
- **React < 18**: The hook relies on hydration to avoid server/client mismatch
  errors. The initial render may show an empty string, which gets populated
  after hydration

#### Best Practices

1. **Use consistent prefixes** for related components to make debugging easier
2. **Provide meaningful prefixes** that describe the component or element
3. **Don't rely on the exact format** of generated IDs in your code
4. **Use override IDs sparingly** - only when you need a specific ID for
   external integration

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
