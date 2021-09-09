<div align="center">
  <h1 align="center">
    useForkedRefs
  </h1>
</div>

<div align="center">

A React hook for forking/merging multiple refs into a single one.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-forked-refs?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-forked-refs)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-forked-refs?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-forked-refs)
[![types](https://img.shields.io/npm/types/@utilityjs/use-forked-refs?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-forked-refs)

```bash
npm i @utilityjs/use-forked-refs
```

</div>

<hr>

## Usage

```jsx
import * as React from "react";
import useForkedRefs from "@utilityjs/use-forked-refs";

const MyComponent = React.forwardRef((props, ref) => {
  const rootRef = React.useRef(null);
  const handleRef = useForkedRefs(ref, rootRef);

  return <div ref={handleRef} />;
});
```

## API

### `useForkedRefs(...refs)`

```ts
declare const useForkedRefs: <T>(...refs: React.Ref<T>[]) => (instance: T | null) => void;
```

#### `refs`

React callback refs or refs created with `useRef()` or `createRef()`.
