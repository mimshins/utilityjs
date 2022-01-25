<div align="center">
  <h1 align="center">
    usePersistedState
  </h1>
</div>

<div align="center">

A React hook that provides a SSR-friendly multi-tab persistent state.\
(also supports multiple instances with the same key)

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-persisted-state?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-persisted-state)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-persisted-state?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-persisted-state)
[![types](https://img.shields.io/npm/types/@utilityjs/use-persisted-state?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-persisted-state)

```bash
npm i @utilityjs/use-persisted-state | yarn add @utilityjs/use-persisted-state
```

</div>

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const [state, setState] = usePersistedState(0, { name: "count" });

  return (
    <div className="app">
      <button onClick={() => void setState(v => v + 1)}>Increase</button>
      <div>{state}</div>
    </div>
  );
};
```

## API

### `usePersistedState(initialState, persistOptions)`

```ts
type StorageValue<T> = {
  state: T;
};

interface PersistOptions<T> {
  /** Name of the storage (must be unique) */
  name: string;
  /**
   * A function returning a storage.
   * The storage must fit `window.localStorage`'s api.
   *
   * @default () => localStorage
   */
  getStorage?: () => Storage | null;
  /**
   * Use a custom serializer.
   * The returned string will be stored in the storage.
   *
   * @default JSON.stringify
   */
  serializer?: (state: StorageValue<T>) => string;
  /**
   * Use a custom deserializer.
   * Must return an object matching StorageValue<State>
   *
   * @param str The storage's current value.
   * @default JSON.parse
   */
  deserializer?: (str: string) => StorageValue<T>;
}

declare const usePersistedState: <T>(
  initialState: T,
  options: PersistOptions<T>
) => [T, React.Dispatch<React.SetStateAction<T>>];
```

#### `initialState`

The initial value of the state.

#### `persistOptions`

The options to adjust the persistence behavior.

##### `persistOptions.name`

The name of the storage (must be unique).

##### `persistOptions.getStorage`
###### `default: () => localStorage`
A function returning a storage. The storage must fit `window.localStorage`'s api.

##### `persistOptions.serializer`
###### `default: JSON.stringify`
A custom serializer. The returned string will be stored in the storage.

##### `persistOptions.deserializer`
###### `default: JSON.parse`
A custom deserializer. Must return an object matching `StorageValue<State>`