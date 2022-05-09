<div align="center">
  <h1 align="center">
    useKeybind
  </h1>
</div>

<div align="center">

A React hook for invoking a callback when hotkeys are pressed.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-keybind?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-keybind)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-keybind?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-keybind)
[![types](https://img.shields.io/npm/types/@utilityjs/use-keybind?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-keybind)

```bash
npm i @utilityjs/use-keybind | yarn add @utilityjs/use-keybind
```

</div>

<hr>

<div align="center"><strong>NOTE</strong></div>

You can't bind multiple _normal keys_ (The keys which are not modifiers) but you can bind a combination of modifier keys and other keys.
<br />
<br />
For example, you can't bind these keys together: `["a", "b"]` or `["ArrowLeft", "s"]`, etc.

<hr>

## Usage

```tsx
import * as React from "react";
import useKeybind, { Keybinding } from "@utilityjs/use-keybind";

const keybind1: Keybinding = {
  keys: ["Meta", "s"],
  callback: event => {
    event.preventDefault();
    console.log("keybind 1");
  }
};

const keybind2: Keybinding = {
  keys: ["Meta", "Alt", "Shift", "s"],
  callback: event => {
    event.preventDefault();
    console.log("keybind 2");
  }
};

const App: React.FC = () => {
  useKeybind(window, [keybind1, keybind2]);

  return <div className="app"></div>;
};

export default App;
```

## API

### `useKeybind(target, bindings)`

```ts
declare const KEYS_KEYCODE: {
  readonly Space: "Space";
  readonly ";": "Semicolon";
  readonly "=": "Equal";
  readonly ",": "Comma";
  readonly "-": "Minus";
  readonly ".": "Period";
  readonly "/": "Slash";
  readonly "`": "Backquote";
  readonly "[": "BracketLeft";
  readonly "\\": "Backslash";
  readonly "]": "BracketRight";
  readonly "'": "Quote";
  readonly "1": "Digit1";
  readonly "2": "Digit2";
  readonly "3": "Digit3";
  readonly "4": "Digit4";
  readonly "5": "Digit5";
  readonly "6": "Digit6";
  readonly "7": "Digit7";
  readonly "8": "Digit8";
  readonly "9": "Digit9";
  readonly "0": "Digit0";
  readonly a: "KeyA";
  readonly b: "KeyB";
  readonly c: "KeyC";
  readonly d: "KeyD";
  readonly e: "KeyE";
  readonly f: "KeyF";
  readonly g: "KeyG";
  readonly h: "KeyH";
  readonly i: "KeyI";
  readonly j: "KeyJ";
  readonly k: "KeyK";
  readonly l: "KeyL";
  readonly m: "KeyM";
  readonly n: "KeyN";
  readonly o: "KeyO";
  readonly p: "KeyP";
  readonly q: "KeyQ";
  readonly r: "KeyR";
  readonly s: "KeyS";
  readonly t: "KeyT";
  readonly u: "KeyU";
  readonly v: "KeyV";
  readonly w: "KeyW";
  readonly x: "KeyX";
  readonly y: "KeyY";
  readonly z: "KeyZ";
};
declare const KEYS_KEYNAME: {
  readonly Backspace: "Backspace";
  readonly Tab: "Tab";
  readonly Enter: "Enter";
  readonly Shift: "Shift";
  readonly Control: "Control";
  readonly Alt: "Alt";
  readonly CapsLock: "CapsLock";
  readonly Escape: "Escape";
  readonly End: "End";
  readonly Home: "Home";
  readonly ArrowLeft: "ArrowLeft";
  readonly ArrowUp: "ArrowUp";
  readonly ArrowRight: "ArrowRight";
  readonly ArrowDown: "ArrowDown";
  readonly Insert: "Insert";
  readonly Delete: "Delete";
  readonly Meta: "Meta";
  readonly NumLock: "NumLock";
  readonly F1: "F1";
  readonly F2: "F2";
  readonly F3: "F3";
  readonly F4: "F4";
  readonly F5: "F5";
  readonly F6: "F6";
  readonly F7: "F7";
  readonly F8: "F8";
  readonly F9: "F9";
  readonly F10: "F10";
  readonly F11: "F11";
  readonly F12: "F12";
};

type KeyNames = keyof typeof KEYS_KEYNAME;
type KeyCodes = keyof typeof KEYS_KEYCODE;

export type Keys = KeyNames | KeyCodes;

export type KeyCallback = (event: KeyboardEvent) => void;
export type Keybinding = { keys: Keys[]; callback: KeyCallback };

type UseKeybind = {
  <T extends Window = Window>(target: T | null, bindings: Keybinding[]): void;
  <T extends Document = Document>(
    target: T | null,
    bindings: Keybinding[]
  ): void;
  <T extends HTMLElement = HTMLElement>(
    target: React.RefObject<T> | T | null,
    bindings: Keybinding[]
  ): void;
};

declare const useKeybind: UseKeybind;
export default useKeybind;
```

#### `target`

The target to which the listener will be attached.

#### `bindings`

The array of keybind mapping.

When the key and all of the modifiers in a keydown event match those defined in `bindings.keys`, the `bindings.callback` will be invoked.

