<div align="center">
  <h1 align="center">
    useResizeSensor
  </h1>
</div>

<div align="center">

A React hook that handles element resizes using native `ResizeObserver`.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-resize-sensor?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-resize-sensor)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-resize-sensor?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-resize-sensor)
[![types](https://img.shields.io/npm/types/@utilityjs/use-resize-sensor?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-resize-sensor)

```bash
npm i @utilityjs/use-resize-sensor | yarn add @utilityjs/use-resize-sensor
```

</div>

<hr>

<div align="center">
  Live Demo: https://6g30j.csb.app/
</div>

<hr>

## Usage

```tsx
import useResizeSensor from "@utilityjs/use-resize-sensor";
import * as React from "react";

const Component = () => {
  const { width, height, registerNode } = useResizeSensor();

  return <div ref={registerNode}>Width: {width} | Height: {height}</div>
};
```

## API

### `useResizeSensor(refreshOptions?)`

```ts
interface RefreshOptions {
  mode: "debounce" | "throttle";
  rate?: number;
  leading?: boolean;
  trailing?: boolean;
}

declare const useResizeSensor: (
  refreshOptions?: RefreshOptions | undefined
) => {
  width: number;
  height: number;
  registerNode: <T extends HTMLElement>(node: T | null) => void;
};
```

#### `refreshOptions`

The options to adjust the refresh/tick behavior.

##### `refreshOptions.mode`

Values: `throttle`([Documentation](https://lodash.com/docs/4.17.15#throttle)) | `debounce`([Documentation](https://lodash.com/docs/4.17.15#debounce)) | `undefined`

##### `refreshOptions.rate` | Default: `250`

The number of milliseconds to either delay or throttle invocations to.

##### `refreshOptions.leading` | Default: (`true` for throttle mode / `false` for debounce mode)

Specify invoking on the leading edge of the timeout.

##### `refreshOptions.trailing` | Default: `true`

Specify invoking on the trailing edge of the timeout.