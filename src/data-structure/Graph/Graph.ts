import LinkedList from "@utilityjs/linked-list";

export class Vertext<T> {
  private _value: T;

  private _key: string | null;

  private _edges: LinkedList<Edge<T>>;

  constructor(value: T, key: string | null = null) {
    if (typeof value === "undefined")
      throw new Error("The graph vertext must have a valid value.");

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
    return this._edges.getLength();
  }

  public getNeighborEdge(vertext: Vertext<T>): Edge<T> | null {
    let result: Edge<T> | null = null;

    this._edges.traverse(node => {
      const edge = node.getValue();

      const thisIsVA = edge.getVA().getKey() === this.getKey();
      const thisIsVB = edge.getVB().getKey() === this.getKey();

      if (
        (thisIsVA && edge.getVB().getKey() === vertext.getKey()) ||
        (thisIsVB && edge.getVA().getKey() === vertext.getKey()) ||
        (thisIsVB && thisIsVA && this.getKey() === vertext.getKey())
      ) {
        result = edge;
        return true;
      }
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
    });

    return flag;
  }

  public hasNeighbor(vertext: Vertext<T>): boolean {
    let flag = false;

    this._edges.traverse(node => {
      const edge = node.getValue();

      const thisIsVA = edge.getVA().getKey() === this.getKey();
      const thisIsVB = edge.getVB().getKey() === this.getKey();

      if (
        (thisIsVA && edge.getVB().getKey() === vertext.getKey()) ||
        (thisIsVB && edge.getVA().getKey() === vertext.getKey()) ||
        (thisIsVB && thisIsVA && this.getKey() === vertext.getKey())
      ) {
        flag = true;
        return true;
      }
    });

    return flag;
  }

  public getNeighbors(): Vertext<T>[] {
    const neighbors: Vertext<T>[] = [];

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
  private _vA: Vertext<T>;
  private _vB: Vertext<T>;

  private _key: string | null;

  private _weight: number;

  constructor(
    vA: Vertext<T>,
    vB: Vertext<T>,
    weight = 0,
    key: string | null = null
  ) {
    if (typeof vA === "undefined")
      throw new Error("The graph edge must have a valid start vertext.");

    if (typeof vB === "undefined")
      throw new Error("The graph edge must have a valid end vertext.");

    this._vA = vA;
    this._vB = vB;

    this._key = key;

    this._weight = weight;
  }

  public setVA(vA: Vertext<T>): void {
    this._vA = vA;
  }

  public setVB(vB: Vertext<T>): void {
    this._vB = vB;
  }

  public getVA(): Vertext<T> {
    return this._vA;
  }

  public getVB(): Vertext<T> {
    return this._vB;
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

export default class Graph<T> {
  private _isDirected: boolean;

  private _vertices: Record<string, Vertext<T>>;
  private _edges: Record<string, Edge<T>>;

  constructor(isDirected = false) {
    this._isDirected = isDirected;

    this._edges = {};
    this._vertices = {};
  }

  public isDirected(): boolean {
    return this._isDirected;
  }

  public getVertext(key: string): Vertext<T> | null {
    return this._vertices[key] || null;
  }

  public addVertext(vertext: Vertext<T>): void {
    this._vertices[vertext.getKey()] = vertext;
  }

  public getVertices(): Vertext<T>[] {
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
      (indices, vertext, index) => ({ ...indices, [vertext.getKey()]: index }),
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
      const _vA = this.getVertext(_edgeVA.getKey());

      if (!_vA) {
        this.addVertext(_edgeVA);
        return _edgeVA;
      }

      return _vA;
    })();

    const vB = (() => {
      const _vB = this.getVertext(_edgeVB.getKey());

      if (!_vB) {
        this.addVertext(_edgeVB);
        return _edgeVB;
      }

      return _vB;
    })();

    this._edges[edge.getKey()] = edge;

    vA.addEdge(edge);
    if (!this._isDirected) vB.addEdge(edge);
  }

  public findEdge(edge: Edge<T>): Edge<T> | null;
  public findEdge(vA: Vertext<T>, vB: Vertext<T>): Edge<T> | null;
  public findEdge(
    vAOrEdge: Vertext<T> | Edge<T>,
    vB?: Vertext<T>
  ): Edge<T> | null {
    let _vA: Vertext<T>;
    let _vB: Vertext<T>;

    if (vAOrEdge instanceof Edge) {
      _vA = vAOrEdge.getVA();
      _vB = vAOrEdge.getVB();
    } else if (typeof vB !== "undefined") {
      _vA = vAOrEdge;
      _vB = vB;
    } else
      throw new Error("The second argument must be a valid graph vertext.");

    const startVertext = this.getVertext(_vA.getKey());

    if (!startVertext) return null;

    return startVertext.getNeighborEdge(_vB);
  }

  public deleteEdge(edge: Edge<T>): void {
    const _edge = this._edges[edge.getKey()];

    if (_edge) delete this._edges[edge.getKey()];
    else return;

    const startVertext = this.getVertext(edge.getVA().getKey());
    const endVertext = this.getVertext(edge.getVB().getKey());

    startVertext?.deleteEdge(_edge);
    endVertext?.deleteEdge(_edge);
  }

  public getAdjacencyMatrix(): number[][] {
    const vertices = this.getVertices();
    const verticesIndexMap = this.getVerticesIndexMap();

    const matrix = Array<number[]>(vertices.length)
      .fill([])
      .map(() => Array<number>(vertices.length).fill(Infinity));

    vertices.forEach((vertext, vertextIndex) => {
      vertext.getNeighbors().forEach(neighbor => {
        const neighborIndex = verticesIndexMap[neighbor.getKey()];
        const edge = this.findEdge(vertext, neighbor) as Edge<T>;

        matrix[vertextIndex][neighborIndex] = edge.getWeight();
      });
    });

    return matrix;
  }
}
