<div align="center">

# UtilityJS | copyToClipboard

An utility module to help with copying text to clipboard.

</div>

<hr />

## Features

- **Modern Clipboard API**: Uses `navigator.clipboard.writeText()` for secure
  clipboard access
- **Automatic Fallback**: Falls back to legacy `execCommand` method when
  Clipboard API is unavailable
- **Promise-based**: Async/await support for clean error handling
- **TypeScript Support**: Full type safety

## Installation

```bash
npm install @utilityjs/copy-to-clipboard
```

or

```bash
pnpm add @utilityjs/copy-to-clipboard
```

## Usage

### Basic Usage

```typescript
import { copyToClipboard } from "@utilityjs/copy-to-clipboard";

// Copy text to clipboard
await copyToClipboard("Hello, World!");
```

### With Error Handling

```typescript
import { copyToClipboard } from "@utilityjs/copy-to-clipboard";

try {
  await copyToClipboard("Some important text");
  console.log("Text copied successfully!");
} catch (error) {
  console.error("Failed to copy text:", error);
}
```

### In a React Component

```typescript
import { copyToClipboard } from "@utilityjs/copy-to-clipboard";

function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await copyToClipboard(text);
      alert("Copied to clipboard!");
    } catch (error) {
      alert("Failed to copy");
    }
  };

  return <button onClick={handleCopy}>Copy</button>;
}
```

## API

### `copyToClipboard(value: string): Promise<void>`

Copies text to the clipboard using the modern Clipboard API with fallback
support.

**Parameters:**

- `value` - The text to copy to clipboard

**Returns:**

- `Promise<void>` - A promise that resolves when the text is successfully copied

**Behavior:**

1. Attempts to use `navigator.clipboard.writeText()` (modern Clipboard API)
2. If unavailable or fails, falls back to `document.execCommand('copy')` (legacy
   method)
3. The fallback creates a temporary textarea element, selects its content,
   executes the copy command, and removes the element

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
