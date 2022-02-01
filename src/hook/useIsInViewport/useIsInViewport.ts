/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useRegisterNodeRef from "@utilityjs/use-register-node-ref";
import * as React from "react";

type ObserveCallback = (isInView: boolean, isIntersected: boolean) => void;

interface ObserverInstance {
  id: string;
  observer: IntersectionObserver;
  nodes: HTMLElement[];
}

interface HookOptions {
  once?: boolean;
  disabled?: boolean;
}

let rootId = 0;
const RootIds = new WeakMap<Element | Document, string>();
const observers = new Map<string, ObserverInstance>();

const requestIdleCallback =
  (typeof self !== "undefined" &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  function (cb: IdleRequestCallback): number {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1) as unknown as number;
  };

const cancelIdleCallback =
  (typeof self !== "undefined" &&
    self.cancelIdleCallback &&
    self.cancelIdleCallback.bind(window)) ||
  function (id: number) {
    return clearTimeout(id);
  };

const getObserver = () => {
  if (typeof global !== "undefined" && global.IntersectionObserver)
    return global.IntersectionObserver;

  if (typeof globalThis !== "undefined" && globalThis.IntersectionObserver)
    return globalThis.IntersectionObserver;

  if (typeof window !== "undefined" && window.IntersectionObserver)
    return window.IntersectionObserver;

  if (typeof IntersectionObserver !== "undefined") return IntersectionObserver;

  return null;
};

const getRootId = (rootOption: IntersectionObserverInit["root"]) => {
  if (!rootOption) return "0";
  if (RootIds.has(rootOption)) return RootIds.get(rootOption)!;

  rootId += 1;
  RootIds.set(rootOption, `${rootId}`);

  return `${rootId}`;
};

const createId = (options: IntersectionObserverInit) =>
  Object.keys(options)
    .sort()
    .filter(key => options[<keyof IntersectionObserverInit>key] !== undefined)
    .map(
      key =>
        `${key}_${
          key === "root"
            ? getRootId(options.root)
            : String(options[<keyof Omit<IntersectionObserverInit, "root">>key])
        }`
    )
    .toString();

const observe = <T extends HTMLElement>(
  node: T,
  instance: ObserverInstance
) => {
  instance.observer.observe(node);
  instance.nodes.push(node);
};

const unobserve = <T extends HTMLElement>(
  node: T,
  instance: ObserverInstance
) => {
  const index = instance.nodes.indexOf(node);
  if (index > -1) instance.nodes.splice(index, 1);
  instance.observer.unobserve(node);

  // Destroy observer when there's nothing left to watch
  if (instance.nodes.length === 0) {
    instance.observer.disconnect();
    observers.delete(instance.id);
  }
};

const createObserver = <T extends HTMLElement>(
  node: T,
  callback: ObserveCallback,
  options: IntersectionObserverInit
) => {
  const Observer = getObserver();
  if (!Observer) return null;

  const id = createId(options);
  const instance = observers.get(id);

  if (instance) {
    return {
      observe: () => void observe(node, instance),
      unobserve: () => void unobserve(node, instance)
    };
  }

  const thresholds: { current: number[] | readonly number[] } = { current: [] };

  const observer = new Observer(entries => {
    entries.forEach(entry => {
      const isIntersected =
        entry.isIntersecting &&
        thresholds.current.some(t => entry.intersectionRatio >= t);

      callback(isIntersected, entry.isIntersecting);
    });
  }, options);

  thresholds.current =
    observer.thresholds ||
    (Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold!]);

  const newInstance: ObserverInstance = { id, observer, nodes: [] };
  observers.set(id, newInstance);

  return {
    observe: () => void observe(node, newInstance),
    unobserve: () => void unobserve(node, newInstance)
  };
};

interface HookConsumer {
  registerNode: ReturnType<typeof useRegisterNodeRef>;
  isInViewport: boolean;
}

const useIsInViewport = (
  options?: IntersectionObserverInit & HookOptions
): HookConsumer => {
  const {
    threshold = [0, 1],
    root = null,
    rootMargin = "0px",
    once = false,
    disabled = false
  } = options || {};

  const [isInViewport, setIsInViewport] = React.useState(false);

  const registerNode = useRegisterNodeRef(
    node => {
      if (disabled) return;

      const observer = createObserver(
        node,
        (inViewState, isIntersected) => {
          if (isIntersected && once) observer?.unobserve();
          setIsInViewport(inViewState);
        },
        { threshold, root, rootMargin }
      );

      if (!observer) return;

      observer.observe();
      return () => void observer.unobserve();
    },
    [disabled]
  );

  React.useEffect(() => {
    if (getObserver() || isInViewport) return;

    const idleCallback = requestIdleCallback(() => void setIsInViewport(true));
    return () => cancelIdleCallback(idleCallback);
  }, [isInViewport]);

  return { registerNode, isInViewport };
};

export default useIsInViewport;
