import { describe, expect, it } from "vitest";
import { Comparator } from "./comparator.ts";

describe("Comparator", () => {
  describe("default comparison", () => {
    it("should compare numbers correctly", () => {
      const comparator = new Comparator<number>();

      expect(comparator.isEqual(5, 5)).toBe(true);
      expect(comparator.isEqual(5, 3)).toBe(false);
      expect(comparator.isLessThan(3, 5)).toBe(true);
      expect(comparator.isGreaterThan(5, 3)).toBe(true);
    });

    it("should compare strings correctly", () => {
      const comparator = new Comparator<string>();

      expect(comparator.isEqual("a", "a")).toBe(true);
      expect(comparator.isLessThan("a", "b")).toBe(true);
      expect(comparator.isGreaterThan("b", "a")).toBe(true);
    });

    it("should handle isLessThanOrEqual", () => {
      const comparator = new Comparator<number>();

      expect(comparator.isLessThanOrEqual(3, 5)).toBe(true);
      expect(comparator.isLessThanOrEqual(5, 5)).toBe(true);
      expect(comparator.isLessThanOrEqual(5, 3)).toBe(false);
    });

    it("should handle isGreaterThanOrEqual", () => {
      const comparator = new Comparator<number>();

      expect(comparator.isGreaterThanOrEqual(5, 3)).toBe(true);
      expect(comparator.isGreaterThanOrEqual(5, 5)).toBe(true);
      expect(comparator.isGreaterThanOrEqual(3, 5)).toBe(false);
    });
  });

  describe("custom comparison", () => {
    it("should use custom comparison for objects", () => {
      const comparator = new Comparator<{ age: number }>((a, b) => {
        if (a.age === b.age) return 0;
        return a.age < b.age ? -1 : 1;
      });

      expect(comparator.isEqual({ age: 30 }, { age: 30 })).toBe(true);
      expect(comparator.isLessThan({ age: 25 }, { age: 30 })).toBe(true);
    });

    it("should handle reverse comparison", () => {
      const comparator = new Comparator<number>((a, b) => {
        if (a === b) return 0;
        return a > b ? -1 : 1;
      });

      expect(comparator.isLessThan(5, 3)).toBe(true);
      expect(comparator.isGreaterThan(3, 5)).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle zero and negative numbers", () => {
      const comparator = new Comparator<number>();

      expect(comparator.isEqual(0, 0)).toBe(true);
      expect(comparator.isLessThan(-5, 0)).toBe(true);
      expect(comparator.isLessThan(-10, -5)).toBe(true);
    });

    it("should handle empty strings", () => {
      const comparator = new Comparator<string>();

      expect(comparator.isEqual("", "")).toBe(true);
      expect(comparator.isLessThan("", "a")).toBe(true);
    });
  });

  describe("static defaultComparatorFunction", () => {
    it("should work as standalone function", () => {
      const compare = Comparator.defaultComparatorFunction;

      expect(compare(5, 5)).toBe(0);
      expect(compare(3, 5)).toBe(-1);
      expect(compare(5, 3)).toBe(1);
    });
  });
});
