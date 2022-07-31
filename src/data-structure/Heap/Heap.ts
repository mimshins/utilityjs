import Comparator, { CompareFunction } from "@utilityjs/comparator";

export default abstract class Heap<T> {
  protected comparator: Comparator<T>;

  private container: Array<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.comparator = new Comparator(compareFunction);
    this.container = [];
  }

  getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  hasParent(childIndex: number): boolean {
    return this.getParentIndex(childIndex) >= 0;
  }

  hasLeftChild(parentIndex: number): boolean {
    return this.getLeftChildIndex(parentIndex) < this.container.length;
  }

  hasRightChild(parentIndex: number): boolean {
    return this.getRightChildIndex(parentIndex) < this.container.length;
  }

  getLeftChild(parentIndex: number): T | null {
    return this.container[this.getLeftChildIndex(parentIndex)] ?? null;
  }

  getRightChild(parentIndex: number): T | null {
    return this.container[this.getRightChildIndex(parentIndex)] ?? null;
  }

  getParent(childIndex: number): T | null {
    return this.container[this.getParentIndex(childIndex)] ?? null;
  }

  isEmpty(): boolean {
    return this.container.length === 0;
  }

  toString(): string {
    return this.container.toString();
  }

  peek(): T | null {
    return this.isEmpty() ? null : this.container[0];
  }

  poll(): T | null {
    if (this.isEmpty()) return null;
    if (this.container.length === 1) return <T>this.container.pop();

    const item = this.container[0];

    this.container[0] = <T>this.container.pop();
    this.heapifyDown();

    return item;
  }

  add(item: T): void {
    this.container.push(item);
    this.heapifyUp();
  }

  remove(item: T, comparator = this.comparator): void {
    const indicesToRemove = this.find(item, comparator);

    indicesToRemove.forEach(() => {
      const idxToRemove = <number>this.find(item, comparator).pop();

      if (idxToRemove === this.container.length - 1) {
        this.container.pop();
      } else {
        this.container[idxToRemove] = <T>this.container.pop();

        const parent = this.getParent(idxToRemove);

        if (
          this.hasLeftChild(idxToRemove) &&
          (!parent ||
            this.pairIsInCorrectOrder(parent, this.container[idxToRemove]))
        ) {
          this.heapifyDown(idxToRemove);
        } else this.heapifyUp(idxToRemove);
      }
    });
  }

  find(item: T, comparator = this.comparator): number[] {
    if (item == undefined) return [];

    return this.container.reduce((indices, currentItem, idx) => {
      if (comparator.isEqual(item, currentItem)) return indices.concat(idx);
      return indices;
    }, [] as number[]);
  }

  swap(index1: number, index2: number): void {
    const temp = this.container[index1];
    this.container[index1] = this.container[index2];
    this.container[index2] = temp;
  }

  heapifyDown(startIndex = 0): void {
    let idx = startIndex;
    let nextIdx = -1;

    while (this.hasLeftChild(idx)) {
      if (
        this.hasRightChild(idx) &&
        this.pairIsInCorrectOrder(
          this.getRightChild(idx),
          this.getLeftChild(idx)
        )
      ) {
        nextIdx = this.getRightChildIndex(idx);
      } else nextIdx = this.getLeftChildIndex(idx);

      if (
        this.pairIsInCorrectOrder(this.container[idx], this.container[nextIdx])
      ) {
        break;
      }

      this.swap(idx, nextIdx);
      idx = nextIdx;
    }
  }

  heapifyUp(startIndex = this.container.length - 1): void {
    let idx = startIndex;

    if (this.container[idx] == null) return;

    while (
      this.hasParent(idx) &&
      !this.pairIsInCorrectOrder(this.getParent(idx), this.container[idx])
    ) {
      this.swap(idx, this.getParentIndex(idx));
      idx = this.getParentIndex(idx);
    }
  }

  abstract pairIsInCorrectOrder(
    firstItem: T | null,
    secondItem: T | null
  ): boolean;
}
