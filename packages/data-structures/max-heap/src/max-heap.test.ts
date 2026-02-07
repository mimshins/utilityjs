import { beforeEach, describe, expect, it } from "vitest";
import { MaxHeap } from "./max-heap.ts";

describe("MaxHeap", () => {
  let heap: MaxHeap<number>;

  beforeEach(() => {
    heap = new MaxHeap<number>();
  });

  describe("constructor", () => {
    it("should create an empty max heap", () => {
      expect(heap.isEmpty()).toBe(true);
      expect(heap.peek()).toBeNull();
    });

    it("should use custom comparator when provided", () => {
      const customHeap = new MaxHeap<string>(
        (a, b) => (a.length - b.length) as -1 | 0 | 1,
      );

      customHeap.add("a");
      customHeap.add("abc");
      customHeap.add("ab");

      expect(customHeap.peek()).toBe("abc");
    });
  });

  describe("pairIsInCorrectOrder", () => {
    it("should return false when either item is null", () => {
      expect(heap.pairIsInCorrectOrder(null, 5)).toBe(false);
      expect(heap.pairIsInCorrectOrder(5, null)).toBe(false);
      expect(heap.pairIsInCorrectOrder(null, null)).toBe(false);
    });

    it("should return true when first >= second", () => {
      expect(heap.pairIsInCorrectOrder(10, 5)).toBe(true);
      expect(heap.pairIsInCorrectOrder(5, 5)).toBe(true);
    });

    it("should return false when first < second", () => {
      expect(heap.pairIsInCorrectOrder(5, 10)).toBe(false);
    });
  });

  describe("add", () => {
    it("should maintain max heap property", () => {
      [5, 10, 3, 15, 8].forEach(n => heap.add(n));
      expect(heap.peek()).toBe(15);
    });

    it("should handle duplicate values", () => {
      [10, 10, 5].forEach(n => heap.add(n));
      expect(heap.peek()).toBe(10);
    });
  });

  describe("poll", () => {
    it("should return null for empty heap", () => {
      expect(heap.poll()).toBeNull();
    });

    it("should return elements in descending order", () => {
      [5, 10, 3, 15, 8].forEach(n => heap.add(n));
      expect(heap.poll()).toBe(15);
      expect(heap.poll()).toBe(10);
      expect(heap.poll()).toBe(8);
      expect(heap.poll()).toBe(5);
      expect(heap.poll()).toBe(3);
    });
  });

  describe("remove", () => {
    it("should remove element and maintain heap property", () => {
      [10, 5, 15, 3, 8].forEach(n => heap.add(n));
      heap.remove(10);
      expect(heap.find(10)).toEqual([]);
      expect(heap.peek()).toBe(15);
    });

    it("should remove all occurrences of duplicate elements", () => {
      [10, 5, 15, 5].forEach(n => heap.add(n));
      heap.remove(5);
      expect(heap.find(5)).toEqual([]);
    });

    it("should handle removing non-existent element", () => {
      [10, 5, 15].forEach(n => heap.add(n));
      heap.remove(100);
      expect(heap.peek()).toBe(15);
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

  describe("tree navigation", () => {
    beforeEach(() => {
      [15, 10, 8, 5, 3].forEach(n => heap.add(n));
    });

    it("should check parent and children existence", () => {
      expect(heap.hasParent(0)).toBe(false);
      expect(heap.hasParent(1)).toBe(true);
      expect(heap.hasLeftChild(0)).toBe(true);
      expect(heap.hasRightChild(0)).toBe(true);
      expect(heap.hasLeftChild(3)).toBe(false);
    });

    it("should get parent and child elements", () => {
      expect(heap.getParent(1)).toBe(15);
      expect(heap.getLeftChild(0)).toBe(10);
      expect(heap.getRightChild(0)).toBe(8);
    });

    it("should return null for non-existent elements", () => {
      expect(heap.getParent(0)).toBeNull();
      expect(heap.getLeftChild(10)).toBeNull();
      expect(heap.getRightChild(10)).toBeNull();
    });
  });

  describe("utility methods", () => {
    it("should return string representation", () => {
      [10, 5].forEach(n => heap.add(n));
      expect(heap.toString()).toContain("10");
    });

    it("should swap elements", () => {
      [10, 5].forEach(n => heap.add(n));
      heap.swap(0, 1);
      expect(heap.peek()).toBe(5);
    });

    it("should handle heapifyUp with invalid index", () => {
      expect(() => heap.heapifyUp(0)).not.toThrow();
    });
  });

  describe("complex scenarios", () => {
    it("should handle large dataset", () => {
      const values = Array.from({ length: 100 }, () => Math.random() * 1000);

      values.forEach(val => heap.add(val));
      expect(heap.peek()).toBe(Math.max(...values));
    });
  });
});
