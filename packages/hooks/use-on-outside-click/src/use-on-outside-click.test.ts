import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOnOutsideClick } from "./use-on-outside-click.ts";

vi.mock("@utilityjs/use-event-listener", () => ({
  useEventListener: vi.fn(),
}));

vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
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
  let callback: (event: MouseEvent) => void;
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
    renderHook(() => useOnOutsideClick({ current: element }, callback));

    expect(mockUseEventListener).toHaveBeenCalledWith({
      target: document,
      eventType: "click",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      handler: expect.any(Function),
    });
  });

  it("should call callback when clicking outside the element (ref)", () => {
    renderHook(() => useOnOutsideClick({ current: element }, callback));

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should call callback when clicking outside the element (direct element)", () => {
    renderHook(() => useOnOutsideClick(element, callback));

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking on the element itself", () => {
    renderHook(() => useOnOutsideClick({ current: element }, callback));

    getHandler()(createClickEvent(element));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when clicking on a child element", () => {
    const child = document.createElement("span");

    element.appendChild(child);

    renderHook(() => useOnOutsideClick({ current: element }, callback));

    getHandler()(createClickEvent(child));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when target is null", () => {
    renderHook(() => useOnOutsideClick(null, callback));

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when ref.current is null", () => {
    renderHook(() =>
      useOnOutsideClick(
        { current: null } as unknown as React.RefObject<HTMLElement>,
        callback,
      ),
    );

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should respect extendCondition returning true", () => {
    const extendCondition = vi.fn().mockReturnValue(true);

    renderHook(() =>
      useOnOutsideClick({ current: element }, callback, extendCondition),
    );

    const outside = document.createElement("div");
    const event = createClickEvent(outside);

    getHandler()(event);

    expect(extendCondition).toHaveBeenCalledWith(event);
    expect(callback).toHaveBeenCalledWith(event);
  });

  it("should respect extendCondition returning false", () => {
    const extendCondition = vi.fn().mockReturnValue(false);

    renderHook(() =>
      useOnOutsideClick({ current: element }, callback, extendCondition),
    );

    const outside = document.createElement("div");

    getHandler()(createClickEvent(outside));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call callback when clicking on deeply nested child", () => {
    const child = document.createElement("span");
    const grandchild = document.createElement("button");

    element.appendChild(child);
    child.appendChild(grandchild);

    renderHook(() => useOnOutsideClick({ current: element }, callback));

    getHandler()(createClickEvent(grandchild));

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call callback with the click event", () => {
    renderHook(() => useOnOutsideClick({ current: element }, callback));

    const outside = document.createElement("div");
    const event = createClickEvent(outside);

    getHandler()(event);

    expect(callback).toHaveBeenCalledWith(event);
  });
});
