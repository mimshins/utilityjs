import { Heap } from "@utilityjs/heap";

/**
 * MinHeap data structure implementation.
 * A binary heap where the parent node is always smaller than or equal to its children.
 *
 * @template T The type of elements stored in the heap.
 */
export class MinHeap<T> extends Heap<T> {
  /**
   * Determines if two elements are in correct min-heap order.
   * In a min-heap, the first item should be less than or equal to the second item.
   *
   * @param firstItem The first element to compare (parent).
   * @param secondItem The second element to compare (child).
   * @returns True if the first item is less than or equal to the second item, false otherwise.
   */
  public pairIsInCorrectOrder(
    firstItem: T | null,
    secondItem: T | null,
  ): boolean {
    if (firstItem == null || secondItem == null) return false;

    return this._comparator.isLessThanOrEqual(firstItem, secondItem);
  }
}
