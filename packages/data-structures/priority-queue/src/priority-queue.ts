import { Comparator, type CompareFunction } from "@utilityjs/comparator";
import { MinHeap } from "@utilityjs/min-heap";

/**
 * Priority Queue implementation using a min-heap data structure.
 * Elements with lower priority values are dequeued first.
 * @template T The type of elements stored in the priority queue.
 */
export class PriorityQueue<T> extends MinHeap<T> {
  /** Map storing priority values for each element */
  private _priorities: Map<T, number>;

  /** Comparator for comparing element values */
  private _valueComparator: Comparator<T>;

  /**
   * Creates a new priority queue instance.
   * @param compareFunction Optional comparison function for element values.
   */
  constructor(compareFunction?: CompareFunction<T>) {
    super((a: T, b: T) => {
      const pA = this._priorities.get(a)!;
      const pB = this._priorities.get(b)!;

      if (pA === pB) {
        return compareFunction?.(a, b) ?? 0;
      }

      return pA < pB ? -1 : 1;
    });

    this._priorities = new Map();
    this._valueComparator = new Comparator(compareFunction);
  }

  /**
   * Adds an element to the priority queue with the specified priority.
   * @param item The element to add.
   * @param priority The priority value (default: 0). Lower values have higher priority.
   */
  public override add(item: T, priority = 0): void {
    this._priorities.set(item, priority);

    super.add(item);
  }

  /**
   * Removes all occurrences of an element from the priority queue.
   * @param item The element to remove.
   * @param comparator Optional comparator for element comparison.
   */
  public override remove(item: T, comparator?: Comparator<T>): void {
    const indices = this.find(item, comparator ?? this._valueComparator);

    if (indices.length > 0) {
      super.remove(item, comparator ?? this._valueComparator);
      this._priorities.delete(item);
    }
  }

  /**
   * Changes the priority of an existing element in the queue.
   * @param item The element whose priority to change.
   * @param priority The new priority value.
   */
  public changePriority(item: T, priority: number): void {
    if (this.hasValue(item)) {
      this.remove(item);
      this.add(item, priority);
    }
  }

  /**
   * Finds all indices of an element in the priority queue by value.
   * @param item The element to find.
   * @returns Array of indices where the element is found.
   */
  public findByValue(item: T): number[] {
    return this.find(item, this._valueComparator);
  }

  /**
   * Checks if an element exists in the priority queue.
   * @param item The element to check for.
   * @returns True if the element exists, false otherwise.
   */
  public hasValue(item: T): boolean {
    return this.findByValue(item).length > 0;
  }
}
