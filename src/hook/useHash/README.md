<div align="center">
  <h1 align="center">
    useHash
  </h1>
</div>

<div align="center">

A React hook that helps to sync and modify browser's location hash.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-hash?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hash)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-hash?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hash)
[![types](https://img.shields.io/npm/types/@utilityjs/use-hash?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hash)

```bash
npm i @utilityjs/use-hash | yarn add @utilityjs/use-hash
```

</div>

<hr>

## Usage

```tsx
import * as React from "react";
import useHash from "@utilityjs/use-hash";

const App: React.FC = () => {
  const hashConsumer = useHash();

  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");

  const addParam = () => {
    hashConsumer.addParam(key, value);
    setKey("");
    setValue("");
  };

  const deleteParam = () => {
    hashConsumer.deleteParam(key);
    setKey("");
    setValue("");
  };

  const deleteValue = () => {
    hashConsumer.deleteParamValue(key, value);
    setKey("");
    setValue("");
  };

  return <div className="app">
    <div>Hash: {hashConsumer.hash}</div>
    <div>Params: {JSON.stringify(hashConsumer.getParams(), null, 2)}</div>
    <br />
    <fieldset>
      <label htmlFor="param-key">Key</label>{" "}
      <input
        value={key}
        type="text"
        name="param:key"
        id="param-key"
        onChange={e => setKey(e.target.value)}
      />
      <br />
      <label htmlFor="param-val">Value</label>{" "}
      <input
        value={value}
        type="text"
        name="param:val"
        id="param-val"
        onChange={e => setValue(e.target.value)}
      />
      <br />
      <br />
      <button onClick={() => void addParam()}>Add Param</button>
      <button onClick={() => void deleteParam()}>Delete Param</button>
      <button onClick={() => void deleteValue()}>Delete Value</button>
      <button onClick={() => void hashConsumer.setHash(value)}>
        Set Hash State
      </button>
    </fieldset>
  </div>;
};

export default App;
```

## API

### `useHash()`

```ts
interface HashConsumer {
  /** The hash state. */
  hash: string;

  /** The hash state updater function. */
  setHash: React.Dispatch<React.SetStateAction<string>>;

  /** Returns a boolean value indicating if such a given parameter exists. */
  hasParam: (key: string) => boolean;

  /** Returns all parameters as key/value pairs. */
  getParams: () => Record<string, string | string[]>;

  /** Adds a specified key/value pair as a new parameter. */
  addParam: (key: string, value: string) => void;

  /**
   * Sets the value associated with a given parameter to the given value.
   * If there are several values, the others are deleted.
   */
  setParam: (key: string, value: string) => void;

  /** Deletes the given parameter, and its associated value. */
  deleteParam: (key: string) => void;

  /** Returns the values associated with a given parameter. */
  getParamValue: (key: string) => string | string[] | null;
  
  /**
   * Deletes the value associated with a given parameter.
   * If there aren't several values, the parameter is deleted.
   */
  deleteParamValue: (key: string, value: string) => void;
}

declare const useHash: () => HashConsumer;
```
