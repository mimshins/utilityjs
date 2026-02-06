<div align="center">

# UtilityJS | useControlledProp

A React hook that handles controllable props.

</div>

<hr />

## Features

- **Controlled/Uncontrolled Pattern**: Seamlessly supports both controlled and
  uncontrolled component patterns
- **Type Safety**: Full TypeScript support with generic types
- **Development Warnings**: Helpful warnings in development mode for common
  mistakes
- **Flexible Fallbacks**: Support for default values and fallback values
- **Stable API**: Consistent setter function that only works in uncontrolled
  mode

## Installation

```bash
npm install @utilityjs/use-controlled-prop
```

or

```bash
pnpm add @utilityjs/use-controlled-prop
```

## Usage

### Basic Example

```tsx
import { useControlledProp } from "@utilityjs/use-controlled-prop";

function MyInput({ value, defaultValue, onChange }) {
  const [inputValue, setInputValue, isControlled] = useControlledProp(
    value,
    defaultValue,
    "",
  );

  const handleChange = e => {
    const newValue = e.target.value;
    setInputValue(newValue); // Only works when uncontrolled
    onChange?.(newValue);
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={handleChange}
      />
      <p>Mode: {isControlled ? "Controlled" : "Uncontrolled"}</p>
    </div>
  );
}
```

### Controlled Usage

```tsx
function App() {
  const [value, setValue] = useState("controlled");

  return (
    <MyInput
      value={value}
      onChange={setValue}
    />
  );
}
```

### Uncontrolled Usage

```tsx
function App() {
  return (
    <MyInput
      defaultValue="uncontrolled"
      onChange={value => console.log("Changed:", value)}
    />
  );
}
```

### With Custom Fallback

```tsx
function MySelect({ value, defaultValue, options, onChange }) {
  const [selectedValue, setSelectedValue] = useControlledProp(
    value,
    defaultValue,
    options[0]?.value || "", // Fallback to first option
  );

  return (
    <select
      value={selectedValue}
      onChange={e => {
        setSelectedValue(e.target.value);
        onChange?.(e.target.value);
      }}
    >
      {options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Boolean Props

```tsx
function MyCheckbox({ checked, defaultChecked, onChange }) {
  const [isChecked, setIsChecked, isControlled] = useControlledProp(
    checked,
    defaultChecked,
    false,
  );

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={e => {
        setIsChecked(e.target.checked);
        onChange?.(e.target.checked);
      }}
    />
  );
}
```

## API

### `useControlledProp<T>(controlledValueProp, defaultValueProp, fallbackValue)`

#### Parameters

- `controlledValueProp: T | undefined` - The controlled value from props. When
  defined, the component operates in controlled mode
- `defaultValueProp: T | undefined` - The default value for uncontrolled mode
- `fallbackValue: T` - The fallback value used when both controlled and default
  values are undefined

#### Returns

Returns a tuple `[value, setUncontrolledValue, isControlled]`:

- `value: T` - The current value (controlled value or internal state)
- `setUncontrolledValue: Dispatch<SetStateAction<T>>` - Setter function that
  only works in uncontrolled mode
- `isControlled: boolean` - Whether the component is operating in controlled
  mode

#### Behavior

- **Controlled Mode**: When `controlledValueProp` is not `undefined`, the hook
  returns the controlled value and the setter becomes a no-op
- **Uncontrolled Mode**: When `controlledValueProp` is `undefined`, the hook
  manages internal state using `defaultValueProp` or `fallbackValue`
- **Mode Stability**: The controlled/uncontrolled mode is determined on first
  render and cannot change during the component's lifetime

#### Development Warnings

The hook provides helpful warnings in development mode:

- Warning when switching between controlled and uncontrolled modes
- Warning when changing the default value of an uncontrolled component
- Warning when all values (controlled, default, and fallback) are undefined

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
