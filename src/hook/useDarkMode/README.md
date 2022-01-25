<div align="center">
  <h1 align="center">
    useDarkMode
  </h1>
</div>

<div align="center">

A React hook that enables a SSR-friendly multi-tab persistent dark mode behaviour.\

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-dark-mode?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-dark-mode)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-dark-mode?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-dark-mode)
[![types](https://img.shields.io/npm/types/@utilityjs/use-dark-mode?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-dark-mode)

```bash
npm i @utilityjs/use-dark-mode | yarn add @utilityjs/use-dark-mode
```

</div>

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <div className="app">
      <button onClick={() => void toggle()}>Toggle</button>
      <div>{isDarkMode}</div>
    </div>
  );
};
```

## API

### `useDarkMode(options?)`

```ts
interface Options {
  /**
   * The initial state of the dark mode.\
   * If left unset, it will be set based on `(prefers-color-scheme: dark)` query.
   */
  initialState?: boolean;
  /**
   * The key is used to persist the state.
   *
   * @default "utilityjs-dark-mode"
   */
  storageKey?: string;
  /**
   * The class to toggle when state changes.\
   * The specified class will be applied on dark mode.
   *
   * @default "dark-mode"
   */
  toggleClassName?: string;
  /**
   * A function returning a storage.\
   * The storage must fit `window.localStorage`'s api.
   *
   * @default () => localStorage
   */
  getStorage?: () => Storage | null;
}

declare const useDarkMode: (options?: Options | undefined) => {
  isDarkMode: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
};
```

#### `options`

The options to adjust the hook.

##### `options.storageKey` - (`default: "utilityjs-dark-mode"`)

The key is used to persist the state.

##### `options.initialState`

The initial state of the dark mode.\
If left unset, it will be set based on `(prefers-color-scheme: dark)` query.

##### `options.getStorage` - (`default: () => localStorage`)

A function returning a storage.\
The storage must fit `window.localStorage`'s api.

##### `options.toggleClassName` - (`default: "dark-mode"`)

The class to toggle when state changes.\
The specified class will be applied on dark mode.