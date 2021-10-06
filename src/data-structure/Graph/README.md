<div align="center">
  <h1 align="center">
    Graph
  </h1>
</div>

<div align="center">

An implementation of Graph data structure.

[![license](https://img.shields.io/github/license/mimshins/utilityjs?color=212121&style=for-the-badge)](https://github.com/mimshins/utilityjs/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@utilityjs/graph?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/graph)
[![npm downloads](https://img.shields.io/npm/dm/@utilityjs/graph?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/graph)
[![types](https://img.shields.io/npm/types/@utilityjs/graph?color=212121&style=for-the-badge)](https://www.npmjs.com/package/@utilityjs/graph)

```bash
npm i @utilityjs/graph | yarn add @utilityjs/graph
```

</div>

<hr>

### `Graph(isDirected?)`

```ts
interface SearchCallbacks<T> {
  onEnter: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  onLeave: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  shouldTraverse: (
    previous: Vertex<T> | null,
    current: Vertex<T>,
    next: Vertex<T>
  ) => boolean;
}

export declare class Vertex<T> {
  constructor(value: T, key?: string | null);
  getValue(): T;
  setValue(value: T): void;
  addEdge(edge: Edge<T>): void;
  deleteEdge(edge: Edge<T>): void;
  getKey(): string;
  getEdges(): Edge<T>[];
  getDegree(): number;
  getNeighborEdge(vertex: Vertex<T>): Edge<T> | null;
  hasEdge(edge: Edge<T>): boolean;
  getSelfLoop(): Edge<T> | null;
  hasSelfLoop(): boolean;
  hasNeighbor(vertex: Vertex<T>): boolean;
  getNeighbors(): Vertex<T>[];
  clearEdges(): void;
}

export declare class Edge<T> {
  constructor(
    vA: Vertex<T>,
    vB: Vertex<T>,
    weight?: number,
    key?: string | null
  );
  setVA(vA: Vertex<T>): void;
  setVB(vB: Vertex<T>): void;
  getVA(): Vertex<T>;
  getVB(): Vertex<T>;
  isSelfLoop(): boolean;
  setWeight(weight: number): void;
  getWeight(): number;
  getKey(): string;
  reverse(): void;
}

export default class Graph<T> {
  constructor(isDirected?: boolean);
  isDirected(): boolean;
  getVertex(key: string): Vertex<T> | null;
  addVertex(vertex: Vertex<T>): void;
  getVertices(): Vertex<T>[];
  getEdges(): Edge<T>[];
  getWeight(): number;
  getVerticesIndexMap(): Record<string, number>;
  reverse(): void;
  addEdge(edge: Edge<T>): void;
  findEdge(edge: Edge<T>): Edge<T> | null;
  findEdge(vA: Vertex<T>, vB: Vertex<T>): Edge<T> | null;
  deleteEdge(edge: Edge<T>): void;
  getAdjacencyMatrix(unweighted?: boolean): number[][];
  breadthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: SearchCallbacks<T>
  ): void;
  depthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: SearchCallbacks<T>
  ): void;
}
```