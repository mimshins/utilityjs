import type { Vertex } from "./vertex.ts";

export type SearchCallbacks<T> = {
  onEnter: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  onLeave: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  shouldTraverse: (
    previous: Vertex<T> | null,
    current: Vertex<T>,
    next: Vertex<T>,
  ) => boolean;
};
