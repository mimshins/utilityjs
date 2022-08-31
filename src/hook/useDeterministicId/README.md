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

<hr />

This hook in React versions less than 18 relies on hydration to avoid server/client mismatch errors.\
If you'd like to generate ids server-side, we suggest upgrading to React 18.

<hr />

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

## API

### `useDeterministicId(idOverride?, prefix?)`

```ts
declare const useDeterministicId: (idOverride?: string, prefix?: string) => string;
```

#### `idOverride`

Allows you to override the generated id with your own id.

#### `prefix`

Allows you to prefix the generated id.
