import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResizeSensor } from "./use-resize-sensor.ts";

vi.mock("lodash.debounce", () => ({
  default: vi.fn((fn: (...args: unknown[]) => unknown) => {
    const debounced = (...args: unknown[]) => fn(...args);

    debounced.cancel = vi.fn();
    debounced.flush = vi.fn();
    return debounced;
  }),
}));

vi.mock("lodash.throttle", () => ({
  default: vi.fn((fn: (...args: unknown[]) => unknown) => {
    const throttled = (...args: unknown[]) => fn(...args);

    throttled.cancel = vi.fn();
    throttled.flush = vi.fn();
    return throttled;
  }),
}));

type ResizeCallback = ResizeObserverCallback;

let resizeCallback: ResizeCallback;
let mockObserverInstance: {
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
};

const triggerResize = (
  element: Element,
  rect: { width: number; height: number },
) => {
  const entry = {
    target: element,
    contentRect: {
      width: rect.width,
      height: rect.height,
      top: 0,
      left: 0,
      bottom: rect.height,
      right: rect.width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    },
    borderBoxSize: [],
    contentBoxSize: [],
    devicePixelContentBoxSize: [],
  } as ResizeObserverEntry;

  act(() => {
    resizeCallback([entry], mockObserverInstance as unknown as ResizeObserver);
  });
};

describe("useResizeSensor", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");

    mockObserverInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(cb: ResizeCallback) {
          resizeCallback = cb;
          Object.assign(this, mockObserverInstance);
        }

        observe = mockObserverInstance.observe;
        unobserve = mockObserverInstance.unobserve;
        disconnect = mockObserverInstance.disconnect;
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with zero dimensions", () => {
    const { result } = renderHook(() => useResizeSensor());

    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(typeof result.current.registerNode).toBe("function");
  });

  it("should observe element and update dimensions", () => {
    const { result } = renderHook(() => useResizeSensor());

    act(() => {
      result.current.registerNode(element);
    });

    expect(mockObserverInstance.observe).toHaveBeenCalledWith(element);

    triggerResize(element, { width: 100, height: 50 });

    expect(result.current.width).toBe(100);
    expect(result.current.height).toBe(50);
  });

  it("should update dimensions on resize", () => {
    const { result } = renderHook(() => useResizeSensor());

    act(() => {
      result.current.registerNode(element);
    });

    triggerResize(element, { width: 100, height: 100 });
    expect(result.current.width).toBe(100);

    triggerResize(element, { width: 200, height: 150 });
    expect(result.current.width).toBe(200);
    expect(result.current.height).toBe(150);
  });

  it("should not update state when dimensions are unchanged", () => {
    const { result } = renderHook(() => useResizeSensor());

    act(() => {
      result.current.registerNode(element);
    });

    triggerResize(element, { width: 100, height: 100 });

    const prevWidth = result.current.width;

    triggerResize(element, { width: 100, height: 100 });

    expect(result.current.width).toBe(prevWidth);
  });

  it("should disconnect observer when node is set to null", () => {
    const { result } = renderHook(() => useResizeSensor());

    act(() => {
      result.current.registerNode(element);
    });

    act(() => {
      result.current.registerNode(null);
    });

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });

  it("should disconnect old observer when node changes", () => {
    const { result } = renderHook(() => useResizeSensor());
    const element2 = document.createElement("span");

    act(() => {
      result.current.registerNode(element);
    });

    act(() => {
      result.current.registerNode(element2);
    });

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
  });

  it("should apply debounce when mode is debounce", async () => {
    const debounce = (await import("lodash.debounce")).default;

    const { result } = renderHook(() =>
      useResizeSensor({ mode: "debounce", rate: 100 }),
    );

    act(() => {
      result.current.registerNode(element);
    });

    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 100, {
      leading: false,
      trailing: true,
    });
  });

  it("should apply throttle when mode is throttle", async () => {
    const throttle = (await import("lodash.throttle")).default;

    const { result } = renderHook(() =>
      useResizeSensor({ mode: "throttle", rate: 50 }),
    );

    act(() => {
      result.current.registerNode(element);
    });

    expect(throttle).toHaveBeenCalledWith(expect.any(Function), 50, {
      leading: true,
      trailing: true,
    });
  });

  it("should pass custom debounce options", async () => {
    const debounce = (await import("lodash.debounce")).default;

    const { result } = renderHook(() =>
      useResizeSensor({
        mode: "debounce",
        rate: 200,
        leading: true,
        trailing: false,
      }),
    );

    act(() => {
      result.current.registerNode(element);
    });

    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 200, {
      leading: true,
      trailing: false,
    });
  });

  it("should pass custom throttle options", async () => {
    const throttle = (await import("lodash.throttle")).default;

    const { result } = renderHook(() =>
      useResizeSensor({
        mode: "throttle",
        rate: 300,
        leading: false,
        trailing: true,
      }),
    );

    act(() => {
      result.current.registerNode(element);
    });

    expect(throttle).toHaveBeenCalledWith(expect.any(Function), 300, {
      leading: false,
      trailing: true,
    });
  });

  it("should use default rate of 250 when not specified", async () => {
    const debounce = (await import("lodash.debounce")).default;

    const { result } = renderHook(() => useResizeSensor({ mode: "debounce" }));

    act(() => {
      result.current.registerNode(element);
    });

    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 250, {
      leading: false,
      trailing: true,
    });
  });

  it("should cancel debounced callback on cleanup", async () => {
    const debounce = (await import("lodash.debounce")).default;
    const { result } = renderHook(() =>
      useResizeSensor({ mode: "debounce", rate: 100 }),
    );

    act(() => {
      result.current.registerNode(element);
    });

    const debouncedFn = vi.mocked(debounce).mock.results[0]?.value as {
      cancel: ReturnType<typeof vi.fn>;
    };

    act(() => {
      result.current.registerNode(null);
    });

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
    expect(debouncedFn.cancel).toHaveBeenCalled();
  });

  it("should not debounce/throttle when no mode specified", async () => {
    const debounce = (await import("lodash.debounce")).default;
    const throttle = (await import("lodash.throttle")).default;

    vi.mocked(debounce).mockClear();
    vi.mocked(throttle).mockClear();

    const { result } = renderHook(() => useResizeSensor());

    act(() => {
      result.current.registerNode(element);
    });

    expect(debounce).not.toHaveBeenCalled();
    expect(throttle).not.toHaveBeenCalled();
  });
});
