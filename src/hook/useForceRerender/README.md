<div align="center">
  <h1 align="center">
    useForceRerender
  </h1>
</div>

<div align="center">

A React hook that returns a function that will re-render your component when called.\
Useful when logic relies on state not represented in "React state".

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-force-rerender?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-force-rerender)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-force-rerender?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-force-rerender)
[![types](https://img.shields.io/npm/types/@utilityjs/use-force-rerender?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-force-rerender)

```bash
npm i @utilityjs/use-force-rerender | yarn add @utilityjs/use-force-rerender
```

</div>

<hr>

## Usage

```ts
const Component = () => {
  const forceRerender = useForceRerender();

  React.useEffect(() => void DataStore.subscribe(() => void forceRerender()), []);

  return <>{DataStore.data}</>;
}
```

## API

### `useForceRerender()`

```ts
declare const useForceRerender: () => (() => void);
```
