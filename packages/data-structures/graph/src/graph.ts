import { LinkedList } from "@utilityjs/linked-list";
import { Edge } from "./edge.ts";
import type { SearchCallbacks } from "./types.ts";
import { initSearchCallbacks } from "./utils.ts";
import type { Vertex } from "./vertex.ts";

/**
 * A graph data structure implementation supporting both directed and undirected graphs.
 *
 * @template T The type of data stored in vertices
 */
export class Graph<T> {
  private _isDirected: boolean;

  private _vertices: Record<string, Vertex<T>>;
  private _edges: Record<string, Edge<T>>;

  /**
   * Creates a new Graph instance.
   *
   * @param isDirected Whether the graph is directed (default: false)
   */
  constructor(isDirected = false) {
    this._isDirected = isDirected;

    this._edges = {};
    this._vertices = {};
  }

  /**
   * Checks if the graph is directed.
   *
   * @returns True if the graph is directed, false otherwise
   */
  public isDirected(): boolean {
    return this._isDirected;
  }

  /**
   * Gets a vertex by its key.
   *
   * @param key The vertex key
   * @returns The vertex if found, null otherwise
   */
  public getVertex(key: string): Vertex<T> | null {
    return this._vertices[key] || null;
  }

  /**
   * Adds a vertex to the graph.
   *
   * @param vertex The vertex to add
   */
  public addVertex(vertex: Vertex<T>): void {
    this._vertices[vertex.getKey()] = vertex;
  }

  /**
   * Gets all vertices in the graph.
   *
   * @returns Array of all vertices
   */
  public getVertices(): Vertex<T>[] {
    return Object.keys(this._vertices).map(key => this._vertices[key]!);
  }

  /**
   * Gets all edges in the graph.
   *
   * @returns Array of all edges
   */
  public getEdges(): Edge<T>[] {
    return Object.keys(this._edges).map(key => this._edges[key]!);
  }

  /**
   * Calculates the total weight of all edges in the graph.
   *
   * @returns The sum of all edge weights
   */
  public getWeight(): number {
    return this.getEdges().reduce<number>(
      (weight, edge) => weight + edge.getWeight(),
      0,
    );
  }

  /**
   * Creates a mapping of vertex keys to their indices.
   *
   * @returns Object mapping vertex keys to indices
   */
  public getVerticesIndexMap(): Record<string, number> {
    return this.getVertices().reduce<Record<string, number>>(
      (indices, vertex, index) => ({ ...indices, [vertex.getKey()]: index }),
      {},
    );
  }

  /**
   * Reverses all edges in a directed graph. No effect on undirected graphs.
   */
  public reverse(): void {
    if (!this._isDirected) return;

    Object.keys(this._edges).forEach(key => {
      const edge = this._edges[key]!;

      this.deleteEdge(edge);
      edge.reverse();
      this.addEdge(edge);
    });
  }

  /**
   * Adds an edge to the graph. Creates vertices if they don't exist.
   *
   * @param edge The edge to add
   */
  public addEdge(edge: Edge<T>): void {
    if (this._edges[edge.getKey()]) return;

    const _edgeVA = edge.getVA();
    const _edgeVB = edge.getVB();

    const vA = (() => {
      const _vA = this.getVertex(_edgeVA.getKey());

      if (!_vA) {
        this.addVertex(_edgeVA);
        return _edgeVA;
      }

      return _vA;
    })();

    const vB = (() => {
      const _vB = this.getVertex(_edgeVB.getKey());

      if (!_vB) {
        this.addVertex(_edgeVB);
        return _edgeVB;
      }

      return _vB;
    })();

    this._edges[edge.getKey()] = edge;

    vA.addEdge(edge);
    if (!edge.isSelfLoop() && !this._isDirected) vB.addEdge(edge);
  }

