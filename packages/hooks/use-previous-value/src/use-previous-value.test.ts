import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePreviousValue } from "./use-previous-value.ts";

describe("usePreviousValue", () => {
  it("should return undefined on first render", () => {
    const { result } = renderHook(() => usePreviousValue("initial"));

    expect(result.current).toBeUndefined();
  });

  it("should return previous value after rerender", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: "first" } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    rerender({ value: "third" });
    expect(result.current).toBe("second");
  });

  it("should work with different data types", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: 0 } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 1 });
    expect(result.current).toBe(0);

    rerender({ value: true as never });
    expect(result.current).toBe(1);

    rerender({ value: null as never });
    expect(result.current).toBe(true);

    rerender({ value: undefined as never });
    expect(result.current).toBe(null);
  });

  it("should work with objects", () => {
    const obj1 = { id: 1, name: "first" };
    const obj2 = { id: 2, name: "second" };

    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: obj1 } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
    expect(result.current).toEqual({ id: 1, name: "first" });
  });

  it("should work with arrays", () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: arr1 } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: arr2 });
    expect(result.current).toBe(arr1);
    expect(result.current).toEqual([1, 2, 3]);
  });

  it("should handle same value updates", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: "same" } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: "same" });
    expect(result.current).toBe("same");

    rerender({ value: "same" });
    expect(result.current).toBe("same");
  });

  it("should handle function values", () => {
    const fn1 = () => "first";
    const fn2 = () => "second";

    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: fn1 } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: fn2 });
    expect(result.current).toBe(fn1);
    expect(result.current?.()).toBe("first");
  });

  it("should maintain reference equality", () => {
    const obj = { test: true };

    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: obj } },
    );

    rerender({ value: "different" as never });

    expect(result.current).toBe(obj); // Same reference
  });

  it("should work with complex nested objects", () => {
    const complex1 = {
      user: { id: 1, profile: { name: "John", settings: { theme: "dark" } } },
      items: [{ id: 1, active: true }],
    };

    const complex2 = {
      user: { id: 2, profile: { name: "Jane", settings: { theme: "light" } } },
      items: [{ id: 2, active: false }],
    };

    const { result, rerender } = renderHook(
      ({ value }) => usePreviousValue(value),
      { initialProps: { value: complex1 } },
    );

    expect(result.current).toBeUndefined();

    rerender({ value: complex2 });
    expect(result.current).toBe(complex1);
    expect(result.current?.user.profile.name).toBe("John");
  });
});
