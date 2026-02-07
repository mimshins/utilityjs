import type { Publish, Registry, Subscribe, Unsubscribe } from "./types.ts";

/**
 * Creates an unsubscribe function for a given registry.
 *
 * @param registry The registry to operate on
 * @returns Function that removes a callback from a channel
 */
export const makeUnsubscribe =
  (registry: Registry): Unsubscribe =>
  (channel, callback) => {
    if (!registry[channel]) return;

    const cbs = registry[channel];

    registry[channel] = cbs.filter(cb => cb !== callback);
  };

/**
 * Creates a subscribe function for a given registry.
 *
 * @param registry The registry to operate on
 * @returns Function that adds a callback to a channel and returns an unsubscribe function
 */
export const makeSubscribe =
  (registry: Registry): Subscribe =>
  (channel, callback) => {
    if (!registry[channel]) registry[channel] = [];

    const unsubscribe = () => makeUnsubscribe(registry)(channel, callback);

    const cbs = registry[channel];

    if (cbs.includes(callback)) return unsubscribe;

    registry[channel] = [...cbs, callback];

    return unsubscribe;
  };

/**
 * Creates a publish function for a given registry.
 *
 * @param registry The registry to operate on
 * @returns Function that executes all callbacks for a given channel
 */
export const makePublish =
  (registry: Registry): Publish =>
  channel => {
    if (!registry[channel]) return;

    registry[channel].forEach(cb => void cb());
  };
