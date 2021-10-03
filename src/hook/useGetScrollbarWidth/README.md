<div align="center">
  <h1 align="center">
    useGetScrollbarWidth
  </h1>
</div>

<div align="center">

A React hook that calculates the width of the user agent's scrollbar.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-get-scrollbar-width?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-scrollbar-width)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-get-scrollbar-width?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-scrollbar-width)
[![types](https://img.shields.io/npm/types/@utilityjs/use-get-scrollbar-width?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-scrollbar-width)

```bash
npm i @utilityjs/use-get-scrollbar-width | yarn add @utilityjs/use-get-scrollbar-width
```

</div>

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const getScrollbarWidth = useGetScrollbarWidth();

  return (
    <div className="app">
      <button onClick={() => void console.log(getScrollbarWidth())}>Log Scrollbar Width</button>
    </div>
  );
};
```

## API

### `useGetScrollbarWidth()`

```ts
declare const useGetScrollbarWidth: (): (() => number);
```
