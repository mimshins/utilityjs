import Comparator, { CompareFunction } from "@utilityjs/comparator";

export class Node<T> {
  private value: T;
  private next: Node<T> | null;

  constructor(value: T, next: Node<T> | null = null) {
    this.value = value;
    this.next = next;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  getNext(): Node<T> | null {
    return this.next;
  }

  setNext(next: Node<T> | null): void {
    this.next = next;
  }

  hasNext(): boolean {
    return !!this.next;
  }
}

export default class LinkedList<T> {
  private comparator: Comparator<T>;

  private head: Node<T> | null;
  private tail: Node<T> | null;

  private length = 0;

  constructor(compareFunction?: CompareFunction<T>) {
    this.head = null;
    this.tail = null;
    this.comparator = new Comparator(compareFunction);
  }

  getHead(): Node<T> | null {
    return this.head;
  }

  getTail(): Node<T> | null {
    return this.tail;
  }

  isEmpty(): boolean {
    return !this.head;
  }

  getLength(): number {
    return this.length;
  }

  append(value: T): void {
    const node = new Node(value);

    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.tail!.setNext(node);
      this.tail = node;
    }

    this.length++;
  }

  prepend(value: T): void {
    const node = new Node(value);

    if (this.isEmpty()) this.tail = node;

    this.head = node;
    this.length++;
  }

  traverse(callback: (node: Node<T>, index: number) => void | boolean): void {
    if (!this.head) return;

    let node: Node<T> | null = this.head;
    let index = 0;

    while (node) {
      if (callback(node, index)) return;
      node = node.getNext();
      index++;
    }
  }

  deleteHead(): void {
    if (!this.head) return;

    const _head = this.head;

    if (_head.hasNext()) this.head = _head.getNext();
    else {
      this.head = null;
      this.tail = null;
    }

    this.length--;
  }

  deleteTail(): void {
    if (!this.tail) return;

    let newTail = this.head as typeof this.tail;
    this.traverse(node => {
      newTail = node;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (node.hasNext() && !node.getNext()!.hasNext()) {
        node.setNext(null);
        return true;
      }
    });

    this.tail = newTail;
    this.length--;
  }

  delete(value: T): void {
    if (!this.head) return;

    if (this.comparator.isEqual(this.head.getValue(), value)) {
      return this.deleteHead();
    }

    let lastNode: Node<T> | null = null;
    let shouldDownsize = false;

    this.traverse(node => {
      lastNode = node;

      // If next node must be deleted then make next node to be next of the next one.
      if (
        node.hasNext() &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.comparator.isEqual(node.getNext()!.getValue(), value)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        node.setNext(node.getNext()!.getNext());
        shouldDownsize = true;
        return true;
      }
    });

    if (this.tail && this.comparator.isEqual(this.tail.getValue(), value)) {
      this.tail = lastNode;
    }

    if (shouldDownsize) this.length--;
  }

  reverse(): void {
    let prevNode: typeof this.head = null;
    let nextNode: typeof this.head = null;

    this.traverse(node => {
      nextNode = node.getNext();
      node.setNext(prevNode);
      prevNode = nextNode;
    });

    this.tail = this.head;
    this.head = prevNode;
  }

  fromArray(array: T[]): void {
    array.forEach(item => this.append(item));
    this.length = array.length;
  }

  toArray(): T[] {
    const array: T[] = [];

    this.traverse(node => {
      array.push(node.getValue());
    });

    return array;
  }
}
