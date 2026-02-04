import { beforeEach, describe, expect, it } from "vitest";
import { MinHeap } from "./min-heap.ts";

describe("MinHeap", () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap<number>();
  });

  describe("constructor", () => {
    it("should create an empty min heap", () => {
      expect(heap.isEmpty()).toBe(true);
      expect(heap.peek()).toBeNull();
    });

    it("should use custom comparator when provided", () => {
      const customHeap = new MinHeap<number>((a, b) => (b - a) as -1 | 0 | 1);

      [1, 3, 2].forEach(n => customHeap.add(n));
      expect(customHeap.peek()).toBe(3);
    });
  });

  describe("pairIsInCorrectOrder", () => {
    it("should return false when either item is null", () => {
      expect(heap.pairIsInCorrectOrder(null, 5)).toBe(false);
      expect(heap.pairIsInCorrectOrder(5, null)).toBe(false);
      expect(heap.pairIsInCorrectOrder(null, null)).toBe(false);
    });

    it("should return true when first <= second", () => {
      expect(heap.pairIsInCorrectOrder(3, 5)).toBe(true);
      expect(heap.pairIsInCorrectOrder(5, 5)).toBe(true);
    });

    it("should return false when first > second", () => {
      expect(heap.pairIsInCorrectOrder(7, 3)).toBe(false);
    });
  });

  describe("add", () => {
    it("should maintain min heap property", () => {
      [10, 5, 15, 3, 8].forEach(n => heap.add(n));
      expect(heap.peek()).toBe(3);
    });

    it("should handle duplicate values", () => {
      [5, 5, 3].forEach(n => heap.add(n));
      expect(heap.peek()).toBe(3);
    });
  });

  describe("poll", () => {
    it("should return null for empty heap", () => {
      expect(heap.poll()).toBeNull();
    });

    it("should return elements in ascending order", () => {
      [10, 5, 15, 3, 8].forEach(n => heap.add(n));
      expect(heap.poll()).toBe(3);
      expect(heap.poll()).toBe(5);
      expect(heap.poll()).toBe(8);
      expect(heap.poll()).toBe(10);
      expect(heap.poll()).toBe(15);
    });
  });

  describe("remove", () => {
    it("should remove all occurrences and maintain heap property", () => {
      [10, 5, 15, 3, 8, 5].forEach(n => heap.add(n));
      heap.remove(5);
      expect(heap.find(5)).toEqual([]);
      expect(heap.peek()).toBe(3);
    });

    it("should handle removing non-existent element", () => {
      [10, 5, 15].forEach(n => heap.add(n));
      heap.remove(100);
      expect(heap.peek()).toBe(5);
    });
  });

  describe("find", () => {
    it("should find all indices of element", () => {
      [10, 5, 15, 5].forEach(n => heap.add(n));
      expect(heap.find(5).length).toBe(2);
    });

    it("should return empty array for non-existent or null element", () => {
      heap.add(10);
      expect(heap.find(100)).toEqual([]);
      expect(heap.find(null as unknown as number)).toEqual([]);
    });
  });

  describe("utility methods", () => {
    beforeEach(() => {
      [10, 5, 15].forEach(n => heap.add(n));
    });

    it("should return string representation", () => {
      expect(heap.toString()).toContain("5");
    });

    it("should check parent and children existence", () => {
      expect(heap.hasParent(1)).toBe(true);
      expect(heap.hasParent(0)).toBe(false);
      expect(heap.hasLeftChild(0)).toBe(true);
      expect(heap.hasRightChild(0)).toBe(true);
    });

    it("should get parent and child elements", () => {
      expect(heap.getParent(1)).toBe(5);
      expect(heap.getLeftChild(0)).toBe(10);
      expect(heap.getRightChild(0)).toBe(15);
    });
  });

  describe("complex scenarios", () => {
    it("should handle large dataset in sorted order", () => {
      const data = Array.from({ length: 100 }, () => Math.random() * 1000);

      data.forEach(n => heap.add(n));

      let prev = heap.poll()!;

      while (!heap.isEmpty()) {
        const curr = heap.poll()!;

        expect(curr >= prev).toBe(true);
        prev = curr;
      }
    });

    it("should work with object comparisons", () => {
      interface Item {
        value: number;
        name: string;
      }

      const objectHeap = new MinHeap<Item>(
        (a, b) => (a.value - b.value) as -1 | 0 | 1,
      );

      objectHeap.add({ value: 3, name: "three" });
      objectHeap.add({ value: 1, name: "one" });
      objectHeap.add({ value: 2, name: "two" });

      expect(objectHeap.poll()?.name).toBe("one");
      expect(objectHeap.poll()?.name).toBe("two");
      expect(objectHeap.poll()?.name).toBe("three");
    });
  });
});
