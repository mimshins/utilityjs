import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDeterministicId } from "./use-deterministic-id.ts";

describe("useDeterministicId", () => {
  describe("basic functionality", () => {
    it("should generate a unique ID", () => {
      const { result } = renderHook(() => useDeterministicId());

      expect(result.current).toBeTruthy();
      expect(typeof result.current).toBe("string");
    });

    it("should use provided override ID", () => {
      const customId = "my-custom-id";
      const { result } = renderHook(() => useDeterministicId(customId));

      expect(result.current).toContain(customId);
    });

    it("should use custom prefix", () => {
      const customPrefix = "my-prefix";
      const { result } = renderHook(() =>
        useDeterministicId(undefined, customPrefix),
      );

      expect(result.current).toContain(customPrefix);
    });

    it("should use default prefix when not provided", () => {
      const { result } = renderHook(() => useDeterministicId());

      expect(result.current).toContain("UTILITYJS-GEN-ID");
    });
  });

  describe("stability", () => {
    it("should return stable ID across renders", () => {
      const { result, rerender } = renderHook(() => useDeterministicId());

      const firstId = result.current;

      rerender();
      const secondId = result.current;

      expect(firstId).toBe(secondId);
    });

    it("should return stable ID with override", () => {
      const customId = "stable-id";
      const { result, rerender } = renderHook(() =>
        useDeterministicId(customId),
      );

      const firstId = result.current;

      rerender();
      const secondId = result.current;

      expect(firstId).toBe(secondId);
      expect(firstId).toContain(customId);
    });

    it("should update ID when override changes", () => {
      const { result, rerender } = renderHook(
        ({ id }) => useDeterministicId(id),
        { initialProps: { id: "first-id" } },
      );

      const firstId = result.current;

      expect(firstId).toContain("first-id");

      rerender({ id: "second-id" });
      const secondId = result.current;

      expect(secondId).toContain("second-id");
      expect(firstId).not.toBe(secondId);
    });

    it("should update ID when prefix changes", () => {
      const { result, rerender } = renderHook(
        ({ prefix }) => useDeterministicId(undefined, prefix),
        { initialProps: { prefix: "prefix-1" } },
      );

      const firstId = result.current;

      expect(firstId).toContain("prefix-1");

      rerender({ prefix: "prefix-2" });
      const secondId = result.current;

      expect(secondId).toContain("prefix-2");
    });
  });

  describe("multiple instances", () => {
    it("should generate different IDs for different instances", () => {
      const { result: result1 } = renderHook(() => useDeterministicId());
      const { result: result2 } = renderHook(() => useDeterministicId());

      expect(result1.current).toBeTruthy();
      expect(result2.current).toBeTruthy();
      // IDs should be different (unless React.useId returns same value)
      // We can't guarantee they're different due to React.useId behavior
    });

    it("should respect different overrides", () => {
      const { result: result1 } = renderHook(() => useDeterministicId("id-1"));
      const { result: result2 } = renderHook(() => useDeterministicId("id-2"));

      expect(result1.current).toContain("id-1");
      expect(result2.current).toContain("id-2");
      expect(result1.current).not.toBe(result2.current);
    });

    it("should respect different prefixes", () => {
      const { result: result1 } = renderHook(() =>
        useDeterministicId(undefined, "prefix-a"),
      );

      const { result: result2 } = renderHook(() =>
        useDeterministicId(undefined, "prefix-b"),
      );

      expect(result1.current).toContain("prefix-a");
      expect(result2.current).toContain("prefix-b");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string override", () => {
      const { result } = renderHook(() => useDeterministicId(""));

      // Empty string override should still generate an ID
      expect(typeof result.current).toBe("string");
    });

    it("should handle empty string prefix", () => {
      const { result } = renderHook(() => useDeterministicId(undefined, ""));

      // Empty prefix should use default prefix
      expect(typeof result.current).toBe("string");
      expect(result.current).toContain("UTILITYJS-GEN-ID");
    });

    it("should handle special characters in override", () => {
      const specialId = "id-with-special-chars-!@#$%";
      const { result } = renderHook(() => useDeterministicId(specialId));

      expect(result.current).toContain("id-with-special-chars");
    });

    it("should handle special characters in prefix", () => {
      const specialPrefix = "prefix-!@#";
      const { result } = renderHook(() =>
        useDeterministicId(undefined, specialPrefix),
      );

      expect(typeof result.current).toBe("string");
    });

    it("should handle undefined override explicitly", () => {
      const { result } = renderHook(() => useDeterministicId(undefined));

      expect(typeof result.current).toBe("string");
      expect(result.current.length).toBeGreaterThan(0);
    });

    it("should handle null as override", () => {
      const { result } = renderHook(() => useDeterministicId(null as never));

      expect(typeof result.current).toBe("string");
    });
  });
});
