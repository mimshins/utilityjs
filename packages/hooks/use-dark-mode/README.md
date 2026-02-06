<div align="center">

# UtilityJS | useDarkMode

A React hook for managing dark mode state with persistence and system preference
detection.

</div>

<hr />

## Features

- **System Preference Detection**: Automatically detects user's system color
  scheme preference
- **Persistent State**: Saves dark mode preference to localStorage (or custom
  storage)
- **CSS Class Management**: Automatically applies/removes CSS classes to
  document body
- **SSR Compatible**: Works with server-side rendering
- **Customizable**: Configurable storage, class names, and initial state
- **TypeScript Support**: Full type safety with TypeScript

## Installation

```bash
npm install @utilityjs/use-dark-mode
```

or

```bash
pnpm add @utilityjs/use-dark-mode
```

## Usage

### Basic Example

```tsx
import { useDarkMode } from "@utilityjs/use-dark-mode";

function App() {
  const { isDarkMode, enable, disable, toggle } = useDarkMode();

  return (
    <div>
      <h1>Current mode: {isDarkMode ? "Dark" : "Light"}</h1>
      <button onClick={toggle}>Toggle Theme</button>
      <button onClick={enable}>Enable Dark Mode</button>
      <button onClick={disable}>Disable Dark Mode</button>
    </div>
  );
}
```

### With Custom Options

```tsx
import { useDarkMode } from "@utilityjs/use-dark-mode";

function App() {
  const { isDarkMode, toggle } = useDarkMode({
    initialState: false,
    storageKey: "my-app-theme",
    toggleClassName: "dark-theme",
  });

  return (
    <div className={isDarkMode ? "dark-layout" : "light-layout"}>
      <button onClick={toggle}>
        Switch to {isDarkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
```

### With Custom Storage

```tsx
import { useDarkMode } from "@utilityjs/use-dark-mode";

// Custom storage implementation
const customStorage = {
  getItem: (key: string) => {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem: (key: string, value: boolean) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
};

function App() {
  const { isDarkMode, toggle } = useDarkMode({
    storage: customStorage,
    storageKey: "session-theme",
  });

  return (
    <div>
      <p>Theme persisted in session storage</p>
      <button onClick={toggle}>Toggle Theme</button>
    </div>
  );
}
```

### Theme Toggle Component

```tsx
import { useDarkMode } from "@utilityjs/use-dark-mode";

function ThemeToggle() {
  const { isDarkMode, toggle } = useDarkMode({
    toggleClassName: "dark-mode",
  });

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  );
}
```

### CSS Setup

The hook automatically applies a CSS class to the document body. You can use
this to style your application:

```css
/* Default light mode styles */
body {
  background-color: white;
  color: black;
}

/* Dark mode styles */
body.dark-mode {
  background-color: #1a1a1a;
  color: white;
}

/* Or use CSS custom properties */
:root {
  --bg-color: white;
  --text-color: black;
}

body.dark-mode {
  --bg-color: #1a1a1a;
  --text-color: white;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

## API

### `useDarkMode(options?)`

#### Parameters

- `options?: Options` - Configuration options for the hook

#### Options

```typescript
type Options = {
  /**
   * The initial state of the dark mode.
   * If left unset, it will be set based on `(prefers-color-scheme: dark)` query.
   */
  initialState?: boolean;

  /**
   * The key is used to persist the state.
   * @default "utilityjs-dark-mode"
   */
  storageKey?: string;

  /**
   * The class to toggle when state changes.
   * The specified class will be applied on dark mode.
   * @default "dark-mode"
   */
  toggleClassName?: string;

  /**
   * The storage object.
   * @default localStorage
   */
  storage?: DataStorage<boolean>;
};
```

#### Returns

Returns an object with the following properties:

- `isDarkMode: boolean` - Current dark mode state
- `enable: () => void` - Function to enable dark mode
- `disable: () => void` - Function to disable dark mode
- `toggle: () => void` - Function to toggle dark mode state

#### Behavior

1. **Initial State**: If no `initialState` is provided, the hook will use the
   system preference (`prefers-color-scheme: dark`)
2. **Persistence**: The state is automatically persisted to the specified
   storage (localStorage by default)
3. **CSS Class**: The specified class name is automatically added/removed from
   `document.body`
4. **System Preference**: The hook listens to system color scheme changes when
   no explicit state is set

#### Storage Interface

```typescript
interface DataStorage<T> {
  getItem(key: string): T | null;
  setItem(key: string, value: T): void;
}
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
