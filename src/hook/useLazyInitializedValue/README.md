<div align="center">
  <h1 align="center">
    useLazyInitializedValue
  </h1>
</div>

<div align="center">

A React hook that holds a lazy-initialized value for a component's lifecycle.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-lazy-initialized-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-lazy-initialized-value)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-lazy-initialized-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-lazy-initialized-value)
[![types](https://img.shields.io/npm/types/@utilityjs/use-lazy-initialized-value?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-lazy-initialized-value)

```bash
npm i @utilityjs/use-lazy-initialized-value | yarn add @utilityjs/use-lazy-initialized-value
```

</div>

<hr />

This hook calls the provided `initFactory` on mount and returns the factory value for the duration of the component's lifecycle. See React docs on [creating expensive objects lazily](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily).

#### **Comparison to `useMemo`**
You may rely on `useMemo` only as a performance optimization, not as a [semantic guarantee](https://reactjs.org/docs/hooks-reference.html#usememo). 
React may throw away the cached value and recall your factory even if deps did not change.

#### **Comparison to `useState`**
You can get the same result using `useState(factory)[0]`, but it's a little more expensive supporting unused update functionality.

The right way is to implement it using `useRef` as described in React doc's [how to create expensive objects lazily](https://reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily). However, `useLazyInitializedValue` is likely more convenient and hides the `ref.current` implementation detail.

<hr />

## Usage

```tsx
const Component = () => {
  // Creating expensive object lazily
  // Can guarantee that `obj` is always same instance
  const obj = useLazyInitializedValue(() => {
    return createExpensiveObject();
  });

  // ...
}
```

## API

### `useLazyInitializedValue(initFactory)`

```ts
declare const useLazyInitializedValue: <T>(initFactory: () => T) => T;
```