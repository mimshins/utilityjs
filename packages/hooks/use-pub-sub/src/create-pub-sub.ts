import { useEffect } from "react";
import type { Publish, Registry, Subscribe, Unsubscribe } from "./types.ts";
import { makePublish, makeSubscribe, makeUnsubscribe } from "./utils.ts";

const __GLOBAL_REGISTRY__: Registry = {};

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
