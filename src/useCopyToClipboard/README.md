<div align="center">
  <h1 align="center">
    useCopyToClipboard
  </h1>
</div>

<div align="center">

A React hook for copying text to the clipboard.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-copy-to-clipboard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-copy-to-clipboard)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-copy-to-clipboard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-copy-to-clipboard)
[![types](https://img.shields.io/npm/types/@utilityjs/use-copy-to-clipboard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-copy-to-clipboard)

```bash
npm i @utilityjs/use-copy-to-clipboard | yarn add @utilityjs/use-copy-to-clipboard
```

</div>

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const [isCopied, setIsCopied] = React.useState(false);

  const copy = useCopyToClipboard();

  return (
    <div className="app">
      <button
        disabled={isCopied}
        onClick={async () => void setIsCopied(await copy("Hello, World!"))}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};
```

## API

### `useCopyToClipboard()`

```ts
declare const useCopyToClipboard: () => (text: string) => Promise<boolean>;
```
