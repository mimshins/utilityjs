import { LinkedList } from "@utilityjs/linked-list";

/**
 * A Last-In-First-Out (LIFO) stack data structure.
 *
 * @template T The type of values stored in the stack
 */
export class Stack<T> {
  private _list: LinkedList<T>;

  /**
   * Creates a new Stack instance.
   */
  constructor() {
    this._list = new LinkedList<T>();
  }

  /**
   * Checks if the stack is empty.
   *
   * @returns true if the stack has no elements
   */
  public isEmpty(): boolean {
    return this._list.isEmpty();
  }

  /**
   * Pushes a value onto the top of the stack.
   *
   * @param value The value to push
   */
  public push(value: T): void {
    this._list.prepend(value);
  }

  /**
   * Removes and returns the value from the top of the stack.
   *
   * @returns The top value or null if the stack is empty
   */
  public pop(): T | null {
    const poppedValue = this.peek();

    this._list.deleteHead();

    return poppedValue;
  }

  /**
   * Returns the value at the top of the stack without removing it.
   *
   * @returns The top value or null if the stack is empty
   */
  public peek(): T | null {
    const _head = this._list.getHead();

    if (!_head) return null;

    return _head.getValue();
  }

  /**
   * Converts the stack to an array with the top element first.
   *
   * @returns An array representation of the stack
   */
  public toArray(): T[] {
    return this._list.toArray();
  }
}
