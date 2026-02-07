import { useEffect } from "react";
import type {
  ChannelMap,
  Publish,
  Registry,
  Subscribe,
  Unsubscribe,
} from "./types.ts";
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
 * @template TChannelMap The channel map defining available channels and their data types
 * @param scopedRegistry Optional registry to use instead of the global one
 * @returns Object containing useSubscribe hook, publish, and unsubscribe functions
 *
 * @example
 * ```tsx
 * // Define your channels
 * type MyChannels = {
 *   'user-login': { userId: string; timestamp: number };
 *   'user-logout': { userId: string };
 *   'notification': string;
 *   'refresh': void;
 * };
 *
 * // Create a type-safe pub-sub system
 * const { useSubscribe, publish } = createPubSub<MyChannels>();
 *
 * // Subscribe with type safety
 * useSubscribe('user-login', (data) => {
 *   console.log(data.userId, data.timestamp); // TypeScript knows the shape
 * });
 *
 * // Publish with type safety
 * publish('user-login', { userId: '123', timestamp: Date.now() });
 *
 * // Or create a scoped system
 * const registry = {};
 * const { useSubscribe, publish } = createPubSub<MyChannels>(registry);
 * ```
 */
export const createPubSub = <TChannelMap extends ChannelMap = ChannelMap>(
  scopedRegistry?: Registry,
): {
  useSubscribe: Subscribe<TChannelMap>;
  unsubscribe: Unsubscribe<TChannelMap>;
  publish: Publish<TChannelMap>;
} => {
  const registry = scopedRegistry ?? __GLOBAL_REGISTRY__;

  const useSubscribe: Subscribe<TChannelMap> = (channel, callback) => {
    useEffect(
      () => makeSubscribe<TChannelMap>(registry)(channel, callback),
      [channel, callback],
    );
  };

  return {
    useSubscribe,
    publish: makePublish<TChannelMap>(registry),
    unsubscribe: makeUnsubscribe<TChannelMap>(registry),
  };
};
