<div align="center">
  <h1 align="center">
    useRegisterNodeRef
  </h1>
</div>

<div align="center">

A React hook that helps you to run some code when a DOM node mounts/dismounts.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-register-node-ref?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-register-node-ref)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-register-node-ref?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-register-node-ref)
[![types](https://img.shields.io/npm/types/@utilityjs/use-register-node-ref?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-register-node-ref)

```bash
npm i @utilityjs/use-register-node-ref | yarn add @utilityjs/use-register-node-ref
```

</div>

<hr>

Keep in mind that `useRef` doesn't notify you when its content changes. Mutating the `current` property doesn't cause a re-render. This hook will register a callback to DOM node so you can be notified when it mounts/dismounts.

This hook also supports dynamic/conditional rendering as well.

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const [isVisible, setVisibile] = React.useState(false);

  const registerRef = useRegisterNodeRef(node => {
    // The callback effect to invoke when node mounts/dismounts

    const listener = () => {
      console.log("clicked");
    };

    if (node) node.addEventListener("click", listener);

    // The cleanup function
    return () => {
      if (node) node.removeEventListener("click", listener);
    };
  });

  return (
    <div className="app">
      <button onClick={() => void setVisibile(v => !v)}>toggle</button>
      {isVisible && <div ref={registerRef}>This is the DIV!</div>}
    </div>
  );
};
```

## API

### `useRegisterNodeRef(callback)`

```ts
declare type Destructor = () => void | undefined;

declare type Callback = <T extends HTMLElement>(
  node: T | null
) => void | Destructor;

declare const useRegisterNodeRef: (
  callback: Callback
) => (node: Parameters<Callback>[number]) => void;
```

#### `callback`

The callback effect to invoke when DOM node mounts/dismounts.<br />
Note: This callback can also return a cleanup function.