  /**
   * Finds an edge in the graph.
   *
   * @param edge The edge to find
   * @returns The edge if found, null otherwise
   */
  public findEdge(edge: Edge<T>): Edge<T> | null;
  /**
   * Finds an edge between two vertices.
   *
   * @param vA The first vertex
   * @param vB The second vertex
   * @returns The edge if found, null otherwise
   */
  public findEdge(vA: Vertex<T>, vB: Vertex<T>): Edge<T> | null;
  public findEdge(
    vAOrEdge: Vertex<T> | Edge<T>,
    vB?: Vertex<T>,
  ): Edge<T> | null {
    let _vA: Vertex<T>;
    let _vB: Vertex<T>;

    if (vAOrEdge instanceof Edge) {
      _vA = vAOrEdge.getVA();
      _vB = vAOrEdge.getVB();
    } else if (typeof vB !== "undefined") {
      _vA = vAOrEdge;
      _vB = vB;
    } else throw new Error("The second argument must be a valid graph vertex.");

    const startVertex = this.getVertex(_vA.getKey());

    if (!startVertex) return null;

    return startVertex.getNeighborEdge(_vB);
  }

  /**
   * Removes an edge from the graph.
   *
   * @param edge The edge to remove
   */
  public deleteEdge(edge: Edge<T>): void {
    const _edge = this._edges[edge.getKey()];

    if (_edge) delete this._edges[edge.getKey()];
    else return;

    const startVertex = this.getVertex(edge.getVA().getKey());
    const endVertex = this.getVertex(edge.getVB().getKey());

    startVertex?.deleteEdge(_edge);
    endVertex?.deleteEdge(_edge);
  }

  /**
   * Generates the adjacency matrix representation of the graph.
   *
   * @param unweighted If true, uses 1/0 for connections, otherwise uses edge weights
   * @returns 2D array representing the adjacency matrix
   */
  public getAdjacencyMatrix(unweighted = false): number[][] {
    const vertices = this.getVertices();
    const verticesIndexMap = this.getVerticesIndexMap();

    const matrix = Array<number[]>(vertices.length)
      .fill([])
      .map(() =>
        Array<number>(vertices.length).fill(unweighted ? 0 : Infinity),
      );

    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach(neighbor => {
        const neighborIndex = verticesIndexMap[neighbor.getKey()];
        const isSelfLoop = vertexIndex === neighborIndex;

        if (unweighted) {
          matrix[vertexIndex]![neighborIndex!]! += isSelfLoop ? 2 : 1;
        } else {
          const edge = this.findEdge(vertex, neighbor)!;

          matrix[vertexIndex]![neighborIndex!] = edge.getWeight();
        }
      });
    });

    return matrix;
  }

  /**
   * Performs breadth-first search starting from a given vertex.
   *
   * @param startVertex The vertex to start the search from
   * @param callbacks Optional callbacks for search events
   */
  public breadthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: Partial<SearchCallbacks<T>>,
  ): void {
    const cbs = initSearchCallbacks(callbacks ?? {});
    const queue = new LinkedList<Vertex<T>>();

    queue.append(startVertex);

    let previous: Vertex<T> | null = null;

    while (!queue.isEmpty()) {
      const current = queue.getHead()!.getValue();

      queue.deleteHead();

      cbs.onEnter(previous, current);

      current.getNeighbors().forEach(next => {
        if (cbs.shouldTraverse(previous, current, next)) queue.append(next);
      });

      cbs.onLeave(previous, current);

      previous = current;
    }
  }

  /**
   * Performs depth-first search starting from a given vertex.
   *
   * @param startVertex The vertex to start the search from
   * @param callbacks Optional callbacks for search events
   */
  public depthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: Partial<SearchCallbacks<T>>,
  ): void {
    const cbs = initSearchCallbacks(callbacks ?? {});

    const recursion = (current: Vertex<T>, previous: Vertex<T> | null) => {
      cbs.onEnter(previous, current);

      current.getNeighbors().forEach(next => {
        if (cbs.shouldTraverse(previous, current, next))
          recursion(next, current);
      });

      cbs.onLeave(previous, current);
    };

    recursion(startVertex, null);
  }
}
