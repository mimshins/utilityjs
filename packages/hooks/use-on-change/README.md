<div align="center">

# UtilityJS | useOnChange

A React hook that invokes a callback anytime a value changes.

</div>

<hr />

## Features

- **Change Detection**: Automatically detects when a value changes
- **Callback Stability**: Uses stable callback references to prevent unnecessary
  re-renders
- **Type Safety**: Full TypeScript support with generic typing
- **Performance Optimized**: Efficient comparison using previous value tracking
- **Side Effect Management**: Perfect for triggering side effects on value
  changes

## Installation

```bash
npm install @utilityjs/use-on-change
```

or

```bash
pnpm add @utilityjs/use-on-change
```

## Usage

### Basic Usage

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useOnChange(count, newCount => {
    console.log(`Count changed to: ${newCount}`);
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### User Analytics

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState } from "react";

function UserDashboard() {
  const [currentPage, setCurrentPage] = useState("home");

  useOnChange(currentPage, page => {
    // Track page views
    analytics.track("page_view", { page });
  });

  return (
    <nav>
      <button onClick={() => setCurrentPage("home")}>Home</button>
      <button onClick={() => setCurrentPage("profile")}>Profile</button>
      <button onClick={() => setCurrentPage("settings")}>Settings</button>
    </nav>
  );
}
```

### API Data Fetching

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState, useEffect } from "react";

function UserProfile() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useOnChange(userId, async newUserId => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${newUserId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div>
      <select
        value={userId}
        onChange={e => setUserId(Number(e.target.value))}
      >
        <option value={1}>User 1</option>
        <option value={2}>User 2</option>
        <option value={3}>User 3</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <div>
          <h2>{userData.name}</h2>
          <p>{userData.email}</p>
        </div>
      ) : null}
    </div>
  );
}
```

### Form Validation

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState } from "react";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useOnChange(email, newEmail => {
    if (newEmail === "") {
      setIsValid(true);
      setErrorMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(newEmail);

    setIsValid(valid);
    setErrorMessage(valid ? "" : "Please enter a valid email address");
  });

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        style={{
          borderColor: isValid ? "#ccc" : "#ff0000",
        }}
      />
      {!isValid && <p style={{ color: "#ff0000" }}>{errorMessage}</p>}
    </div>
  );
}
```

### Local Storage Sync

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState, useEffect } from "react";

function Settings() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");

  // Load from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem("language");

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);

  // Save to localStorage when values change
  useOnChange(theme, newTheme => {
    localStorage.setItem("theme", newTheme);
    document.body.className = `theme-${newTheme}`;
  });

  useOnChange(language, newLanguage => {
    localStorage.setItem("language", newLanguage);
    // Update i18n or trigger language change
  });

  return (
    <div>
      <div>
        <label>Theme:</label>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label>Language:</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
  );
}
```

### Complex Object Changes

```tsx
import { useOnChange } from "@utilityjs/use-on-change";
import { useState } from "react";

type FilterState = {
  category: string;
  priceRange: [number, number];
  sortBy: string;
};

function ProductFilter() {
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 1000],
    sortBy: "name",
  });

  useOnChange(filters, newFilters => {
    console.log("Filters changed:", newFilters);
    // Trigger API call to fetch filtered products
    fetchProducts(newFilters);
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <select
        value={filters.category}
        onChange={e => updateFilter("category", e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <input
        type="range"
        min="0"
        max="1000"
        value={filters.priceRange[1]}
        onChange={e => updateFilter("priceRange", [0, Number(e.target.value)])}
      />

      <select
        value={filters.sortBy}
        onChange={e => updateFilter("sortBy", e.target.value)}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
```

## API

### `useOnChange<T>(value, onChange)`

A React hook that monitors a value and executes a callback when it changes.

#### Parameters

- `value: T` - The value to monitor for changes
- `onChange: (current: T) => void` - Callback function invoked when the value
  changes

#### Returns

- `void` - This hook doesn't return anything

#### Behavior

- **Change Detection**: Uses strict equality (`!==`) to detect changes
- **Callback Timing**: The callback is invoked after the component re-renders
  with the new value
- **Initial Render**: The callback is not invoked on the initial render, only on
  subsequent changes
- **Stable References**: Uses `useGetLatest` to ensure the callback reference is
  always current

### Dependencies

This hook depends on:

- `@utilityjs/use-previous-value` - For tracking previous values

## Use Cases

- **Analytics Tracking**: Track user interactions and state changes
- **API Calls**: Trigger data fetching when parameters change
- **Form Validation**: Validate fields as users type
- **Local Storage**: Sync state changes to localStorage
- **Side Effects**: Execute any side effect in response to value changes
- **Logging**: Log state changes for debugging purposes

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
