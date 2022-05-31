import Heap from "@utilityjs/heap";

export default class MinHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(firstItem: T | null, secondItem: T | null): boolean {
    if (firstItem == null || secondItem == null) return false;

    return this.comparator.isLessThanOrEqual(firstItem, secondItem);
  }
}
