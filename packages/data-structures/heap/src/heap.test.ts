import type { Comparator } from "@utilityjs/comparator";
import { beforeEach, describe, expect, it } from "vitest";
import { Heap } from "./heap.ts";

class MinHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(firstItem: T | null, secondItem: T | null): boolean {
    if (firstItem === null || secondItem === null) return false;
    return this._comparator.isLessThanOrEqual(firstItem, secondItem);
  }
}

class MaxHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(firstItem: T | null, secondItem: T | null): boolean {
    if (firstItem === null || secondItem === null) return false;
    return this._comparator.isGreaterThanOrEqual(firstItem, secondItem);
  }
}

describe("Heap", () => {
  describe("MinHeap", () => {
    let minHeap: MinHeap<number>;

    beforeEach(() => {
      minHeap = new MinHeap<number>();
    });

    describe("constructor", () => {
      it("should create an empty heap", () => {
        expect(minHeap.isEmpty()).toBe(true);
        expect(minHeap.peek()).toBeNull();
      });

      it("should use custom compare function when provided", () => {
        const customHeap = new MinHeap<string>((a, b) => {
          if (a.length === b.length) return 0;
          return a.length < b.length ? -1 : 1;
        });

        customHeap.add("hello");
        customHeap.add("hi");
        expect(customHeap.peek()).toBe("hi");
      });
    });

    describe("add", () => {
      it("should add element and maintain min heap property", () => {
        [5, 3, 8, 1, 9, 2].forEach(n => minHeap.add(n));
        expect(minHeap.peek()).toBe(1);
      });
    });

    describe("poll", () => {
      it("should return null for empty heap", () => {
        expect(minHeap.poll()).toBeNull();
      });

      it("should remove and return single element", () => {
        minHeap.add(5);
        expect(minHeap.poll()).toBe(5);
        expect(minHeap.isEmpty()).toBe(true);
      });

      it("should return elements in ascending order", () => {
        [5, 3, 8, 1].forEach(n => minHeap.add(n));
        expect(minHeap.poll()).toBe(1);
        expect(minHeap.poll()).toBe(3);
      });
    });

    describe("remove", () => {
      it("should remove all occurrences of element", () => {
        [5, 3, 8, 3].forEach(n => minHeap.add(n));
        minHeap.remove(3);
        expect(minHeap.find(3)).toHaveLength(0);
      });

      it("should remove last element without heapify", () => {
        [1, 2, 3, 4, 5].forEach(n => minHeap.add(n));
        minHeap.remove(5);
        expect(minHeap.find(5)).toHaveLength(0);
      });

      it("should heapify down after removing element with children", () => {
        [1, 2, 3, 4, 5, 6, 7].forEach(n => minHeap.add(n));
        minHeap.remove(2);
        expect(minHeap.find(2)).toHaveLength(0);
      });

      it("should heapify up after removing leaf node", () => {
        [1, 2, 3, 4, 5].forEach(n => minHeap.add(n));
        minHeap.remove(4);
        expect(minHeap.find(4)).toHaveLength(0);
      });

      it("should handle non-existent element", () => {
        [1, 2, 3].forEach(n => minHeap.add(n));
        minHeap.remove(99);
        expect(minHeap.peek()).toBe(1);
      });

      it("should handle early return when item no longer found", () => {
        [5, 5].forEach(n => minHeap.add(n));
        let callCount = 0;
        const changingComparator = {
          isEqual: () => {
            callCount++;
            return callCount <= 2;
          },
        };

        minHeap.remove(5, changingComparator as unknown as Comparator<number>);
        expect(minHeap.peek()).toBe(5);
      });
    });

    describe("find", () => {
      it("should return empty array for non-existent item", () => {
        minHeap.add(5);
        expect(minHeap.find(10)).toEqual([]);
      });

      it("should find all indices of item", () => {
        [5, 3, 8, 3].forEach(n => minHeap.add(n));
        expect(minHeap.find(3).length).toBeGreaterThan(0);
      });

      it("should return empty array for null or undefined item", () => {
        expect(minHeap.find(null as unknown as number)).toEqual([]);
        expect(minHeap.find(undefined as unknown as number)).toEqual([]);
      });
    });

    describe("tree navigation", () => {
      beforeEach(() => {
        [1, 2, 3, 4, 5, 6, 7].forEach(n => minHeap.add(n));
      });

      it("should calculate correct child and parent indices", () => {
        expect(minHeap.getLeftChildIndex(0)).toBe(1);
        expect(minHeap.getRightChildIndex(0)).toBe(2);
        expect(minHeap.getParentIndex(3)).toBe(1);
      });

      it("should check parent and children existence", () => {
        expect(minHeap.hasParent(0)).toBe(false);
        expect(minHeap.hasParent(1)).toBe(true);
        expect(minHeap.hasLeftChild(0)).toBe(true);
        expect(minHeap.hasRightChild(0)).toBe(true);
        expect(minHeap.hasLeftChild(3)).toBe(false);
      });

      it("should get child and parent elements", () => {
        expect(minHeap.getLeftChild(0)).toBe(2);
        expect(minHeap.getRightChild(0)).toBe(3);
        expect(minHeap.getParent(1)).toBe(1);
      });

      it("should return null for non-existent children", () => {
        expect(minHeap.getLeftChild(10)).toBeNull();
        expect(minHeap.getRightChild(10)).toBeNull();
      });
    });

    describe("heapifyDown", () => {
      it("should prefer right child when it has higher priority", () => {
        [1, 5, 2, 7, 6, 4, 3].forEach(n => minHeap.add(n));
        minHeap.poll();
        expect(minHeap.peek()).toBe(2);
      });

      it("should break when current element is in correct order", () => {
        [1, 2, 3].forEach(n => minHeap.add(n));
        minHeap.heapifyDown(0);
        expect(minHeap.peek()).toBe(1);
      });
    });

    describe("heapifyUp", () => {
      it("should handle invalid index gracefully", () => {
        minHeap.add(5);
        minHeap.heapifyUp(10);
        expect(minHeap.peek()).toBe(5);
      });
    });

    describe("swap", () => {
      it("should swap elements at given indices", () => {
        [1, 2, 3].forEach(n => minHeap.add(n));
        minHeap.swap(0, 1);
        expect(minHeap.peek()).toBe(2);
      });
    });

    describe("toString", () => {
      it("should return string representation of heap", () => {
        [3, 1, 2].forEach(n => minHeap.add(n));
        expect(minHeap.toString()).toBe("1,3,2");
      });
    });
  });

  describe("MaxHeap", () => {
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
      maxHeap = new MaxHeap<number>();
    });

    it("should maintain max heap property", () => {
      [5, 3, 8, 1, 9, 2].forEach(n => maxHeap.add(n));
      expect(maxHeap.peek()).toBe(9);
    });

    it("should poll elements in descending order", () => {
      [5, 3, 8, 1, 9].forEach(n => maxHeap.add(n));
      expect(maxHeap.poll()).toBe(9);
      expect(maxHeap.poll()).toBe(8);
    });
  });
});
