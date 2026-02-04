import { LinkedList } from "@utilityjs/linked-list";

/**
 * A generic Queue data structure implementation using a linked list.
 * Follows FIFO (First In, First Out) principle.
 *
 * @template T - The type of elements stored in the queue
 */
export class Queue<T> {
  private _list: LinkedList<T>;

  /**
   * Creates a new empty queue.
   */
  constructor() {
    this._list = new LinkedList<T>();
  }

  /**
   * Checks if the queue is empty.
   *
   * @returns True if the queue is empty, false otherwise
   */
  public isEmpty(): boolean {
    return this._list.isEmpty();
  }

  /**
   * Adds an element to the rear of the queue.
   *
   * @param value - The value to add to the queue
   */
  public enqueue(value: T): void {
    this._list.append(value);
  }

  /**
   * Removes and returns the element at the front of the queue.
   *
   * @returns The element at the front of the queue, or null if the queue is empty
   */
  public dequeue(): T | null {
    const dequeued = this.peek();

    this._list.deleteHead();

    return dequeued;
  }

  /**
   * Returns the element at the front of the queue without removing it.
   *
   * @returns The element at the front of the queue, or null if the queue is empty
   */
  public peek(): T | null {
    const _head = this._list.getHead();

    if (!_head) return null;

    return _head.getValue();
  }
}
