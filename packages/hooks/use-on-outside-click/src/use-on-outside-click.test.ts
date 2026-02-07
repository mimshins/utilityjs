import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOnOutsideClick } from "./use-on-outside-click.ts";

vi.mock("@utilityjs/use-event-listener", () => ({
  useEventListener: vi.fn(),
}));

vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
}));

vi.mock("@utilityjs/use-register-node-ref", () => ({
  useRegisterNodeRef: <T extends HTMLElement>(
    subscriber: (node: T) => void,
    _deps: unknown[],
  ) => {
    return (node: T | null) => {
      subscriber(node as T);
    };
  },
}));

const mockUseEventListener = vi.mocked(
  await import("@utilityjs/use-event-listener"),
).useEventListener;

const getHandler = () => {
  const call = mockUseEventListener.mock.calls[0];

  return call?.[0].handler as (event: MouseEvent) => void;
};

const createClickEvent = (target: EventTarget) => {
  const event = new MouseEvent("click", { bubbles: true });

  Object.defineProperty(event, "target", { value: target });
  return event;
};

describe("useOnOutsideClick", () => {
  let callback: ReturnType<typeof vi.fn<(event: MouseEvent) => void>>;
  let element: HTMLDivElement;

  beforeEach(() => {
    callback = vi.fn();
    element = document.createElement("div");
    mockUseEventListener.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should register a click listener on document", () => {
    renderHook(() => useOnOutsideClick(callback));

    expect(mockUseEventListener).toHaveBeenCalledWith({
      target: document,
      eventType: "click",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      handler: expect.any(Function),
    });
  });

  it("should call callback when clicking outside the element", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));

    result.current(element);

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking on the element itself", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));

    result.current(element);

    getHandler()(createClickEvent(element));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when clicking on a child element", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));
    const child = document.createElement("span");

    element.appendChild(child);
    result.current(element);

    getHandler()(createClickEvent(child));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when element is null", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));

    result.current(null);

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should respect shouldTrigger returning true", () => {
    const shouldTrigger = vi.fn().mockReturnValue(true);
    const { result } = renderHook(() =>
      useOnOutsideClick(callback, shouldTrigger),
    );

    result.current(element);

    const outside = document.createElement("div");
    const event = createClickEvent(outside);

    getHandler()(event);

    expect(shouldTrigger).toHaveBeenCalledWith(event);
    expect(callback).toHaveBeenCalledWith(event);
  });

  it("should respect shouldTrigger returning false", () => {
    const shouldTrigger = vi.fn().mockReturnValue(false);
    const { result } = renderHook(() =>
      useOnOutsideClick(callback, shouldTrigger),
    );

    result.current(element);

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when clicking on deeply nested child", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));
    const child = document.createElement("span");
    const grandchild = document.createElement("button");

    element.appendChild(child);
    child.appendChild(grandchild);
    result.current(element);

    getHandler()(createClickEvent(grandchild));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback with the click event", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));

    result.current(element);

    const outside = document.createElement("div");
    const event = createClickEvent(outside);

    getHandler()(event);

    expect(callback).toHaveBeenCalledWith(event);
  });

  it("should update element ref when ref callback is called multiple times", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");

    result.current(element1);

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));
    expect(callback).toHaveBeenCalledTimes(1);

    callback.mockClear();
    result.current(element2);

    getHandler()(createClickEvent(outside));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking outside after element is set to null", () => {
    const { result } = renderHook(() => useOnOutsideClick(callback));

    result.current(element);

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));
    expect(callback).toHaveBeenCalledTimes(1);

    callback.mockClear();
    result.current(null);

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });
});
