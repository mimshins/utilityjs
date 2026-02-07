import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_PREFIX } from "./constants.ts";
import { prefixStr, useId } from "./utils.ts";

describe("utils", () => {
  describe("prefixStr", () => {
    it("should prefix string with given prefix", () => {
      expect(prefixStr("test", "prefix")).toBe("prefix-test");
    });

    it("should use default prefix when prefix is empty", () => {
      expect(prefixStr("test", "")).toBe(`${DEFAULT_PREFIX}-test`);
    });

    it("should handle different strings", () => {
      expect(prefixStr("123", "num")).toBe("num-123");
      expect(prefixStr("abc", "str")).toBe("str-abc");
    });

    it("should handle special characters", () => {
      expect(prefixStr("test-id", "my-prefix")).toBe("my-prefix-test-id");
      expect(prefixStr("test_id", "prefix")).toBe("prefix-test_id");
    });

    it("should handle numeric strings", () => {
      expect(prefixStr("1", "id")).toBe("id-1");
      expect(prefixStr("999", "component")).toBe("component-999");
    });

    it("should handle empty string", () => {
      expect(prefixStr("", "prefix")).toBe("prefix-");
    });
  });

  describe("useId", () => {
    it("should return an id and setDefaultId function", () => {
      const { result } = renderHook(() => useId());

      expect(result.current).toHaveProperty("id");
      expect(result.current).toHaveProperty("setDefaultId");
      expect(typeof result.current.setDefaultId).toBe("function");
    });

    it("should use override id when provided", () => {
      const { result } = renderHook(() => useId("custom-id"));

      // Override is used as-is without prefix
      expect(result.current.id).toBe("custom-id");
    });

    it("should apply prefix to React useId output", () => {
      const { result } = renderHook(() => useId(undefined, "my-prefix"));

      // When no override, React useId is used and prefixed
      expect(result.current.id).toContain("my-prefix");
    });

    it("should sanitize React useId output", () => {
      const { result } = renderHook(() => useId());

      // React useId returns strings like ":r1:" which get sanitized
      expect(result.current.id).not.toContain(":");
    });

    it("should handle undefined override", () => {
      const { result } = renderHook(() => useId(undefined));

      expect(result.current).toHaveProperty("id");
      expect(result.current).toHaveProperty("setDefaultId");
    });
  });
});
