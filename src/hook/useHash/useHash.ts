/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";

interface HashConsumer {
  /** The hash state. */
  hash: string;
  /** The hash state updater function. */
  setHash: React.Dispatch<React.SetStateAction<string>>;
  /** Returns a boolean value indicating if such a given parameter exists. */
  hasParam: (key: string) => boolean;
  /** Returns all parameters as key/value pairs. */
  getParams: () => Record<string, string | string[]>;
  /** Adds a specified key/value pair as a new parameter. */
  addParam: (key: string, value: string) => void;
  /**
   * Sets the value associated with a given parameter to the given value.
   * If there are several values, the others are deleted.
   */
  setParam: (key: string, value: string) => void;
  /** Deletes the given parameter, and its associated value. */
  deleteParam: (key: string) => void;
  /** Returns the values associated with a given parameter. */
  getParamValue: (key: string) => string | string[] | null;
  /**
   * Deletes the value associated with a given parameter.
   * If there aren't several values, the parameter is deleted.
   */
  deleteParamValue: (key: string, value: string) => void;
}

const getLocation = (): Location | null => {
  if (typeof global !== "undefined" && global.location) return global.location;
  if (typeof globalThis !== "undefined" && globalThis.location)
    return globalThis.location;
  if (typeof window !== "undefined" && window.location) return window.location;
  if (typeof location !== "undefined") return location;

  return null;
};

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const useHash = (): HashConsumer => {
  const [hash, setHash] = React.useState("");

  const isInitialRenderCompleted = React.useRef(false);

  const setHashState: typeof setHash = React.useCallback(
    nextState => {
      const location = getLocation();

      if (!location) return;

      const _nextState =
        typeof nextState === "function"
          ? (nextState as (prevState: string) => string)(hash)
          : nextState;

      if (_nextState !== hash) {
        location.hash = _nextState;
        setHash(_nextState);
      }
    },
    [hash]
  );

  React.useEffect(() => {
    if (getLocation() && !isInitialRenderCompleted.current) {
      isInitialRenderCompleted.current = true;
    }
  });

  useIsomorphicLayoutEffect(() => {
    setHashState(getLocation()!.hash);
  }, []);

  React.useEffect(() => {
    let unsubscribed = false;

    const handleHashChange = () => {
      if (unsubscribed) return;
      setHashState(getLocation()!.hash);
    };

    addEventListener("hashchange", handleHashChange);
    return () => {
      unsubscribed = true;
      removeEventListener("hashchange", handleHashChange);
    };
  }, [setHashState]);

  const getParams: () => Record<string, string | string[]> =
    React.useCallback(() => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return {};

      const params: Record<string, string | string[]> = {};
      const searchParams = new URLSearchParams(location.hash.replace("#", ""));

      searchParams.forEach((value, key) => {
        if (key in params) {
          if (Array.isArray(params[key])) (<string[]>params[key]).push(value);
          else params[key] = [<string>params[key], value];
        } else params[key] = value;
      });

      return params;
    }, []);

  const hasParam = React.useCallback((key: string) => {
    const location = getLocation();

    if (!location || !isInitialRenderCompleted.current) return false;

    return new URLSearchParams(location.hash.replace("#", "")).has(key);
  }, []);

  const addParam = React.useCallback(
    (key: string, value: string) => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return;
      if (!key.trim().length) return;

      const searchParams = new URLSearchParams(location.hash.replace("#", ""));

      searchParams.append(key, value);
      setHashState(`#${searchParams.toString()}`);
    },
    [setHashState]
  );

  const setParam = React.useCallback(
    (key: string, value: string) => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return;

      const searchParams = new URLSearchParams(location.hash.replace("#", ""));

      searchParams.set(key, value);
      setHashState(`#${searchParams.toString()}`);
    },
    [setHashState]
  );

  const deleteParam = React.useCallback(
    (key: string) => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return;

      const searchParams = new URLSearchParams(location.hash.replace("#", ""));

      searchParams.delete(key);
      setHashState(`#${searchParams.toString()}`);
    },
    [setHashState]
  );

  const deleteParamValue = React.useCallback(
    (key: string, value: string) => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return;

      const searchParams = new URLSearchParams(location.hash.replace("#", ""));
      const values = searchParams.getAll(key);

      if (values.length === 0) return;

      if (values.length > 1) {
        const index = values.indexOf(value);

        if (index === -1) return;
        values.splice(index, 1);
      } else {
        if (values[0] !== value) return;
        searchParams.delete(key);
        return setHashState(`#${searchParams.toString()}`);
      }

      searchParams.delete(key);
      values.forEach(v => void searchParams.append(key, v));

      setHashState(`#${searchParams.toString()}`);
    },
    [setHashState]
  );

  const getParamValue = React.useCallback(
    (key: string): string | string[] | null => {
      const location = getLocation();

      if (!location || !isInitialRenderCompleted.current) return null;

      const searchParams = new URLSearchParams(location.hash.replace("#", ""));
      const values = searchParams.getAll(key);

      return values.length > 1 ? values : values[0];
    },
    []
  );

  return {
    hash,
    setHash: setHashState,
    hasParam,
    getParams,
    addParam,
    setParam,
    deleteParam,
    getParamValue,
    deleteParamValue
  };
};

export default useHash;
