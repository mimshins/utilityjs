/**
 * Map of channel names to their data types.
 * Use this to define your pub-sub channels with type safety.
 *
 * @example
 * ```ts
 * type MyChannels = {
 *   'user-login': { userId: string; timestamp: number };
 *   'user-logout': { userId: string };
 *   'notification': string;
 *   'refresh': void;
 * };
 * ```
 */
export type ChannelMap = Record<string, unknown>;

/** Callback function type for pub-sub subscriptions */
export type Callback<T> = (data: T) => void;

/** Registry type that maps channel names to arrays of callback functions */
export type Registry = Record<string, Callback<unknown>[]>;

/**
 * Function type for unsubscribing from a channel.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @template TChannel The specific channel name
 * @param channel The channel name to unsubscribe from
 * @param callback The callback function to remove
 */
export type Unsubscribe<
  TChannelMap extends ChannelMap = ChannelMap,
  TChannel extends keyof TChannelMap & string = keyof TChannelMap & string,
> = (channel: TChannel, callback: Callback<TChannelMap[TChannel]>) => void;

/**
 * Function type for subscribing to a channel.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @template TChannel The specific channel name
 * @param channel The channel name to subscribe to
 * @param callback The callback function to execute when the channel is published to
 */
export type Subscribe<
  TChannelMap extends ChannelMap = ChannelMap,
  TChannel extends keyof TChannelMap & string = keyof TChannelMap & string,
> = (channel: TChannel, callback: Callback<TChannelMap[TChannel]>) => void;

/**
 * Function type for publishing to a channel.
 *
 * @template TChannelMap The channel map defining available channels and their data types
 * @template TChannel The specific channel name
 * @param channel The channel name to publish to
 * @param data The data to pass to all subscribers
 */
export type Publish<
  TChannelMap extends ChannelMap = ChannelMap,
  TChannel extends keyof TChannelMap & string = keyof TChannelMap & string,
> = (channel: TChannel, data: TChannelMap[TChannel]) => void;
