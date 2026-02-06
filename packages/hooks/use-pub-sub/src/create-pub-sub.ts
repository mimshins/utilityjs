import { useEffect } from "react";
import type { Publish, Registry, Subscribe, Unsubscribe } from "./types.ts";
import { makePublish, makeSubscribe, makeUnsubscribe } from "./utils.ts";

/** Global registry for pub-sub channels when no scoped registry is provided */
const __GLOBAL_REGISTRY__: Registry = {};

/**
 * Creates a pub-sub system with subscribe hook, publish, and unsubscribe functions.
 *
 * This function creates a complete publish-subscribe system that can be used
 * across React components. It supports both global and scoped registries for
 * better isolation when needed.
 *
 * @param scopedRegistry Optional registry to use instead of the global one
 * @returns Object containing useSubscribe hook, publish, and unsubscribe functions
 *
 * @example
 * ```tsx
 * // Create a global pub-sub system
 * const { useSubscribe, publish, unsubscribe } = createPubSub();
 *
 * // Or create a scoped system
 * const registry = {};
 * const { useSubscribe, publish } = createPubSub(registry);
 * ```
 */
export const createPubSub = (
  scopedRegistry?: Registry,
): {
  useSubscribe: Subscribe;
  unsubscribe: Unsubscribe;
  publish: Publish;
} => {
  const registry = scopedRegistry ?? __GLOBAL_REGISTRY__;

  const useSubscribe: Subscribe = (channel, callback) => {
    useEffect(
      () => makeSubscribe(registry)(channel, callback),
      [channel, callback],
    );
  };

  return {
    useSubscribe,
    publish: makePublish(registry),
    unsubscribe: makeUnsubscribe(registry),
  };
};
