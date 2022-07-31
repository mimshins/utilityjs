import Comparator, { CompareFunction } from "@utilityjs/comparator";
import MinHeap from "@utilityjs/min-heap";

export default class PriorityQueue<T> extends MinHeap<T> {
  private priorities: Map<T, number>;

  private valueComparator: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    // eslint-disable-next-line
    super();

    this.priorities = new Map();
    this.valueComparator = new Comparator(compareFunction);

    this.comparator = new Comparator((a: T, b: T) => {
      const pA = this.priorities.get(a);
      const pB = this.priorities.get(b);

      if (typeof pA !== "number" || typeof pB !== "number")
        throw new ReferenceError();

      if (pA === pB) return 0;
      return pA < pB ? -1 : 1;
    });
  }

  override add(item: T, priority = 0): void {
    this.priorities.set(item, priority);
    // eslint-disable-next-line
    super.add(item);
  }

  override remove(item: T, comparator?: Comparator<T>): void {
    // eslint-disable-next-line
    super.remove(item, comparator ?? this.valueComparator);
    this.priorities.delete(item);
  }

  changePriority(item: T, priority: number): void {
    this.remove(item);
    this.add(item, priority);
  }

  findByValue(item: T): number[] {
    // eslint-disable-next-line
    return this.find(item, this.valueComparator);
  }

  hasValue(item: T): boolean {
    return this.findByValue(item).length > 0;
  }
}
