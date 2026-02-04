import { Heap } from "@utilityjs/heap";

/**
 * Max heap data structure implementation where the largest element is at the root.
 *
 * @template T The type of elements stored in the heap.
 * @extends Heap<T>
 */
export class MaxHeap<T> extends Heap<T> {
  /**
   * Determines if two elements are in correct max heap order.
   * In a max heap, the first element should be greater than or equal to the second.
   *
   * @param firstItem The first element to compare (parent).
   * @param secondItem The second element to compare (child).
   * @returns True if the first element is greater than or equal to the second, false otherwise.
   */
  public pairIsInCorrectOrder(
    firstItem: T | null,
    secondItem: T | null,
  ): boolean {
    if (firstItem == null || secondItem == null) return false;

    return this._comparator.isGreaterThanOrEqual(firstItem, secondItem);
  }
}
