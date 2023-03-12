<div align="center">
  <h1 align="center">
    createStoreContext
  </h1>
</div>

<div align="center">

A React store-context that manages states of a tree where unnecessary re-renders have been omitted thanks to the Pub/Sub design pattern.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)
[![types](https://img.shields.io/npm/types/@utilityjs/create-store-context?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/create-store-context)

```bash
npm i @utilityjs/create-store-context | yarn add @utilityjs/create-store-context
```

</div>

<hr />

## How does it work?

The `<StoreProvider>` works as a Publisher and each `useStore` is a Subscriber. So when the state changes, only necessary Subscribers will be re-rendered. Since we are using `useRef` instead of `useState` the Publisher itself won't re-render.

This way we guarantee that only the necessary components need to be re-rendered.

<hr />

## Usage

```jsx
import createStoreContext from "@utilityjs/create-store-context";

interface StoreState {
  count: number;
  log: () => void;
  increase: (amount: number) => void;
}

const { useStore, StoreProvider } = createStoreContext<StoreState>(
  (setState, getState) => ({
    count: 0,
    log: () => void getState().count,
    increase: amount =>
      setState(state => ({ ...state, count: state.count + amount }))
  })
);

const Controls = () => {
  const increase = useStore(state => state.increase);

  return (
    <div>
      <button onClick={() => increase(1)}>Increase by 1</button>
      <button onClick={() => increase(5)}>Increase by 5</button>
      <button onClick={() => increase(10)}>Increase by 10</button>
    </div>
  );
};

const Display = () => {
  const { count, log } = useStore(state => ({
    count: state.count,
    log: state.log
  }));

  log();

  return <div>Count: {count}</div>;
};

const Container = () => (
  <div>
    <h2>Container</h2>
    <Controls />
    <Display />
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

### `createStoreContext(stateFactory)`

```ts
type StateSelector<State, PartialState> = (
  store: State
) => PartialState;

type UseStoreHook<State> = <PartialState = State>(
  selector: StateSelector<State, PartialState>
) => PartialState;

type StateFactory<S> = (
  setState: (setter: (prevState: S) => S) => void,
  getState: () => S
) => S;

declare const createStoreContext: <S>(stateFactory: StateFactory<S>) => {
  StoreProvider: (props: { children: React.ReactNode }) => JSX.Element;
  useStore: UseStoreHook<S>;
};
```

#### `stateFactory`

An initialization function to initialize the states.
