import { Comparator, type CompareFunction } from "@utilityjs/comparator";
import { Node as LinkedListNode } from "./node.ts";

/**
 * A singly linked list data structure.
 * @template T - The type of values stored in the list
 */
export class LinkedList<T> {
  private _comparator: Comparator<T>;

  private _head: LinkedListNode<T> | null;
  private _tail: LinkedListNode<T> | null;

  private _length = 0;

  /**
   * Creates a new LinkedList instance.
   * @param compareFunction - Optional custom comparison function for comparing values
   */
  constructor(compareFunction?: CompareFunction<T>) {
    this._head = null;
    this._tail = null;

    this._comparator = new Comparator(compareFunction);
  }

  /**
   * Gets the head (first) node of the list.
   * @returns The head node or null if the list is empty
   */
  public getHead(): LinkedListNode<T> | null {
    return this._head;
  }

  /**
   * Gets the tail (last) node of the list.
   * @returns The tail node or null if the list is empty
   */
  public getTail(): LinkedListNode<T> | null {
    return this._tail;
  }

  /**
   * Checks if the list is empty.
   * @returns true if the list has no elements
   */
  public isEmpty(): boolean {
    return !this._head;
  }

  /**
   * Gets the number of elements in the list.
   * @returns The length of the list
   */
  public getLength(): number {
    return this._length;
  }

  /**
   * Appends a value to the end of the list.
   * @param value - The value to append
   */
  public append(value: T): void {
    const node = new LinkedListNode(value);

    if (this.isEmpty()) {
      this._head = node;
      this._tail = node;
    } else {
      this._tail!.setNext(node);
      this._tail = node;
    }

    this._length++;
  }

  /**
   * Prepends a value to the beginning of the list.
   * @param value - The value to prepend
   */
  public prepend(value: T): void {
    const node = new LinkedListNode(value, this._head);

    if (this.isEmpty()) this._tail = node;

    this._head = node;
    this._length++;
  }

  /**
   * Traverses the list and executes a callback for each node.
   * @param callback - Function to execute for each node. Return true to stop traversal.
   */
  public traverse(
    callback: (node: LinkedListNode<T>, index: number) => void | boolean,
  ): void {
    if (!this._head) return;

    let node: LinkedListNode<T> | null = this._head;
    let index = 0;

    while (node) {
      if (callback(node, index)) return;
      node = node.getNext();
      index++;
    }
  }

  /**
   * Deletes the head (first) node from the list.
   */
  public deleteHead(): void {
    if (!this._head) return;

    const _head = this._head;

    if (_head.hasNext()) this._head = _head.getNext();
    else {
      this._head = null;
      this._tail = null;
    }

    this._length--;
  }

  /**
   * Deletes the tail (last) node from the list.
   */
  public deleteTail(): void {
    if (!this._tail) return;

    if (this._head === this._tail) {
      this._head = null;
      this._tail = null;
      this._length--;
      return;
    }

    let newTail = this._head;

    this.traverse(node => {
      newTail = node;

      if (node.hasNext() && !node.getNext()!.hasNext()) {
        node.setNext(null);
        return true;
      }

      return false;
    });

    this._tail = newTail;
    this._length--;
  }

  /**
   * Deletes the first occurrence of a value from the list.
   * @param value - The value to delete
   */
  public delete(value: T): void {
    if (!this._head) return;

    if (this._comparator.isEqual(this._head.getValue(), value)) {
      return this.deleteHead();
    }

    let lastNode: LinkedListNode<T> | null = null;
    let shouldDownsize = false;

    this.traverse(node => {
      lastNode = node;

      // If next node must be deleted then make next node to be next of the next one.
      if (
        node.hasNext() &&
        this._comparator.isEqual(node.getNext()!.getValue(), value)
      ) {
        node.setNext(node.getNext()!.getNext());
        shouldDownsize = true;
        return true;
      }

      return false;
    });

    if (this._tail && this._comparator.isEqual(this._tail.getValue(), value)) {
      this._tail = lastNode;
    }

    if (shouldDownsize) this._length--;
  }

  /**
   * Reverses the order of nodes in the list.
   */
  public reverse(): void {
    let current = this._head;
    let prevNode: typeof this._head = null;
    let nextNode: typeof this._head = null;

    while (current) {
      nextNode = current.getNext();
      current.setNext(prevNode);
      prevNode = current;
      current = nextNode;
    }

    this._tail = this._head;
    this._head = prevNode;
  }

  /**
   * Populates the list from an array of values.
   * @param array - The array of values to add to the list
   */
  public fromArray(array: T[]): void {
    array.forEach(item => this.append(item));
  }

  /**
   * Converts the list to an array of values.
   * @returns An array containing all values in the list
   */
  public toArray(): T[] {
    const array: T[] = [];

    this.traverse(node => {
      array.push(node.getValue());
    });

    return array;
  }
}
