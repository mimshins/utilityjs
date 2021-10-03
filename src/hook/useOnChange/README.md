<div align="center">
  <h1 align="center">
    useOnChange
  </h1>
</div>

<div align="center">

A React hook that invokes a callback anytime a value changes.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-on-change?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-change)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-on-change?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-change)
[![types](https://img.shields.io/npm/types/@utilityjs/use-on-change?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-change)

```bash
npm i @utilityjs/use-on-change | yarn add @utilityjs/use-on-change
```

</div>

<hr>

## Usage

```tsx
import useOnChange from "@utilityjs/use-on-change";
import * as React from "react";

const MyComponent = (props) => {
  useOnChange(props.isOpen, (currentOpenState) => {
    console.log(`The current open state is: ${currentOpenState}`);
  })

  return ...;
};
```

## API

### `useOnChange(value, onChange)`

```ts
declare const useOnChange: <T>(value: T, onChange: (current: T) => void) => void;
```

#### `value`

The value to listen on.

#### `onChange`

The callback that is called when value changes.