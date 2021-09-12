<div align="center">
  <h1 align="center">
    useIsomorphicLayoutEffect
  </h1>
</div>

<div align="center">

A React hook that schedules a `React.useLayoutEffect` with a fallback to a `React.useEffect` for environments where layout effects should not be used (such as server-side rendering).

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-isomorphic-layout-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-isomorphic-layout-effect)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-isomorphic-layout-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-isomorphic-layout-effect)
[![types](https://img.shields.io/npm/types/@utilityjs/use-isomorphic-layout-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-isomorphic-layout-effect)

```bash
npm i @utilityjs/use-isomorphic-layout-effect | yarn add @utilityjs/use-isomorphic-layout-effect
```

</div>

<hr>

## API

### `useIsomorphicLayoutEffect()`

```ts
declare const useIsomorphicLayoutEffect: () => (() => boolean);
```
