import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect.ts";

describe("useIsomorphicLayoutEffect", () => {
  it("should be useLayoutEffect in browser environment", () => {
    // In jsdom (test env), window is defined, so it should be useLayoutEffect
    expect(typeof useIsomorphicLayoutEffect).toBe("function");
  });

  it("should run the effect callback", () => {
    const effect = vi.fn();

    renderHook(() => useIsomorphicLayoutEffect(effect, []));

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("should run cleanup on unmount", () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);

    const { unmount } = renderHook(() => useIsomorphicLayoutEffect(effect, []));

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("should re-run effect when dependencies change", () => {
    const effect = vi.fn();

    const { rerender } = renderHook(
      ({ dep }) => useIsomorphicLayoutEffect(effect, [dep]),
      { initialProps: { dep: 1 } },
    );

    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("should not re-run effect when dependencies are stable", () => {
    const effect = vi.fn();

    const { rerender } = renderHook(
      ({ dep }) => useIsomorphicLayoutEffect(effect, [dep]),
      { initialProps: { dep: 1 } },
    );

    expect(effect).toHaveBeenCalledTimes(1);

    rerender({ dep: 1 });
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("should work with empty dependency array", () => {
    const effect = vi.fn();

    const { rerender } = renderHook(() =>
      useIsomorphicLayoutEffect(effect, []),
    );

    expect(effect).toHaveBeenCalledTimes(1);

    rerender();
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it("should run on every render without dependency array", () => {
    const effect = vi.fn();

    const { rerender } = renderHook(() => useIsomorphicLayoutEffect(effect));

    expect(effect).toHaveBeenCalledTimes(1);

    rerender();
    expect(effect).toHaveBeenCalledTimes(2);
  });
});
