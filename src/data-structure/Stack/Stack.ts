import LinkedList from "@utilityjs/linked-list";

export default class Stack<T> {
  private list: LinkedList<T>;

  constructor() {
    this.list = new LinkedList<T>();
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }

  push(value: T): void {
    this.list.prepend(value);
  }

  pop(): T | null {
    const poppedValue = this.peek();

    this.list.deleteHead();

    return poppedValue;
  }

  peek(): T | null {
    const _head = this.list.getHead();

    if (!_head) return null;

    return _head.getValue();
  }

  toArray(): T[] {
    return this.list.toArray();
  }
}
