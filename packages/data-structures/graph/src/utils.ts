import type { SearchCallbacks } from "./types.ts";
import type { Vertex } from "./vertex.ts";

export const initSearchCallbacks = <T>(
  callbacks: Partial<SearchCallbacks<T>>,
): SearchCallbacks<T> => {
  return {
    onEnter: callbacks.onEnter ?? (() => void 0),
    onLeave: callbacks.onLeave ?? (() => void 0),
    shouldTraverse:
      callbacks.shouldTraverse ??
      (() => {
        const seen: Record<string, boolean> = {};

        return (_: Vertex<T> | null, __: Vertex<T>, next: Vertex<T>) => {
          if (seen[next.getKey()]) return false;

          seen[next.getKey()] = true;

          return true;
        };
      })(),
  };
};
