<div align="center">
  <h1 align="center">
    useScrollGuard
  </h1>
</div>

<div align="center">

A React hook that disables/enables the page scroll.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-scroll-guard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-scroll-guard)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-scroll-guard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-scroll-guard)
[![types](https://img.shields.io/npm/types/@utilityjs/use-scroll-guard?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-scroll-guard)

```bash
npm i @utilityjs/use-scroll-guard | yarn add @utilityjs/use-scroll-guard
```

</div>

<hr>

## Usage

```tsx
const App = () => {
  const { enablePageScroll, disablePageScroll } = useScrollGuard();

  return (
    <div className="app">
      <button onClick={() => void enablePageScroll()}>Enable</button>
      <button onClick={() => void disablePageScroll()}>Disable</button>
    </div>
  );
};
```

## API

### `useScrollGuard()`

```ts
declare type UseScrollGuard = () => {
  enablePageScroll: () => void;
  disablePageScroll: () => void;
};

declare const useScrollGuard: UseScrollGuard;
```
