import { LinkedList } from "@utilityjs/linked-list";
import type { Edge } from "./edge.ts";

/**
 * Represents a vertex (node) in a graph.
 *
 * @template T The type of data stored in the vertex
 */
export class Vertex<T> {
  private _value: T;

  private _key: string | null;

  private _edges: LinkedList<Edge<T>>;

  /**
   * Creates a new Vertex instance.
   *
   * @param value The value to store in the vertex
   * @param key Optional unique key for the vertex (defaults to string representation of value)
   * @throws Error if value is undefined
   */
  constructor(value: T, key: string | null = null) {
    if (typeof value === "undefined") {
      throw new Error("The graph vertex must have a valid value.");
    }

    this._key = key;
    this._value = value;

    this._edges = new LinkedList<Edge<T>>(
      /* v8 ignore next 3 */
      (eA: Edge<T>, eB: Edge<T>) => {
        if (eA.getKey() === eB.getKey()) return 0;
        return eA.getKey() < eB.getKey() ? -1 : 1;
      },
    );
  }

  /**
   * Gets the value stored in the vertex.
   *
   * @returns The vertex value
   */
  public getValue(): T {
    return this._value;
  }

  /**
   * Sets the value stored in the vertex.
   *
   * @param value The new value
   */
  public setValue(value: T): void {
    this._value = value;
  }

  /**
   * Adds an edge to this vertex.
   *
   * @param edge The edge to add
   */
  public addEdge(edge: Edge<T>): void {
    this._edges.append(edge);
  }

  /**
   * Removes an edge from this vertex.
   *
   * @param edge The edge to remove
   */
  public deleteEdge(edge: Edge<T>): void {
    this._edges.delete(edge);
  }

  /**
   * Gets the unique key for this vertex.
   *
   * @returns The vertex key (custom key or string representation of value)
   */
  public getKey(): string {
    return this._key || String(this._value);
  }

  /**
   * Gets all edges connected to this vertex.
   *
   * @returns Array of edges
   */
  public getEdges(): Edge<T>[] {
    return this._edges.toArray();
  }

  /**
   * Gets the degree of this vertex (number of connections).
   * Self-loops count as 2 degrees.
   *
   * @returns The vertex degree
   */
  public getDegree(): number {
    return this._edges.getLength() + (this.hasSelfLoop() ? 1 : 0);
  }

  /**
   * Finds the edge connecting this vertex to another vertex.
   *
   * @param vertex The target vertex
   * @returns The connecting edge if found, null otherwise
   */
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

  /**
   * Checks if this vertex has a specific edge.
   *
   * @param edge The edge to check for
   * @returns True if the edge exists, false otherwise
   */
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

  /**
   * Gets the self-loop edge if it exists.
   *
   * @returns The self-loop edge if found, null otherwise
   */
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

  /**
   * Checks if this vertex has a self-loop.
   *
   * @returns True if a self-loop exists, false otherwise
   */
  public hasSelfLoop(): boolean {
    return !!this.getSelfLoop();
  }

  /**
   * Checks if this vertex is connected to another vertex.
   *
   * @param vertex The vertex to check connection with
   * @returns True if connected, false otherwise
   */
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

  /**
   * Gets all neighboring vertices (vertices connected by edges).
   *
   * @returns Array of neighboring vertices
   */
  public getNeighbors(): Vertex<T>[] {
    const neighbors: Vertex<T>[] = [];

    this._edges.traverse(node => {
      const edge = node.getValue();

      neighbors.push(edge.getVA() === this ? edge.getVB() : edge.getVA());
    });

    return neighbors;
  }

  /**
   * Removes all edges from this vertex.
   */
  public clearEdges(): void {
    let i = 0;
    const length = this._edges.getLength();

    while (i < length) {
      this._edges.deleteHead();
      i++;
    }
  }
}
