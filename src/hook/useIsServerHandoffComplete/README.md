<div align="center">
  <h1 align="center">
    useIsServerHandoffComplete
  </h1>
</div>

<div align="center">

A React hook that returns `true` if the SSR handoff completes.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-is-server-handoff-complete?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-server-handoff-complete)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-is-server-handoff-complete?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-server-handoff-complete)
[![types](https://img.shields.io/npm/types/@utilityjs/use-is-server-handoff-complete?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-is-server-handoff-complete)

```bash
npm i @utilityjs/use-is-server-handoff-complete | yarn add @utilityjs/use-is-server-handoff-complete
```

</div>

<hr>

## Usage

```ts
import useIsServerHandoffComplete from "@utilityjs/use-is-server-handoff-complete";
import * as React from "react";

let __ID__ = 0;

const useDeterministicId = (inputId?: string) => {
  const handoffCompletes = useIsServerHandoffComplete();

  const [id, setId] = React.useState<string | null>(
    inputId ?? handoffCompletes ? String(__ID__++) : null
  );

  React.useEffect(() => {
    if (id != null) return;
    setId(__ID__++);
  }, [id]);

  return id;
};
```

## API

### `useIsServerHandoffComplete()`

```ts
declare const useIsServerHandoffComplete: () => boolean;
```
