import { Comparator, type CompareFunction } from "@utilityjs/comparator";

/**
 * Abstract heap data structure implementation.
 *
 * @template T The type of elements stored in the heap.
 */
export abstract class Heap<T> {
  protected _comparator: Comparator<T>;

  private _container: Array<T>;

  /**
   * Creates a new heap instance.
   *
   * @param compareFunction Optional comparison function for heap elements.
   */
  constructor(compareFunction?: CompareFunction<T>) {
    this._comparator = new Comparator(compareFunction);
    this._container = [];
  }

  /**
   * Gets the index of the left child for a given parent index.
   *
   * @param parentIndex The parent node index.
   * @returns The left child index.
   */
  public getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  /**
   * Gets the index of the right child for a given parent index.
   *
   * @param parentIndex The parent node index.
   * @returns The right child index.
   */
  public getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  /**
   * Gets the index of the parent for a given child index.
   *
   * @param childIndex The child node index.
   * @returns The parent index.
   */
  public getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  /**
   * Checks if a node has a parent.
   *
   * @param childIndex The child node index.
   * @returns True if the node has a parent, false otherwise.
   */
  public hasParent(childIndex: number): boolean {
    return this.getParentIndex(childIndex) >= 0;
  }

  /**
   * Checks if a node has a left child.
   *
   * @param parentIndex The parent node index.
   * @returns True if the node has a left child, false otherwise.
   */
  public hasLeftChild(parentIndex: number): boolean {
    return this.getLeftChildIndex(parentIndex) < this._container.length;
  }

  /**
   * Checks if a node has a right child.
   *
   * @param parentIndex The parent node index.
   * @returns True if the node has a right child, false otherwise.
   */
  public hasRightChild(parentIndex: number): boolean {
    return this.getRightChildIndex(parentIndex) < this._container.length;
  }

  /**
   * Gets the left child element of a parent node.
   *
   * @param parentIndex The parent node index.
   * @returns The left child element or null if it doesn't exist.
   */
  public getLeftChild(parentIndex: number): T | null {
    return this._container[this.getLeftChildIndex(parentIndex)] ?? null;
  }

  /**
   * Gets the right child element of a parent node.
   *
   * @param parentIndex The parent node index.
   * @returns The right child element or null if it doesn't exist.
   */
  public getRightChild(parentIndex: number): T | null {
    return this._container[this.getRightChildIndex(parentIndex)] ?? null;
  }

  /**
   * Gets the parent element of a child node.
   *
   * @param childIndex The child node index.
   * @returns The parent element or null if it doesn't exist.
   */
  public getParent(childIndex: number): T | null {
    return this._container[this.getParentIndex(childIndex)] ?? null;
  }

  /**
   * Checks if the heap is empty.
   *
   * @returns True if the heap is empty, false otherwise.
   */
  public isEmpty(): boolean {
    return this._container.length === 0;
  }

  /**
   * Returns a string representation of the heap.
   *
   * @returns String representation of the heap elements.
   */
  public toString(): string {
    return this._container.toString();
  }

  /**
   * Returns the root element without removing it.
   *
   * @returns The root element or null if the heap is empty.
   */
  public peek(): T | null {
    return this.isEmpty() ? null : this._container[0]!;
  }

  /**
   * Removes and returns the root element.
   *
   * @returns The root element or null if the heap is empty.
   */
  public poll(): T | null {
    if (this.isEmpty()) return null;
    if (this._container.length === 1) return this._container.pop() as T;

    const item = this._container[0]!;

    this._container[0] = this._container.pop() as T;
    this.heapifyDown();

    return item;
  }

  /**
   * Adds an element to the heap.
   *
   * @param item The element to add.
   */
  public add(item: T): void {
    this._container.push(item);
    this.heapifyUp();
  }

  /**
   * Removes all occurrences of an element from the heap.
   *
   * @param item The element to remove.
   * @param comparator Optional comparator for element comparison.
   */
  public remove(item: T, comparator = this._comparator): void {
    const indicesToRemove = this.find(item, comparator);

    indicesToRemove.forEach(() => {
      const indices = this.find(item, comparator);

      if (indices.length === 0) return;

      const idxToRemove = indices[0]!;

      if (idxToRemove === this._container.length - 1) {
        this._container.pop();
      } else {
        this._container[idxToRemove] = this._container.pop() as T;

        const parent = this.getParent(idxToRemove);

        if (
          this.hasLeftChild(idxToRemove) &&
          (!parent ||
            this.pairIsInCorrectOrder(parent, this._container[idxToRemove]))
        ) {
          this.heapifyDown(idxToRemove);
        } else {
          this.heapifyUp(idxToRemove);
        }
      }
    });
  }

  /**
   * Finds all indices of an element in the heap.
   *
   * @param item The element to find.
   * @param comparator Optional comparator for element comparison.
   * @returns Array of indices where the element is found.
   */
  public find(item: T, comparator = this._comparator): number[] {
    if (item == null) return [];

    return this._container.reduce((indices, currentItem, idx) => {
      if (comparator.isEqual(item, currentItem)) return indices.concat(idx);
      return indices;
    }, [] as number[]);
  }

  /**
   * Swaps two elements in the heap by their indices.
   *
   * @param index1 First element index.
   * @param index2 Second element index.
   */
  public swap(index1: number, index2: number): void {
    const temp = this._container[index1]!;

    this._container[index1] = this._container[index2]!;
    this._container[index2] = temp;
  }

  /**
   * Maintains heap property by moving an element down the tree.
   *
   * @param startIndex Starting index for heapify operation.
   */
  public heapifyDown(startIndex = 0): void {
    let idx = startIndex;
    let nextIdx = -1;

    while (this.hasLeftChild(idx)) {
      if (
        this.hasRightChild(idx) &&
        this.pairIsInCorrectOrder(
          this.getRightChild(idx),
          this.getLeftChild(idx),
        )
      ) {
        nextIdx = this.getRightChildIndex(idx);
      } else nextIdx = this.getLeftChildIndex(idx);

      if (
        this.pairIsInCorrectOrder(
          this._container[idx]!,
          this._container[nextIdx]!,
        )
      ) {
        break;
      }

      this.swap(idx, nextIdx);
      idx = nextIdx;
    }
  }

  /**
   * Maintains heap property by moving an element up the tree.
   *
   * @param startIndex Starting index for heapify operation.
   */
  public heapifyUp(startIndex = this._container.length - 1): void {
    let idx = startIndex;

    if (this._container[idx] == null) return;

    while (
      this.hasParent(idx) &&
      !this.pairIsInCorrectOrder(this.getParent(idx), this._container[idx]!)
    ) {
      this.swap(idx, this.getParentIndex(idx));
      idx = this.getParentIndex(idx);
    }
  }

  /**
   * Abstract method to determine if two elements are in correct heap order.
   *
   * @param firstItem First element to compare.
   * @param secondItem Second element to compare.
   * @returns True if elements are in correct order, false otherwise.
   */
  public abstract pairIsInCorrectOrder(
    firstItem: T | null,
    secondItem: T | null,
  ): boolean;
}
