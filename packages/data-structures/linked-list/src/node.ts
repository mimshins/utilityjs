/**
 * A node in a linked list containing a value and reference to the next node.
 * @template T - The type of value stored in the node
 */
export class Node<T> {
  private _value: T;
  private _next: Node<T> | null;

  /**
   * Creates a new Node instance.
   * @param value - The value to store in the node
   * @param next - Optional reference to the next node
   */
  constructor(value: T, next: Node<T> | null = null) {
    this._value = value;
    this._next = next;
  }

  /**
   * Gets the value stored in the node.
   * @returns The node's value
   */
  public getValue(): T {
    return this._value;
  }

  /**
   * Sets the value stored in the node.
   * @param value - The new value
   */
  public setValue(value: T): void {
    this._value = value;
  }

  /**
   * Gets the reference to the next node.
   * @returns The next node or null if this is the last node
   */
  public getNext(): Node<T> | null {
    return this._next;
  }

  /**
   * Sets the reference to the next node.
   * @param next - The next node or null
   */
  public setNext(next: Node<T> | null): void {
    this._next = next;
  }

  /**
   * Checks if this node has a next node.
   * @returns true if there is a next node
   */
  public hasNext(): boolean {
    return !!this._next;
  }
}
