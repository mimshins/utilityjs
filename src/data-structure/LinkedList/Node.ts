export default class LinkedListNode<T> {
  private value: T;
  private next: LinkedListNode<T> | null;

  constructor(value: T, next: LinkedListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  getNext(): LinkedListNode<T> | null {
    return this.next;
  }

  setNext(next: LinkedListNode<T> | null): void {
    this.next = next;
  }

  hasNext(): boolean {
    return !!this.next;
  }

  toString(): string {
    return `LinkedListNode ${String(this.value)}`;
  }
}
