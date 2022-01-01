<div align="center">
  <h1 align="center">
    useGetLatest
  </h1>
</div>

<div align="center">

A React hook that stores & updates `ref.current` with the most recent value.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-get-latest?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-latest)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-get-latest?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-latest)
[![types](https://img.shields.io/npm/types/@utilityjs/use-get-latest?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-get-latest)

```bash
npm i @utilityjs/use-get-latest | yarn add @utilityjs/use-get-latest
```

</div>

<hr>

## Usage

```jsx
import useGetLatest from "@utilityjs/use-get-latest";
import * as React from "react";

const useAttachDomClick = (callback) => {
  const cachedCallback = useGetLatest(callback);

  React.useEffect(() => {
    document.addEventListener("click", cachedCallback.current);
    return () => {
      document.removeEventListener("click", cachedCallback.current);
    }
  }, [])
};
```

## API

### `useGetLatest(value)`

```ts
declare const useGetLatest: <T>(value: T) => MutableRefObject<T>;
```

#### `value`

The value to be stored.
