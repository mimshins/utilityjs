<div align="center">
  <h1 align="center">
    useEventListener
  </h1>
</div>

<div align="center">

A React hook that handles binding/unbinding event listeners in a smart way.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/use-event-listener?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-event-listener)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/use-event-listener?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-event-listener)
[![types](https://img.shields.io/npm/types/@utilityjs/use-event-listener?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/use-event-listener)

```bash
npm i @utilityjs/use-event-listener | yarn add @utilityjs/use-event-listener
```

</div>

<hr>

## Usage

```ts
useEventListener({
  target: document,
  eventType: "click",
  handler: event => console.log(event)
});

useEventListener({
  target: window,
  eventType: "click",
  handler: event => console.log(event)
});

useEventListener({
  target: document.getElementById("target"),
  eventType: "click",
  handler: event => console.log(event)
});
```

## API

### `useEventListener(effectCallback, dependencyList)`

```ts
type UseEventListener = {
  <K extends keyof DocumentEventMap, T extends Document = Document>(
    config: {
      target: T | null;
      eventType: K;
      handler: DocumentEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
  <K extends keyof WindowEventMap, T extends Window = Window>(
    config: {
      target: T | null;
      eventType: K;
      handler: WindowEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
  <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    config: {
      target: React.RefObject<T> | T | null;
      eventType: K;
      handler: ElementEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
};

declare const useEventListener: UseEventListener;
```

#### `config`

##### `config.target`

The target to which the listener will be attached.

##### `config.eventType`

A case-sensitive string representing the event type to listen for.

##### `config.handler`

See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_event_listener_callback) for details on the callback itself.

##### `config.options`

See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) for details on the third parameter.

#### `shouldAttach`

If set to `false`, the listener won't be attached. (default = true)
