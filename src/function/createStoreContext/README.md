<div align="center">
  <h1 align="center">
    createStoreContext
  </h1>
</div>

<div align="center">

An enhanced React store-context that manages states of a tree where unnecessary re-renders have been omitted.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)
[![types](https://img.shields.io/npm/types/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)

```bash
npm i @utilityjs/create-store-context | yarn add @utilityjs/create-store-context
```

</div>

<hr>

## Usage

```jsx
import createStoreContext from "createStoreContext";
import * as React from "react";

interface IStoreState {
  first: string;
  second: string;
}

const { StoreProvider, useStore } = createStoreContext<IStoreState>({
  first: "A",
  second: "B"
});

const TextInput = (props: { label: string }) => {
  const selector = React.useCallback(
    (state: IStoreState) => state[props.label as keyof IStoreState],
    [props.label]
  );

  const [state, setState] = useStore(selector);

  return (
    <div>
      <label>
        {props.label}{" "}
        <input
          type="text"
          value={state}
          onChange={event =>
            setState(s => ({ ...s, [props.label]: event.target.value }))
          }
        />
      </label>
    </div>
  );
};

const Display = (props: { label: string }) => {
  const selector = React.useCallback(
    (state: IStoreState) => state[props.label as keyof IStoreState],
    [props.label]
  );

  const [state] = useStore(selector);

  return (
    <div>
      {props.label}: {state}
    </div>
  );
};

const DisplayContainer = () => (
  <div>
    <h3>Display</h3>
    <Display label="First" />
    <Display label="Second" />
  </div>
);

const Form = () => (
  <div>
    <h3>Form</h3>
    <TextInput label="First" />
    <TextInput label="Second" />
  </div>
);

const Container = () => (
  <div>
    <h2>Container</h2>
    <Form />
    <DisplayContainer />
  </div>
);

const App = () => {
  return (
    <main id="main">
      <div id="main-wrapper">
        <StoreProvider>
          <h1>App</h1>
          <Container />
        </StoreProvider>
      </div>
    </main>
  );
};
```

## API

### `createStoreContext(initialState)`

```ts
type StateSelector<State, PartialState> = (
  store: State
) => PartialState;

type UseStoreHook<State> = <PartialState = State>(
  selector?: StateSelector<State, PartialState>
) => [PartialState, React.Dispatch<React.SetStateAction<State>>];

declare const createStoreContext: <State>(initialState: State) => {
  StoreProvider: (props: { children: React.ReactNode }) => JSX.Element;
  useStore: UseStoreHook<State>;
};
```

#### `initialState`

The initial state of the store.
