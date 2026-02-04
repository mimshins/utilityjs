<div align="center">

# UtilityJS | Graph

An implementation of Graph data structure.

</div>

<hr />

## Features

- **Directed and Undirected Graphs**: Support for both graph types
- **Weighted Edges**: Edges can have weights for algorithms like shortest path
- **Self-loops**: Support for vertices connected to themselves
- **Graph Traversal**: Built-in BFS and DFS algorithms with customizable
  callbacks
- **Adjacency Matrix**: Generate matrix representation for analysis
- **TypeScript Support**: Full type safety with generic support

## Installation

```bash
npm install @utilityjs/graph
```

or

```bash
pnpm add @utilityjs/graph
```

## Usage

### Creating Graphs

```typescript
import { Graph, Vertex, Edge } from "@utilityjs/graph";

// Create an undirected graph
const undirectedGraph = new Graph<string>();

// Create a directed graph
const directedGraph = new Graph<string>(true);
```

### Working with Vertices

```typescript
// Create vertices
const vertexA = new Vertex("A");
const vertexB = new Vertex("B", "custom-key");

// Add vertices to graph
undirectedGraph.addVertex(vertexA);
undirectedGraph.addVertex(vertexB);

// Get vertex by key
const vertex = undirectedGraph.getVertex("A");
```

### Working with Edges

```typescript
// Create edges
const edge1 = new Edge(vertexA, vertexB); // Unweighted edge
const edge2 = new Edge(vertexA, vertexB, 5); // Weighted edge

// Add edges to graph
undirectedGraph.addEdge(edge1);

// Find edges
const foundEdge = undirectedGraph.findEdge(vertexA, vertexB);
```

### Directed Graph Example

```typescript
const directedGraph = new Graph<number>(true);

const v1 = new Vertex(1);
const v2 = new Vertex(2);
const v3 = new Vertex(3);

const edge1 = new Edge(v1, v2, 10);
const edge2 = new Edge(v2, v3, 20);

directedGraph.addEdge(edge1);
directedGraph.addEdge(edge2);

// Reverse all edges in directed graph
directedGraph.reverse();
```

### Undirected Graph Example

```typescript
const undirectedGraph = new Graph<string>();

const nodeA = new Vertex("A");
const nodeB = new Vertex("B");
const nodeC = new Vertex("C");

const edgeAB = new Edge(nodeA, nodeB, 5);
const edgeBC = new Edge(nodeB, nodeC, 3);
const edgeAC = new Edge(nodeA, nodeC, 8);

undirectedGraph.addEdge(edgeAB);
undirectedGraph.addEdge(edgeBC);
undirectedGraph.addEdge(edgeAC);
```

### Graph Traversal

#### Breadth-First Search (BFS)

```typescript
const visitedVertices: string[] = [];

undirectedGraph.breadthFirstSearch(nodeA, {
  onEnter: (previous, current) => {
    visitedVertices.push(current.getValue());
  },
});
```

#### Depth-First Search (DFS)

```typescript
const path: string[] = [];

undirectedGraph.depthFirstSearch(nodeA, {
  onEnter: (previous, current) => {
    path.push(current.getValue());
  },
  onLeave: (previous, current) => {
    console.log(`Leaving vertex: ${current.getValue()}`);
  },
  shouldTraverse: (previous, current, next) => {
    // Custom traversal logic
    return !visitedVertices.includes(next.getKey());
  },
});
```

### Adjacency Matrix

```typescript
// Get unweighted adjacency matrix (0/1 values)
const unweightedMatrix = graph.getAdjacencyMatrix(true);

// Get weighted adjacency matrix
const weightedMatrix = graph.getAdjacencyMatrix();
```

## API

### `Graph<T>`

#### Constructor

- `new Graph<T>(isDirected?: boolean)` - Creates a new graph

#### Methods

- `isDirected(): boolean` - Check if graph is directed
- `addVertex(vertex: Vertex<T>): void` - Add a vertex
- `getVertex(key: string): Vertex<T> | null` - Get vertex by key
- `getVertices(): Vertex<T>[]` - Get all vertices
- `addEdge(edge: Edge<T>): void` - Add an edge
- `findEdge(vA: Vertex<T>, vB: Vertex<T>): Edge<T> | null` - Find edge between
  vertices
- `deleteEdge(edge: Edge<T>): void` - Remove an edge
- `getEdges(): Edge<T>[]` - Get all edges
- `getWeight(): number` - Get total weight of all edges
- `reverse(): void` - Reverse all edges (directed graphs only)
- `getAdjacencyMatrix(unweighted?: boolean): number[][]` - Get adjacency matrix
- `breadthFirstSearch(startVertex: Vertex<T>, callbacks?: SearchCallbacks<T>): void` -
  BFS traversal
- `depthFirstSearch(startVertex: Vertex<T>, callbacks?: SearchCallbacks<T>): void` -
  DFS traversal

### `Vertex<T>`

#### Constructor

- `new Vertex<T>(value: T, key?: string)` - Creates a new vertex

#### Methods

- `getValue(): T` - Get vertex value
- `setValue(value: T): void` - Set vertex value
- `getKey(): string` - Get vertex key
- `addEdge(edge: Edge<T>): void` - Add an edge
- `deleteEdge(edge: Edge<T>): void` - Remove an edge
- `getEdges(): Edge<T>[]` - Get all edges
- `getDegree(): number` - Get vertex degree
- `getNeighbors(): Vertex<T>[]` - Get neighboring vertices
- `hasNeighbor(vertex: Vertex<T>): boolean` - Check if vertex is a neighbor
- `hasSelfLoop(): boolean` - Check if vertex has self-loop
- `clearEdges(): void` - Remove all edges

### `Edge<T>`

#### Constructor

- `new Edge<T>(vA: Vertex<T>, vB: Vertex<T>, weight?: number, key?: string)` -
  Creates a new edge

#### Methods

- `getVA(): Vertex<T>` - Get first vertex
- `getVB(): Vertex<T>` - Get second vertex
- `setVA(vA: Vertex<T>): void` - Set first vertex
- `setVB(vB: Vertex<T>): void` - Set second vertex
- `getWeight(): number` - Get edge weight
- `setWeight(weight: number): void` - Set edge weight
- `getKey(): string` - Get edge key
- `isSelfLoop(): boolean` - Check if edge is self-loop
- `reverse(): void` - Reverse edge direction

### `SearchCallbacks<T>`

```typescript
type SearchCallbacks<T> = {
  onEnter: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  onLeave: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  shouldTraverse: (
    previous: Vertex<T> | null,
    current: Vertex<T>,
    next: Vertex<T>,
  ) => boolean;
};
```

## Contributing

Read the
[contributing guide](https://github.com/mimshins/utilityjs/blob/main/CONTRIBUTING.md)
to learn about our development process, how to propose bug fixes and
improvements, and how to build and test your changes.

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mimshins/utilityjs/blob/main/LICENSE).
