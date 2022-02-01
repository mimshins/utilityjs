import LinkedList from "@utilityjs/linked-list";

interface SearchCallbacks<T> {
  onEnter: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  onLeave: (previous: Vertex<T> | null, current: Vertex<T>) => void;
  shouldTraverse: (
    previous: Vertex<T> | null,
    current: Vertex<T>,
    next: Vertex<T>
  ) => boolean;
}

export class Vertex<T> {
  private _value: T;

  private _key: string | null;

  private _edges: LinkedList<Edge<T>>;

  constructor(value: T, key: string | null = null) {
    if (typeof value === "undefined")
      throw new Error("The graph vertex must have a valid value.");

    this._key = key;
    this._value = value;

    this._edges = new LinkedList<Edge<T>>((eA: Edge<T>, eB: Edge<T>) => {
      if (eA.getKey() === eB.getKey()) return 0;
      return eA.getKey() < eB.getKey() ? -1 : 1;
    });
  }

  public getValue(): T {
    return this._value;
  }

  public setValue(value: T): void {
    this._value = value;
  }

  public addEdge(edge: Edge<T>): void {
    this._edges.append(edge);
  }

  public deleteEdge(edge: Edge<T>): void {
    this._edges.delete(edge);
  }

  public getKey(): string {
    return this._key || String(this._value);
  }

  public getEdges(): Edge<T>[] {
    return this._edges.toArray();
  }

  public getDegree(): number {
    return this._edges.getLength() + (this.hasSelfLoop() ? 1 : 0);
  }

  public getNeighborEdge(vertex: Vertex<T>): Edge<T> | null {
    let result: Edge<T> | null = null;

    this._edges.traverse(node => {
      const edge = node.getValue();

      const thisIsVA = edge.getVA().getKey() === this.getKey();
      const thisIsVB = edge.getVB().getKey() === this.getKey();

      if (
        (thisIsVA && edge.getVB().getKey() === vertex.getKey()) ||
        (thisIsVB && edge.getVA().getKey() === vertex.getKey()) ||
        (thisIsVB && thisIsVA && this.getKey() === vertex.getKey())
      ) {
        result = edge;
        return true;
      }

      return false;
    });

    return result;
  }

  public hasEdge(edge: Edge<T>): boolean {
    let flag = false;

    this._edges.traverse(node => {
      const _edge = node.getValue();

      if (_edge.getKey() === edge.getKey()) {
        flag = true;
        return true;
      }

      return false;
    });

    return flag;
  }

  public getSelfLoop(): Edge<T> | null {
    let selfEdge = null;

    this._edges.traverse(node => {
      const edge = node.getValue();

      if (edge.isSelfLoop()) {
        selfEdge = edge;
        return true;
      }

      return false;
    });

    return selfEdge;
  }

  public hasSelfLoop(): boolean {
    return !!this.getSelfLoop();
  }

  public hasNeighbor(vertex: Vertex<T>): boolean {
    let flag = false;

    this._edges.traverse(node => {
      const edge = node.getValue();

      const thisIsVA = edge.getVA().getKey() === this.getKey();
      const thisIsVB = edge.getVB().getKey() === this.getKey();

      if (
        (thisIsVA && edge.getVB().getKey() === vertex.getKey()) ||
        (thisIsVB && edge.getVA().getKey() === vertex.getKey()) ||
        (thisIsVB && thisIsVA && this.getKey() === vertex.getKey())
      ) {
        flag = true;
        return true;
      }

      return false;
    });

    return flag;
  }

  public getNeighbors(): Vertex<T>[] {
    const neighbors: Vertex<T>[] = [];

    this._edges.traverse(node => {
      const edge = node.getValue();
      neighbors.push(edge.getVA() === this ? edge.getVB() : edge.getVA());
    });

    return neighbors;
  }

  public clearEdges(): void {
    let i = 0;
    const length = this._edges.getLength();

    while (i < length) {
      this._edges.deleteHead();
      i++;
    }
  }
}

export class Edge<T> {
  private _vA: Vertex<T>;
  private _vB: Vertex<T>;

  private _key: string | null;

  private _weight: number;

  constructor(
    vA: Vertex<T>,
    vB: Vertex<T>,
    weight = 0,
    key: string | null = null
  ) {
    if (typeof vA === "undefined")
      throw new Error("The graph edge must have a valid start vertex.");

    if (typeof vB === "undefined")
      throw new Error("The graph edge must have a valid end vertex.");

    this._vA = vA;
    this._vB = vB;

    this._key = key;

    this._weight = weight;
  }

  public setVA(vA: Vertex<T>): void {
    this._vA = vA;
  }

  public setVB(vB: Vertex<T>): void {
    this._vB = vB;
  }

