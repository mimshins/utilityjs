<div align="center">
  <h1 align="center">
    useSyncEffect
  </h1>
</div>

<div align="center">

A React hook that is similar to the `React.useEffect` hook, except it's synchronous and will be called on server as well.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-sync-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-sync-effect)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-sync-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-sync-effect)
[![types](https://img.shields.io/npm/types/@utilityjs/use-sync-effect?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-sync-effect)

```bash
npm i @utilityjs/use-sync-effect | yarn add @utilityjs/use-sync-effect
```

</div>

<hr>

## Usage

```jsx
import * as React from "react";
import useSyncEffect from "@utilityjs/use-sync-effect";

const MyComponent = (props, ref) => {
  const focusState = React.useRef(props.focused);

  // When `props.disabled` changed run the effect synchronously (and also on the first render)
  // Look at it as `React.useMemo` hook but instead of returning some value,
  // It registers a synchronous effect with a cleanup function.
  useSyncEffect(() => {
    if (props.disabled && focusState.current) focusState.current = false;
    return () => {
      // cleanup function
    }
  }, [props.disabled]);

  // ... the code that immediately benefits from the effect ...

  return (
    <div>...</div>
  );
};
```

## API

### `useSyncEffect(effectCallback, dependencyList)`

```ts
declare const useSyncEffect = (
  effectCallback: React.EffectCallback,
  dependencyList: React.DependencyList
) => void;
```

#### `effectCallback`

The effect function.

#### `dependencyList`

The list of the attributes that effect callback depends on.
