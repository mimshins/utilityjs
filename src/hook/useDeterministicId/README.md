<div align="center">
  <h1 align="center">
    useDeterministicId
  </h1>
</div>

<div align="center">

A React hook that generates a deterministic unique ID once per component.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-deterministic-id?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-deterministic-id)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-deterministic-id?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-deterministic-id)
[![types](https://img.shields.io/npm/types/@utilityjs/use-deterministic-id?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-deterministic-id)

```bash
npm i @utilityjs/use-deterministic-id | yarn add @utilityjs/use-deterministic-id
```

</div>

<hr>

## Usage

```tsx
const App = (props) => {
  const id = useDeterministicId();
  // or useDeterministicId(props.id)

  return (
    <div className="app">
      <label htmlFor={id}>Label</label>
      <input type="text" name="text-input" id={id} />
    </div>
  );
};
```

## Credit

Full credits to [Material-UI](https://github.com/mui-org/material-ui)

## API

### `useDeterministicId()`

```ts
declare const useDeterministicId: (idOverride?: string) => string | undefined;
```

#### `idOverride`

Allows you to override the generated id with your own id.
