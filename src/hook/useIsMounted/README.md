<div align="center">
  <h1 align="center">
    useIsMounted
  </h1>
</div>

<div align="center">

A React hook that returns `true` if the component is mounted.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-is-mounted?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-mounted)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-is-mounted?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-mounted)
[![types](https://img.shields.io/npm/types/@utilityjs/use-is-mounted?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-mounted)

```bash
npm i @utilityjs/use-is-mounted | yarn add @utilityjs/use-is-mounted
```

</div>

<hr>

## Usage

```ts
import useGetLatest from "@utilityjs/use-get-latest";
import useIsMounted from "@utilityjs/use-is-mounted";
import * as React from "react";

const useHook = (callback: () => void) => {
  const isMounted = useIsMounted();

  const cachedCallback = useGetLatest(callback);

  React.useEffect(() => {
    const cb = cachedCallback.current();
    if (isMounted()) cb();
  }, []);
};
```

## API

### `useIsMounted()`

```ts
declare const useIsMounted: () => (() => boolean);
```
