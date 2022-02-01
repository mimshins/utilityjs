<div align="center">
  <h1 align="center">
    useIsInViewport
  </h1>
</div>

<div align="center">

A React hook that tells you when an element enters or leaves the viewport.\
(Reuses observer instances where possible)

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-is-in-viewport?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-in-viewport)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-is-in-viewport?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-in-viewport)
[![types](https://img.shields.io/npm/types/@utilityjs/use-is-in-viewport?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-in-viewport)

```bash
npm i @utilityjs/use-is-in-viewport | yarn add @utilityjs/use-is-in-viewport
```

</div>

<hr />

## Usage

```tsx
const App: React.FC = () => {
  const { registerNode, isInViewport } = useIsInViewport();

  console.log(`is red box in the viewport? ${isInViewport}`);

  return (
    <div className="app">
      <div style={{ height: 300,backgroundColor: "black" }}></div>
      <div style={{ height: 300,backgroundColor: "black" }}></div>
      <div style={{ height: 300,backgroundColor: "black" }}></div>
      <div
        ref={registerNode}
        style={{
          height: 300,
          backgroundColor: "red"
        }}
      ></div>
      <div style={{ height: 300,backgroundColor: "black" }}></div>
      <div style={{ height: 300,backgroundColor: "black" }}></div>
    </div>
  );
};
```

## API

### `useIsInViewport( options?)`

```ts
interface HookOptions {
  once?: boolean;
  disabled?: boolean;
}

interface HookConsumer {
  registerNode: <T extends HTMLElement>(node: T | null) => void;
  isInViewport: boolean;
}

declare const useIsInViewport: (
  options?: (IntersectionObserverInit & HookOptions) | undefined
) => HookConsumer;
```

#### `options.once` - (default: `false`)

Only trigger the callback once. (unless you have toggled `disabled` option.)

#### `options.disabled` - (default: `false`)

Skip creating the observer.\
You can use this to enable and disable the observer as needed.

#### `options.threshold` - (default: `[0, 1]`)

Read the [MDN Web Doc](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_observer_options)

#### `options.root` - (default: `null`)

Read the [MDN Web Doc](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_observer_options)

#### `options.rootMargin` - (default: `0px`)

Read the [MDN Web Doc](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_observer_options)