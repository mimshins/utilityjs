import type { Publish, Registry, Subscribe, Unsubscribe } from "./types.ts";

export const makeUnsubscribe =
  (registry: Registry): Unsubscribe =>
  (channel, callback) => {
    if (!registry[channel]) return;

    const cbs = registry[channel];

    registry[channel] = cbs.filter(cb => cb !== callback);
  };

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

export const makePublish =
  (registry: Registry): Publish =>
  channel => {
    if (!registry[channel]) return;

    registry[channel].forEach(cb => void cb());
  };
