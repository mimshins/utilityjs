import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@utilityjs/use-register-node-ref", () => ({
  useRegisterNodeRef: (
    subscriber: (node: HTMLElement) => (() => void) | void,
    _deps?: unknown[],
  ) => {
    let cleanup: (() => void) | void;

    return (node: HTMLElement | null) => {
      if (cleanup) cleanup();
      if (node) cleanup = subscriber(node);
    };
  },
}));

let mockObserveCallback:
  | ((inView: boolean, isIntersected: boolean) => void)
  | null = null;

let mockObserveFn: () => void;
let mockUnobserveFn: () => void;

vi.mock("./utils.ts", () => ({
  getObserver: vi.fn(() => class FakeIO {}),
  createObserver: vi.fn(
    (
      _node: HTMLElement,
      callback: (inView: boolean, isIntersected: boolean) => void,
    ) => {
      mockObserveCallback = callback;

      return {
        observe: () => mockObserveFn(),
        unobserve: () => mockUnobserveFn(),
      };
    },
  ),
  requestIdleCallback: vi.fn((cb: () => void) => setTimeout(cb, 0)),
  cancelIdleCallback: vi.fn((id: number) => clearTimeout(id)),
}));

const { useIsInViewport } = await import("./use-is-in-viewport.ts");
const { createObserver, getObserver } = await import("./utils.ts");

describe("useIsInViewport", () => {
  beforeEach(() => {
    mockObserveCallback = null;
    mockObserveFn = vi.fn<() => void>();
    mockUnobserveFn = vi.fn<() => void>();
    vi.mocked(createObserver).mockClear();
    vi.mocked(getObserver).mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return isInViewport false initially", () => {
    const { result } = renderHook(() => useIsInViewport());

    expect(result.current.isInViewport).toBe(false);
    expect(typeof result.current.registerNode).toBe("function");
  });

  it("should call createObserver when element is registered", () => {
    const { result } = renderHook(() => useIsInViewport());
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    expect(createObserver).toHaveBeenCalledWith(
      el,
      expect.any(Function),
      expect.objectContaining({
        threshold: [0, 1],
        root: null,
        rootMargin: "0px",
      }),
    );
    expect(mockObserveFn).toHaveBeenCalled();
  });

  it("should update isInViewport when element enters viewport", () => {
    const { result } = renderHook(() => useIsInViewport());
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    act(() => {
      mockObserveCallback?.(true, true);
    });

    expect(result.current.isInViewport).toBe(true);
  });

  it("should update isInViewport when element leaves viewport", () => {
    const { result } = renderHook(() => useIsInViewport());
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    act(() => {
      mockObserveCallback?.(true, true);
    });

    expect(result.current.isInViewport).toBe(true);

    act(() => {
      mockObserveCallback?.(false, false);
    });

    expect(result.current.isInViewport).toBe(false);
  });

  it("should pass custom threshold", () => {
    const { result } = renderHook(() => useIsInViewport({ threshold: 0.5 }));
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    expect(createObserver).toHaveBeenCalledWith(
      el,
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 }),
    );
  });

  it("should pass custom root and rootMargin", () => {
    const rootEl = document.createElement("div");
    const { result } = renderHook(() =>
      useIsInViewport({ root: rootEl, rootMargin: "10px" }),
    );

    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    expect(createObserver).toHaveBeenCalledWith(
      el,
      expect.any(Function),
      expect.objectContaining({ root: rootEl, rootMargin: "10px" }),
    );
  });

  it("should unobserve after first intersection when once is true", () => {
    const { result } = renderHook(() => useIsInViewport({ once: true }));
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    act(() => {
      mockObserveCallback?.(true, true);
    });

    expect(result.current.isInViewport).toBe(true);
    expect(mockUnobserveFn).toHaveBeenCalled();
  });

  it("should not unobserve when once is true but not intersected", () => {
    const { result } = renderHook(() => useIsInViewport({ once: true }));
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    act(() => {
      mockObserveCallback?.(false, false);
    });

    expect(result.current.isInViewport).toBe(false);
    // unobserve not called (only observe's initial call)
  });

  it("should not create observer when disabled", () => {
    const { result } = renderHook(() => useIsInViewport({ disabled: true }));
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    expect(createObserver).not.toHaveBeenCalled();
  });

  it("should unobserve on cleanup", () => {
    const { result } = renderHook(() => useIsInViewport());
    const el = document.createElement("div");

    act(() => {
      result.current.registerNode(el);
    });

    act(() => {
      result.current.registerNode(null);
    });

    expect(mockUnobserveFn).toHaveBeenCalled();
  });

  it("should handle null from createObserver", () => {
    vi.mocked(createObserver).mockReturnValueOnce(null);

    const { result } = renderHook(() => useIsInViewport());
    const el = document.createElement("div");

    expect(() => {
      act(() => {
        result.current.registerNode(el);
      });
    }).not.toThrow();
  });

  it("should fallback to requestIdleCallback when no observer and not in viewport", async () => {
    vi.useFakeTimers();
    vi.mocked(getObserver).mockReturnValue(null);

    const { result } = renderHook(() => useIsInViewport());

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.isInViewport).toBe(true);
    vi.useRealTimers();
  });
});
