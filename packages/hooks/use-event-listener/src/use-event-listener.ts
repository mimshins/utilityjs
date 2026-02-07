import { useGetLatest } from "@utilityjs/use-get-latest";
import { useEffect, type RefObject } from "react";
import { isOptionParamSupported } from "./utils.ts";

/**
 * Event listener function type for HTML elements.
 */
type ElementEventListener<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => void;

/**
 * Event listener function type for Document.
 */
type DocumentEventListener<K extends keyof DocumentEventMap> = (
  this: Document,
  ev: DocumentEventMap[K],
) => void;

/**
 * Event listener function type for Window.
 */
type WindowEventListener<K extends keyof WindowEventMap> = (
  this: Window,
  ev: WindowEventMap[K],
) => void;

/**
 * Options for event listener configuration.
 * Can be a boolean (for capture) or AddEventListenerOptions object.
 */
export type Options = boolean | AddEventListenerOptions;

/**
 * Overloaded type definition for the useEventListener hook.
 * Provides type safety for different target types (HTMLElement, Document, Window).
 */
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

/**
 * A React hook that handles binding and unbinding event listeners in a smart way.
 *
 * This hook automatically manages event listener lifecycle, handles ref objects,
 * and provides type safety for different event targets. It also gracefully handles
 * browser compatibility for event listener options.
 *
 * @param config Configuration object containing target, event type, handler, and options
 * @param shouldAttach Whether to attach the event listener (default: true)
 *
 * @example
 * ```tsx
 * // Listen to window events
 * useEventListener({
 *   target: window,
 *   eventType: "resize",
 *   handler: () => console.log("Window resized")
 * });
 *
 * // Listen to element events with ref
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * useEventListener({
 *   target: buttonRef,
 *   eventType: "click",
 *   handler: (e) => console.log("Button clicked", e)
 * });
 *
 * // Listen to document events with options
 * useEventListener({
 *   target: document,
 *   eventType: "keydown",
 *   handler: (e) => console.log("Key pressed", e.key),
 *   options: { passive: true }
 * });
 * ```
 */
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
      /* v8 ignore start - defensive guard for race condition */
      if (unsubscribed) return;
      /* v8 ignore stop */

      (cachedHandler.current as (ev: Event) => void)(event);
    };

    let thirdParam = cachedOptions.current;

    if (typeof cachedOptions.current !== "boolean") {
      /* v8 ignore start - fallback for browsers without options support */
      if (isOptionParamSupported()) thirdParam = cachedOptions.current;
      else thirdParam = cachedOptions.current?.capture;
      /* v8 ignore stop */
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
