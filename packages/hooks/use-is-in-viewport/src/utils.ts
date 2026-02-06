/** Callback function type for intersection observer */
type ObserveCallback = (isInView: boolean, isIntersected: boolean) => void;

/** Observer instance with metadata */
type ObserverInstance = {
  id: string;
  observer: IntersectionObserver;
  nodes: HTMLElement[];
};

let rootId = 0;
const RootIds = new WeakMap<Element | Document, string>();
const observers = new Map<string, ObserverInstance>();

/**
 * Cross-platform requestIdleCallback implementation.
 * Falls back to setTimeout if requestIdleCallback is not available.
 */
export const requestIdleCallback =
  (typeof self !== "undefined" &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  function (cb: IdleRequestCallback): number {
    const start = Date.now();

    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1) as unknown as number;
  };

/**
 * Cross-platform cancelIdleCallback implementation.
 * Falls back to clearTimeout if cancelIdleCallback is not available.
 */
export const cancelIdleCallback =
  (typeof self !== "undefined" &&
    self.cancelIdleCallback &&
    self.cancelIdleCallback.bind(window)) ||
  function (id: number) {
    return clearTimeout(id);
  };

/**
 * Gets the IntersectionObserver constructor from the global scope.
 * Checks multiple global objects for cross-environment compatibility.
 *
 * @returns The IntersectionObserver constructor or null if not available
 */
export const getObserver = () => {
  if (typeof global !== "undefined" && global.IntersectionObserver)
    return global.IntersectionObserver;

  if (typeof globalThis !== "undefined" && globalThis.IntersectionObserver)
    return globalThis.IntersectionObserver;

  if (typeof window !== "undefined" && window.IntersectionObserver)
    return window.IntersectionObserver;

  if (typeof IntersectionObserver !== "undefined") return IntersectionObserver;

  return null;
};

/**
 * Gets or creates a unique ID for a root element.
 *
 * @param rootOption The root element for intersection observation
 * @returns A unique string ID for the root element
 */
const getRootId = (rootOption: IntersectionObserverInit["root"]) => {
  if (!rootOption) return "0";
  if (RootIds.has(rootOption)) return RootIds.get(rootOption)!;

  rootId += 1;
  RootIds.set(rootOption, `${rootId}`);

  return `${rootId}`;
};

/**
 * Creates a unique ID for an intersection observer based on its options.
 *
 * @param options The intersection observer options
 * @returns A unique string ID representing the observer configuration
 */
const createId = (options: IntersectionObserverInit) =>
  Object.keys(options)
    .sort()
    .filter(key => options[key as keyof IntersectionObserverInit] !== undefined)
    .map(
      key =>
        `${key}_${
          key === "root"
            ? getRootId(options.root)
            : String(
                options[key as keyof Omit<IntersectionObserverInit, "root">],
              )
        }`,
    )
    .toString();

/**
 * Starts observing a node with the given observer instance.
 *
 * @template T The type of HTML element
 * @param node The DOM node to observe
 * @param instance The observer instance
 */
const observe = <T extends HTMLElement>(
  node: T,
  instance: ObserverInstance,
) => {
  instance.observer.observe(node);
  instance.nodes.push(node);
};

/**
 * Stops observing a node and cleans up the observer if no nodes remain.
 *
 * @template T The type of HTML element
 * @param node The DOM node to stop observing
 * @param instance The observer instance
 */
const unobserve = <T extends HTMLElement>(
  node: T,
  instance: ObserverInstance,
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

/**
 * Creates or reuses an intersection observer for the given node and options.
 * Observers are shared between nodes with identical configurations for performance.
 *
 * @template T The type of HTML element
 * @param node The DOM node to observe
 * @param callback Function called when intersection state changes
 * @param options Intersection observer configuration options
 * @returns An object with observe and unobserve methods, or null if IntersectionObserver is not available
 */
export const createObserver = <T extends HTMLElement>(
  node: T,
  callback: ObserveCallback,
  options: IntersectionObserverInit,
) => {
  const Observer = getObserver();

  if (!Observer) return null;

  const id = createId(options);
  const instance = observers.get(id);

  if (instance) {
    return {
      observe: () => void observe(node, instance),
      unobserve: () => void unobserve(node, instance),
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
    unobserve: () => void unobserve(node, newInstance),
  };
};
