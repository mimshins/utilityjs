<div align="center">
  <h1 align="center">
    useHover
  </h1>
</div>

<div align="center">

A React hook that determines if the mouse is hovering an element.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-hover?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hover)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-hover?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hover)
[![types](https://img.shields.io/npm/types/@utilityjs/use-hover?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-hover)

```bash
npm i @utilityjs/use-hover | yarn add @utilityjs/use-hover
```

</div>

<hr>

## Usage

```tsx
const App: React.FC = () => {
  const { isHovered, registerRef } = useHover();

  return (
    <div className="app">
      <div ref={registerRef}>
        {`The current div is ${isHovered ? `hovered` : `unhovered`}`}
      </div>
    </div>
  );
};
```

## API

### `useHover()`

```ts
declare const useHover: () => {
  isHovered: boolean;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  registerRef: ReturnType<typeof useRegisterNodeRef>;
};
```