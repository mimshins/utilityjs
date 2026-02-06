import { useCallback, useEffect, useState } from "react";
import type { SubscribeCallback } from "./types.ts";

export const useSyncStore = <State>(
  subscribe: (onStoreChange: SubscribeCallback) => () => void,
  getSnapshot: () => State,
  getServerSnapshot?: () => State,
): State => {
  const getIsomorphicSnapshot =
    typeof document !== "undefined"
      ? getSnapshot
      : (getServerSnapshot ?? getSnapshot);

  const [state, setState] = useState(getIsomorphicSnapshot);

  const onStoreChange = useCallback(
    () => setState(() => getIsomorphicSnapshot()),
    [getIsomorphicSnapshot],
  );

  useEffect(() => subscribe(onStoreChange), [onStoreChange]);

  return state;
};
