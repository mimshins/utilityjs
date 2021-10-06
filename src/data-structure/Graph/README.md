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
export declare class Vertext<T> {
  constructor(value: T, key?: string | null);
  getValue(): T;
  setValue(value: T): void;
  addEdge(edge: Edge<T>): void;
  deleteEdge(edge: Edge<T>): void;
  getKey(): string;
  getEdges(): Edge<T>[];
  getDegree(): number;
  getNeighborEdge(vertext: Vertext<T>): Edge<T> | null;
  hasEdge(edge: Edge<T>): boolean;
  hasNeighbor(vertext: Vertext<T>): boolean;
  getNeighbors(): Vertext<T>[];
  clearEdges(): void;
}
export declare class Edge<T> {
  constructor(
    vA: Vertext<T>,
    vB: Vertext<T>,
    weight?: number,
    key?: string | null
  );
  setVA(vA: Vertext<T>): void;
  setVB(vB: Vertext<T>): void;
  getVA(): Vertext<T>;
  getVB(): Vertext<T>;
  setWeight(weight: number): void;
  getWeight(): number;
  getKey(): string;
  reverse(): void;
}
export default class Graph<T> {
  constructor(isDirected?: boolean);
  isDirected(): boolean;
  getVertext(key: string): Vertext<T> | null;
  addVertext(vertext: Vertext<T>): void;
  getVertices(): Vertext<T>[];
  getEdges(): Edge<T>[];
  getWeight(): number;
  getVerticesIndexMap(): Record<string, number>;
  reverse(): void;
  addEdge(edge: Edge<T>): void;
  findEdge(edge: Edge<T>): Edge<T> | null;
  findEdge(vA: Vertext<T>, vB: Vertext<T>): Edge<T> | null;
  deleteEdge(edge: Edge<T>): void;
  getAdjacencyMatrix(): number[][];
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