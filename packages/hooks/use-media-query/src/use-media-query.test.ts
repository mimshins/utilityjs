import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query.ts";

describe("useMediaQuery", () => {
  let mockMatchMedia: ReturnType<typeof vi.fn>;

  const createMockMediaQueryList = (query: string, matches = false) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });

  beforeEach(() => {
    mockMatchMedia = vi.fn((query: string) => createMockMediaQueryList(query));
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return [false] for a single non-matching query", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toEqual([false]);
  });

  it("should return [true] when the query initially matches", () => {
    mockMatchMedia.mockReturnValue(
      createMockMediaQueryList("(max-width: 768px)", true),
    );

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toEqual([true]);
  });

  it("should call matchMedia with the provided query", () => {
    renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 768px)");
  });

  it("should handle an array of queries", () => {
    const mql1 = createMockMediaQueryList("(max-width: 768px)", true);
    const mql2 = createMockMediaQueryList("(min-width: 1024px)", false);

    mockMatchMedia.mockReturnValueOnce(mql1).mockReturnValueOnce(mql2);

    const { result } = renderHook(() =>
      useMediaQuery(["(max-width: 768px)", "(min-width: 1024px)"]),
    );

    expect(result.current).toEqual([true, false]);
  });

  it("should add change event listeners", () => {
    const mql = createMockMediaQueryList("(max-width: 768px)");

    mockMatchMedia.mockReturnValue(mql);
    renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(mql.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should update state when a media query change fires", () => {
    const mql = createMockMediaQueryList("(max-width: 768px)");

    mockMatchMedia.mockReturnValue(mql);

    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    expect(result.current).toEqual([false]);

    const handler = mql.addEventListener.mock.calls[0]?.[1] as (
      e: Partial<MediaQueryListEvent>,
    ) => void;

    act(() => {
      handler({ matches: true, media: "(max-width: 768px)" });
    });

    expect(result.current).toEqual([true]);
  });

  it("should update the correct index for multiple queries", () => {
    const mql1 = createMockMediaQueryList("(max-width: 768px)");
    const mql2 = createMockMediaQueryList("(min-width: 1024px)");

    mockMatchMedia.mockReturnValueOnce(mql1).mockReturnValueOnce(mql2);

    const { result } = renderHook(() =>
      useMediaQuery(["(max-width: 768px)", "(min-width: 1024px)"]),
    );

    const handler2 = mql2.addEventListener.mock.calls[0]?.[1] as (
      e: Partial<MediaQueryListEvent>,
    ) => void;

    act(() => {
      handler2({ matches: true, media: "(min-width: 1024px)" });
    });

    expect(result.current).toEqual([false, true]);
  });

  it("should remove event listeners on unmount", () => {
    const mql = createMockMediaQueryList("(max-width: 768px)");

    mockMatchMedia.mockReturnValue(mql);

    const { unmount } = renderHook(() => useMediaQuery("(max-width: 768px)"));

    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should not update state after unmount", () => {
    const mql = createMockMediaQueryList("(max-width: 768px)");

    mockMatchMedia.mockReturnValue(mql);

    const { result, unmount } = renderHook(() =>
      useMediaQuery("(max-width: 768px)"),
    );

    const handler = mql.addEventListener.mock.calls[0]?.[1] as (
      e: Partial<MediaQueryListEvent>,
    ) => void;

    unmount();

    act(() => {
      handler({ matches: true, media: "(max-width: 768px)" });
    });

    expect(result.current).toEqual([false]);
  });

  it("should re-subscribe when queries change", () => {
    const mql1 = createMockMediaQueryList("(max-width: 768px)");
    const mql2 = createMockMediaQueryList("(min-width: 1024px)");

    mockMatchMedia.mockReturnValue(mql1);

    const { result, rerender } = renderHook(
      ({ queries }) => useMediaQuery(queries),
      { initialProps: { queries: ["(max-width: 768px)"] } },
    );

    expect(result.current).toEqual([false]);

    mockMatchMedia.mockReturnValue(mql2);
    rerender({ queries: ["(min-width: 1024px)"] });

    expect(mql1.removeEventListener).toHaveBeenCalled();
  });

  it("should return empty array for empty query array", () => {
    const { result } = renderHook(() => useMediaQuery([]));

    expect(result.current).toEqual([]);
  });

  it("should handle duplicate queries", () => {
    const { result } = renderHook(() =>
      useMediaQuery(["(max-width: 768px)", "(max-width: 768px)"]),
    );

    expect(result.current).toHaveLength(2);
    expect(mockMatchMedia).toHaveBeenCalledTimes(2);
  });

  it("should maintain state consistency across re-renders", () => {
    const mql = createMockMediaQueryList("(max-width: 768px)");

    mockMatchMedia.mockReturnValue(mql);

    const { result, rerender } = renderHook(() =>
      useMediaQuery("(max-width: 768px)"),
    );

    expect(result.current).toEqual([false]);

    rerender();
    expect(result.current).toEqual([false]);
  });
});
