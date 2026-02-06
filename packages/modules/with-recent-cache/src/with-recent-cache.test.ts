import { describe, expect, it, vi } from "vitest";
import { withRecentCache } from "./with-recent-cache.ts";

describe("withRecentCache", () => {
  describe("caching behavior", () => {
    it("should call function on first invocation", () => {
      const fn = vi.fn((a: number, b: number) => a + b);
      const memoized = withRecentCache(fn);

      expect(memoized(1, 2)).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should return cached result for identical arguments", () => {
      const fn = vi.fn((a: number, b: number) => a * b);
      const memoized = withRecentCache(fn);

      expect(memoized(2, 3)).toBe(6);
      expect(memoized(2, 3)).toBe(6);
      expect(memoized(2, 3)).toBe(6);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should recompute when arguments change", () => {
      const fn = vi.fn((x: number) => x * 2);
      const memoized = withRecentCache(fn);

      expect(memoized(5)).toBe(10);
      expect(memoized(10)).toBe(20);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should replace cache on new arguments", () => {
      const fn = vi.fn((x: number) => x);
      const memoized = withRecentCache(fn);

      memoized(1);
      memoized(2);
      memoized(1); // Cache was replaced, should recompute

      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe("argument comparison", () => {
    it("should use shallow equality for primitives", () => {
      const fn = vi.fn((a: string, b: number) => `${a}-${b}`);
      const memoized = withRecentCache(fn);

      expect(memoized("test", 1)).toBe("test-1");
      expect(memoized("test", 1)).toBe("test-1");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should treat different object references as different arguments", () => {
      const fn = vi.fn((obj: { x: number }) => obj.x);
      const memoized = withRecentCache(fn);

      memoized({ x: 1 });
      memoized({ x: 1 }); // Different reference

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should cache when same object reference is passed", () => {
      const fn = vi.fn((obj: { x: number }) => obj.x);
      const memoized = withRecentCache(fn);
      const obj = { x: 1 };

      memoized(obj);
      memoized(obj);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should handle different argument lengths", () => {
      const fn = vi.fn((...args: number[]) => args.reduce((a, b) => a + b, 0));
      const memoized = withRecentCache(fn);

      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2, 3)).toBe(6);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("edge cases", () => {
    it("should handle zero arguments", () => {
      const fn = vi.fn(() => 42);
      const memoized = withRecentCache(fn);

      expect(memoized()).toBe(42);
      expect(memoized()).toBe(42);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined and null arguments", () => {
      const fn = vi.fn((a: unknown) => a);
      const memoized = withRecentCache(fn);

      expect(memoized(undefined)).toBe(undefined);
      expect(memoized(undefined)).toBe(undefined);
      expect(fn).toHaveBeenCalledTimes(1);

      expect(memoized(null)).toBe(null);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should preserve function return type", () => {
      const fn = vi.fn(() => ({ nested: { value: 123 } }));
      const memoized = withRecentCache(fn);

      const result = memoized();

      expect(result.nested.value).toBe(123);
    });
  });
});
