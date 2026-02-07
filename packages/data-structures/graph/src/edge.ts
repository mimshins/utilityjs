import type { Vertex } from "./vertex.ts";

/**
 * Represents an edge (connection) between two vertices in a graph.
 *
 * @template T The type of data stored in the connected vertices
 */
export class Edge<T> {
  private _vA: Vertex<T>;
  private _vB: Vertex<T>;

  private _key: string | null;

  private _weight: number;

  /**
   * Creates a new Edge instance.
   *
   * @param vA The first vertex (start vertex in directed graphs)
   * @param vB The second vertex (end vertex in directed graphs)
   * @param weight The weight of the edge (default: 0)
   * @param key Optional unique key for the edge (defaults to "vA:vB")
   * @throws Error if vA or vB is undefined
   */
  constructor(
    vA: Vertex<T>,
    vB: Vertex<T>,
    weight = 0,
    key: string | null = null,
  ) {
    if (typeof vA === "undefined")
      throw new Error(
        "[@utilityjs/graph]: The graph edge must have a valid start vertex.",
      );

    if (typeof vB === "undefined")
      throw new Error(
        "[@utilityjs/graph]: The graph edge must have a valid end vertex.",
      );

    this._vA = vA;
    this._vB = vB;

    this._key = key;

    this._weight = weight;
  }

  /**
   * Sets the first vertex of the edge.
   *
   * @param vA The new first vertex
   */
  public setVA(vA: Vertex<T>): void {
    this._vA = vA;
  }

  /**
   * Sets the second vertex of the edge.
   *
   * @param vB The new second vertex
   */
  public setVB(vB: Vertex<T>): void {
    this._vB = vB;
  }

  /**
   * Gets the first vertex of the edge.
   *
   * @returns The first vertex
   */
  public getVA(): Vertex<T> {
    return this._vA;
  }

  /**
   * Gets the second vertex of the edge.
   *
   * @returns The second vertex
   */
  public getVB(): Vertex<T> {
    return this._vB;
  }

  /**
   * Checks if this edge is a self-loop (connects a vertex to itself).
   *
   * @returns True if it's a self-loop, false otherwise
   */
  public isSelfLoop(): boolean {
    return this._vA.getKey() === this._vB.getKey();
  }

  /**
   * Sets the weight of the edge.
   *
   * @param weight The new weight
   */
  public setWeight(weight: number): void {
    this._weight = weight;
  }

  /**
   * Gets the weight of the edge.
   *
   * @returns The edge weight
   */
  public getWeight(): number {
    return this._weight;
  }

  /**
   * Gets the unique key for this edge.
   *
   * @returns The edge key (custom key or "vA:vB")
   */
  public getKey(): string {
    return this._key || `${this._vA.getKey()}:${this._vB.getKey()}`;
  }

  /**
   * Reverses the direction of the edge by swapping vA and vB.
   */
  public reverse(): void {
    const vA = this._vA;

    this._vA = this._vB;
    this._vB = vA;
  }
}
