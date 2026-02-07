import type {
  Callback,
  ChannelMap,
  Publish,
  Registry,
  Subscribe,
  Unsubscribe,
} from "./types.ts";

/**
 * Creates an unsubscribe function for a given registry.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @param registry The registry to operate on
 * @returns Function that removes a callback from a channel
 */
export const makeUnsubscribe =
  <TChannelMap extends ChannelMap = ChannelMap>(
    registry: Registry,
  ): Unsubscribe<TChannelMap> =>
  (channel, callback) => {
    const key = channel;

    if (!registry[key]) return;

    const cbs = registry[key];

    registry[key] = cbs.filter(cb => cb !== callback);
  };

/**
 * Creates a subscribe function for a given registry.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @param registry The registry to operate on
 * @returns Function that adds a callback to a channel and returns an unsubscribe function
 */
export const makeSubscribe =
  <TChannelMap extends ChannelMap = ChannelMap>(
    registry: Registry,
  ): Subscribe<TChannelMap> =>
  (channel, callback) => {
    const key = channel;

    if (!registry[key]) registry[key] = [];

    const unsubscribe = () =>
      makeUnsubscribe<TChannelMap>(registry)(
        channel,
        callback as Callback<unknown>,
      );

    const cbs = registry[key];

    if (cbs.includes(callback as Callback<unknown>)) return unsubscribe;

    registry[key] = [...cbs, callback as Callback<unknown>];

    return unsubscribe;
  };

/**
 * Creates a publish function for a given registry.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @param registry The registry to operate on
 * @returns Function that executes all callbacks for a given channel
 */
export const makePublish =
  <TChannelMap extends ChannelMap = ChannelMap>(
    registry: Registry,
  ): Publish<TChannelMap> =>
  (channel, data) => {
    const key = channel;

    if (!registry[key]) return;

    registry[key].forEach(cb => void cb(data));
  };