  public getVA(): Vertex<T> {
    return this._vA;
  }

  public getVB(): Vertex<T> {
    return this._vB;
  }

  public isSelfLoop(): boolean {
    return this._vA.getKey() === this._vB.getKey();
  }

  public setWeight(weight: number): void {
    this._weight = weight;
  }

  public getWeight(): number {
    return this._weight;
  }

  public getKey(): string {
    return this._key || `${this._vA.getKey()}:${this._vB.getKey()}`;
  }

  public reverse(): void {
    const vA = this._vA;

    this._vA = this._vB;
    this._vB = vA;
  }
}

const initSearchCallbacks = <T>(
  callbacks: Partial<SearchCallbacks<T>>
): SearchCallbacks<T> => {
  return {
    onEnter: callbacks.onEnter || (() => void 0),
    onLeave: callbacks.onLeave || (() => void 0),
    shouldTraverse:
      callbacks.shouldTraverse ||
      (() => {
        const seen: Record<string, boolean> = {};

        return (_: Vertex<T> | null, __: Vertex<T>, next: Vertex<T>) => {
          if (seen[next.getKey()]) return false;

          seen[next.getKey()] = true;
          return true;
        };
      })()
  };
};

export default class Graph<T> {
  private _isDirected: boolean;

  private _vertices: Record<string, Vertex<T>>;
  private _edges: Record<string, Edge<T>>;

  constructor(isDirected = false) {
    this._isDirected = isDirected;

    this._edges = {};
    this._vertices = {};
  }

  public isDirected(): boolean {
    return this._isDirected;
  }

  public getVertex(key: string): Vertex<T> | null {
    return this._vertices[key] || null;
  }

  public addVertex(vertex: Vertex<T>): void {
    this._vertices[vertex.getKey()] = vertex;
  }

  public getVertices(): Vertex<T>[] {
    return Object.keys(this._vertices).map(key => this._vertices[key]);
  }

  public getEdges(): Edge<T>[] {
    return Object.keys(this._edges).map(key => this._edges[key]);
  }

  public getWeight(): number {
    return this.getEdges().reduce<number>(
      (weight, edge) => weight + edge.getWeight(),
      0
    );
  }

  public getVerticesIndexMap(): Record<string, number> {
    return this.getVertices().reduce<Record<string, number>>(
      (indices, vertex, index) => ({ ...indices, [vertex.getKey()]: index }),
      {}
    );
  }

  public reverse(): void {
    if (!this._isDirected) return;

    Object.keys(this._edges).forEach(key => {
      const edge = this._edges[key];

      this.deleteEdge(edge);
      edge.reverse();
      this.addEdge(edge);
    });
  }

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

  public findEdge(edge: Edge<T>): Edge<T> | null;
  public findEdge(vA: Vertex<T>, vB: Vertex<T>): Edge<T> | null;
  public findEdge(
    vAOrEdge: Vertex<T> | Edge<T>,
    vB?: Vertex<T>
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

  public deleteEdge(edge: Edge<T>): void {
    const _edge = this._edges[edge.getKey()];

    if (_edge) delete this._edges[edge.getKey()];
    else return;

    const startVertex = this.getVertex(edge.getVA().getKey());
    const endVertex = this.getVertex(edge.getVB().getKey());

    startVertex?.deleteEdge(_edge);
    endVertex?.deleteEdge(_edge);
  }

  public getAdjacencyMatrix(unweighted = false): number[][] {
    const vertices = this.getVertices();
    const verticesIndexMap = this.getVerticesIndexMap();

    const matrix = Array<number[]>(vertices.length)
      .fill([])
      .map(() =>
        Array<number>(vertices.length).fill(unweighted ? 0 : Infinity)
      );

    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach(neighbor => {
        const neighborIndex = verticesIndexMap[neighbor.getKey()];

        const isSelfLoop = vertexIndex === neighborIndex;

        if (unweighted)
          matrix[vertexIndex][neighborIndex] += isSelfLoop ? 2 : 1;
        else {
          const edge = this.findEdge(vertex, neighbor) as Edge<T>;
          matrix[vertexIndex][neighborIndex] = edge.getWeight();
        }
      });
    });

    return matrix;
  }

  public breadthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: SearchCallbacks<T>
  ): void {
    const cbs = initSearchCallbacks(callbacks || {});
    const queue = new LinkedList<Vertex<T>>();

    queue.append(startVertex);

    let previous: Vertex<T> | null = null;

    while (!queue.isEmpty()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  public depthFirstSearch(
    startVertex: Vertex<T>,
    callbacks?: SearchCallbacks<T>
  ): void {
    const cbs = initSearchCallbacks(callbacks || {});

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
