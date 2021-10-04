import LinkedList from "@utilityjs/linked-list";

export default class Queue<T> {
  private list: LinkedList<T>;

  constructor() {
    this.list = new LinkedList<T>();
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }

  enqueue(value: T): void {
    this.list.append(value);
  }

  dequeue(): T | null {
    const dequeued = this.peek();

    this.list.deleteHead();

    return dequeued;
  }

  peek(): T | null {
    const _head = this.list.getHead();

    if (!_head) return null;

    return _head.getValue();
  }
}
