import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useIsServerHandoffComplete", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return true after effects run", async () => {
    const { useIsServerHandoffComplete } =
      await import("./use-is-server-handoff-complete.ts");

    const { result } = renderHook(() => useIsServerHandoffComplete());

    expect(result.current).toBe(true);
  });

  it("should remain true on subsequent re-renders", async () => {
    const { useIsServerHandoffComplete } =
      await import("./use-is-server-handoff-complete.ts");

    const { result, rerender } = renderHook(() => useIsServerHandoffComplete());

    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(true);

    rerender();
    expect(result.current).toBe(true);
  });

  it("should share global handoff state across instances", async () => {
    const { useIsServerHandoffComplete } =
      await import("./use-is-server-handoff-complete.ts");

    // First instance completes handoff
    renderHook(() => useIsServerHandoffComplete());

    // Second instance should see completed handoff immediately
    const { result } = renderHook(() => useIsServerHandoffComplete());

    expect(result.current).toBe(true);
  });
});
