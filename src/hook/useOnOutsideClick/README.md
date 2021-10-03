<div align="center">
  <h1 align="center">
    useOnOutsideClick
  </h1>
</div>

<div align="center">

A React hook that invokes a callback when user clicks outside of the target element.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-on-outside-click?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-outside-click)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-on-outside-click?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-outside-click)
[![types](https://img.shields.io/npm/types/@utilityjs/use-on-outside-click?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-on-outside-click)

```bash
npm i @utilityjs/use-on-outside-click | yarn add @utilityjs/use-on-outside-click
```

</div>

<hr>

## Usage

```tsx
const MyComponent = (props) => {
  const targetRef = React.useRef<HTMLDivElement>();

  useOnOutsideClick(targetRef, () => {
    console.log("OUTSIDE!");
  });

  useOnOutsideClick(targetRef, () => {
    console.log("OUTSIDE AND NOT #some-id!");
    // Extending the condition
  }, event => ((event.target) as Node).id !== "some-id");

  return (
    <React.Fragment>
      <div ref={targetRef}>...</div>
    </React.Fragment>
  );
};
```

## API

### `useOnOutsideClick(target, callback, extendCondition?)`

```ts
declare const useOnOutsideClick: <T extends HTMLElement = HTMLElement>(
  target: T | React.RefObject<T> | null,
  callback: (event: MouseEvent) => void,
  extendCondition?: (event: MouseEvent) => boolean
) => void;
```

#### `target`

The target to test the conditions against.

#### `callback`

The callback that is called when the conditions are met.

#### `extendCondition`

The function that extends the test conditions.