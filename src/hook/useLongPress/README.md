<div align="center">
  <h1 align="center">
    useLongPress
  </h1>
</div>

<div align="center">

A React hook that detects long clicks/taps.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-long-press?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-long-press)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-long-press?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-long-press)
[![types](https://img.shields.io/npm/types/@utilityjs/use-long-press?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-long-press)

```bash
npm i @utilityjs/use-long-press | yarn add @utilityjs/use-long-press
```

</div>

<hr />

## Usage

```tsx
const App: React.FC = () => {
  const { registerNode } = useLongPress(
    () => {
      console.log("long pressed");
    },
    { preventLongPressOnMove: true, preventContextMenuOnLongPress: true }
  );

  return (
    <div className="app">
      <div
        ref={registerNode}
        style={{ width: 48, height: 48, backgroundColor: "red" }}
      ></div>
    </div>
  );
};
```

## API

### `useLongPress(callback, options?)`

```ts
interface Options {
    pressDelay?: number;
    moveThreshold?: number;
    preventContextMenuOnLongPress?: boolean;
    preventLongPressOnMove?: boolean;
}

interface HookReturn {
    registerNode: <T extends HTMLElement>(node: T | null) => void;
}

declare const useLongPress: (callback: () => void, options?: Options) => HookReturn;

```

#### `callback`

The callback is called when the long press happened.

#### `options.pressDelay` - default: 500

The time (in miliseconds) user need to hold click or tap before long press callback is triggered.

#### `options.moveThreshold` - default: 25

The move tolerance in pixels.

#### `options.preventContextMenuOnLongPress` - default: false

Determines whether default context menu should be cancelled when long press happened.

#### `options.preventLongPressOnMove` - default: false

Determines whether long press should be cancelled when detected movement while pressing.