import { useCallback, useEffect, useState } from "react";
import type { SubscribeCallback } from "./types.ts";

/**
 * A custom React hook that synchronizes component state with an external store.
 * Handles both client-side and server-side rendering scenarios.
 *
 * @template State The type of state managed by the store
 * @param subscribe Function to subscribe to store changes
 * @param getSnapshot Function to get the current state snapshot
 * @param getServerSnapshot Optional function to get the server-side snapshot (for SSR)
 * @returns The current state from the store
 */
export const useSyncStore = <State>(
  subscribe: (onStoreChange: SubscribeCallback) => () => void,
  getSnapshot: () => State,
  getServerSnapshot?: () => State,
): State => {
  /* v8 ignore start */
  const getIsomorphicSnapshot =
    typeof document !== "undefined"
      ? getSnapshot
      : (getServerSnapshot ?? getSnapshot);
  /* v8 ignore stop */

  const [state, setState] = useState(getIsomorphicSnapshot);

  const onStoreChange = useCallback(
    () => setState(() => getIsomorphicSnapshot()),
    [getIsomorphicSnapshot],
  );

  useEffect(() => subscribe(onStoreChange), [onStoreChange, subscribe]);

  return state;
};
