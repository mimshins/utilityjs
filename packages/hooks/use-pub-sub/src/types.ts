/** Callback function type for pub-sub subscriptions */
export type Callback = () => void;

/** Registry type that maps channel names to arrays of callback functions */
export type Registry = Record<string, Callback[]>;

/**
 * Function type for unsubscribing from a channel.
 *
 * @param channel The channel name to unsubscribe from
 * @param callback The callback function to remove
 */
export type Unsubscribe = (channel: string, callback: Callback) => void;

/**
 * Function type for subscribing to a channel.
 *
 * @param channel The channel name to subscribe to
 * @param callback The callback function to execute when the channel is published to
 */
export type Subscribe = (channel: string, callback: Callback) => void;

/**
 * Function type for publishing to a channel.
 *
 * @param channel The channel name to publish to
 */
export type Publish = (channel: string) => void;
