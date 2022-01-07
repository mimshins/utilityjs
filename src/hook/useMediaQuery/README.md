<div align="center">
  <h1 align="center">
    useMediaQuery
  </h1>
</div>

<div align="center">

A React hook that helps detect whether media queries individually match.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-media-query?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-media-query)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-media-query?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-media-query)
[![types](https://img.shields.io/npm/types/@utilityjs/use-media-query?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-media-query)

```bash
npm i @utilityjs/use-media-query | yarn add @utilityjs/use-media-query
```

</div>

<hr>

## Usage

```tsx
import * as React from "react";
import useMediaQuery from "@utilityjs/use-media-query";

const App: React.FC = () => {
  const [min, setMin] = React.useState(100);
  const [max, setMax] = React.useState(100);

  const matches = useMediaQuery([
    `(min-width: ${min}px)`,
    `(max-width: ${max}px)`
  ]);

  return (
    <div>
      {matches.join(", ")}
      <hr />
      min:{" "}
      <input
        type="number"
        defaultValue={min}
        placeholder="Set min"
        onChange={e => setMin(parseInt(e.target.value))}
      />
      <br />
      max:{" "}
      <input
        type="number"
        defaultValue={max}
        placeholder="Set max"
        onChange={e => setMax(parseInt(e.target.value))}
      />
      <br />
    </div>
  );
};

export default App;
```

## API

### `useMediaQuery(query)`

```ts
declare const useMediaQuery: (query: string | string[]) => boolean[];
```

#### `query`

A string or array of strings specifying the media query/queries to parse into [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList).

