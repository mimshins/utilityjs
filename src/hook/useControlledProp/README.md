<div align="center">
  <h1 align="center">
    useControlledProp
  </h1>
</div>

<div align="center">

A React hook that handles controllable props.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-controlled-prop?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-controlled-prop)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-controlled-prop?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-controlled-prop)
[![types](https://img.shields.io/npm/types/@utilityjs/use-controlled-prop?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-controlled-prop)

```bash
npm i @utilityjs/use-controlled-prop | yarn add @utilityjs/use-controlled-prop
```

</div>

<hr>

## Usage

```jsx
import * as React from "react";
import useControlledProp from "@utilityjs/use-controlled-prop";

const MyComponent = (props, ref) => {
  const {
    onChange,
    value: valueProp,
    defaultValue: defaultValueProp, s
    ...otherProps
  } = props;

  const [value, setUncontrolledValue] = useControlledProp(
    valueProp,
    defaultValueProp,
    "" // Fallback value (if both values were `undefined`)
  );

  return (
    <Input
      type="text"
      value={value}
      onChange={e => {
        if (onChange) onChange(e);
        // This line only works when the `valueProp` is not controlled
        setUncontrolledValue(e.target.value);
      }}
      {...otherProps}
    />
  );
};
```

## API

### `useControlledProp(controlledValue, defaultValue, fallbackValue)`

```ts
declare const useControlledProp: <T>(
  controlledValueProp: T | undefined,
  defaultValueProp: T | undefined,
  fallbackValue: T
) => [
  value: T,
  setUncontrolledValue: (value: React.SetStateAction<T>) => void,
  isControlled: boolean
];
```

#### `controlledValueProp`

The value to be controlled.

#### `defaultValueProp`

The default value.

#### `fallbackValue`

The value to fallback to when `controlledValue` and `defaultValueProp` were `undefined`.
