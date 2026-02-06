import { useGetLatest } from "@utilityjs/use-get-latest";
import { useEffect, type RefObject } from "react";
import { isOptionParamSupported } from "./utils.ts";

type ElementEventListener<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => void;

type DocumentEventListener<K extends keyof DocumentEventMap> = (
  this: Document,
  ev: DocumentEventMap[K],
) => void;

type WindowEventListener<K extends keyof WindowEventMap> = (
  this: Window,
  ev: WindowEventMap[K],
) => void;

export type Options = boolean | AddEventListenerOptions;

type UseEventListener = {
  <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    config: {
      target: RefObject<T> | T | null;
      eventType: K;
      handler: ElementEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean,
  ): void;
  <K extends keyof DocumentEventMap, T extends Document = Document>(
    config: {
      target: T | null;
      eventType: K;
      handler: DocumentEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean,
  ): void;
  <K extends keyof WindowEventMap, T extends Window = Window>(
    config: {
      target: T | null;
      eventType: K;
      handler: WindowEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean,
  ): void;
};

export const useEventListener: UseEventListener = (
  config: {
    target: RefObject<HTMLElement> | HTMLElement | Window | Document | null;
    eventType: string;
    handler: unknown;
    options?: Options;
  },
  shouldAttach = true,
): void => {
  const { target = null, eventType, handler, options } = config;

  const cachedOptions = useGetLatest(options);
  const cachedHandler = useGetLatest(handler);

  useEffect(() => {
    const element = target && "current" in target ? target.current : target;

    if (!element) return;

    let unsubscribed = false;
    const listener = (event: Event) => {
      if (unsubscribed) return;

      (cachedHandler.current as (ev: Event) => void)(event);
    };

    let thirdParam = cachedOptions.current;

    if (typeof cachedOptions.current !== "boolean") {
      if (isOptionParamSupported()) thirdParam = cachedOptions.current;
      else thirdParam = cachedOptions.current?.capture;
    }

    if (shouldAttach) {
      element.addEventListener(eventType, listener, thirdParam);
    }

    return () => {
      unsubscribed = true;
      element.removeEventListener(eventType, listener, thirdParam);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, eventType, shouldAttach]);
};
