import * as React from "react";

export type Callback = () => void;
export type Registry = Record<string, Callback[]>;

type Unsubscribe = (channel: string, callback: Callback) => void;
type Subscribe = (channel: string, callback: Callback) => void;
type Publish = (channel: string) => void;

const globalRegistry: Registry = {};

const makeUnsubscribe =
  (registry: Registry) => (channel: string, callback: Callback) => {
    if (!registry[channel]) return;

    const cbs = registry[channel];
    registry[channel] = cbs.filter(cb => cb !== callback);
  };

const makeSubscribe =
  (registry: Registry) => (channel: string, callback: Callback) => {
    if (!registry[channel]) registry[channel] = [];

    const unsubscriber = () => makeUnsubscribe(registry)(channel, callback);

    const cbs = registry[channel];
    if (cbs.includes(callback)) return unsubscriber;

    registry[channel] = [...cbs, callback];

    return unsubscriber;
  };

const makePublish = (registry: Registry) => (channel: string) => {
  if (!registry[channel]) return;

  registry[channel].forEach(cb => void cb());
};

export const createPubSub = (
  scopedRegistry?: Registry
): {
  useSubscribe: Subscribe;
  unsubscribe: Unsubscribe;
  publish: Publish;
} => {
  const registry = scopedRegistry ?? globalRegistry;

  const useSubscribe = (channel: string, callback: Callback) => {
    React.useEffect(
      () => makeSubscribe(registry)(channel, callback),
      [channel, callback]
    );
  };

  return {
    useSubscribe,
    publish: makePublish(registry),
    unsubscribe: makeUnsubscribe(registry)
  };
};
