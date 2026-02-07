import { describe, expect, it } from "vitest";
import { isEqual, isUndef } from "./utils.ts";

describe("utils", () => {
  describe("isEqual", () => {
    it("should return true for identical primitive values", () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual("test", "test")).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
    });

    it("should return false for different primitive values", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("test", "other")).toBe(false);
      expect(isEqual(true, false)).toBe(false);
    });

    it("should return false for different types", () => {
      expect(isEqual(null, undefined)).toBe(false);
      expect(isEqual(1, "1" as never)).toBe(false);
      expect(isEqual(true, 1 as never)).toBe(false);
      expect(isEqual([], {})).toBe(false);
    });

    it("should handle null and object values", () => {
      // null === null should be true
      expect(isEqual(null, null)).toBe(true);
      // Different object instances are not equal (no deep comparison)
      expect(isEqual({}, {})).toBe(false);
    });

    it("should return true for equal arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual(["a", "b"], ["a", "b"])).toBe(true);
      expect(isEqual([], [])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual(["a"], ["b"])).toBe(false);
    });

    it("should return false for arrays with different lengths", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual([1], [])).toBe(false);
    });

    it("should handle mixed array and non-array comparisons", () => {
      expect(isEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
    });
  });

  describe("isUndef", () => {
    it("should return true for undefined", () => {
      expect(isUndef(undefined)).toBe(true);
    });

    it("should return false for defined values", () => {
      expect(isUndef(null)).toBe(false);
      expect(isUndef(0)).toBe(false);
      expect(isUndef("")).toBe(false);
      expect(isUndef(false)).toBe(false);
      expect(isUndef([])).toBe(false);
      expect(isUndef({})).toBe(false);
    });

    it("should work with different types", () => {
      expect(isUndef("test")).toBe(false);
      expect(isUndef(123)).toBe(false);
      expect(isUndef(true)).toBe(false);
      expect(isUndef({ key: "value" })).toBe(false);
      expect(isUndef([1, 2, 3])).toBe(false);
    });
  });
});
