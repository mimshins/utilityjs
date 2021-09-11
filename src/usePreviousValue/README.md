<div align="center">
  <h1 align="center">
    usePreviousValue
  </h1>
</div>

<div align="center">

A React hook that returns a value from the previous render.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-previous-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-previous-value)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-previous-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-previous-value)
[![types](https://img.shields.io/npm/types/@utilityjs/use-previous-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-previous-value)

```bash
npm i @utilityjs/use-previous-value | yarn add @utilityjs/use-previous-value
```

</div>

<hr>

## Usage

```ts
import usePreviousValue from "@utilityjs/use-previous-value";
import * as React from "react";

const useHook = () => {
  const [open, setOpen] = React.useState(false);

  const prevOpen = usePreviousValue(open);

  React.useEffect(() => {
    if (open !== prevOpen) {
      console.log("The state has been changed!");
    }
  }, [open])
};
```

## API

### `usePreviousValue(value)`

```ts
declare const usePreviousValue: <T>(value: T) => T | undefined;
```

#### `value`

The value on the current render.