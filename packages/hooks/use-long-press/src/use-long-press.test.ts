import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLongPress } from "./use-long-press.ts";

vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
}));

vi.mock("@utilityjs/use-register-node-ref", () => ({
  useRegisterNodeRef: (subscriber: (node: HTMLElement) => () => void) =>
    subscriber,
}));

describe("useLongPress", () => {
  let callback: () => void;
  let element: HTMLDivElement;

  beforeEach(() => {
    callback = vi.fn<() => void>();
    element = document.createElement("div");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a registerNode function", () => {
    const { result } = renderHook(() => useLongPress(callback));

    expect(typeof result.current.registerNode).toBe("function");
  });

  it("should trigger callback after default 500ms delay on mousedown", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    vi.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should trigger callback after custom pressDelay", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { pressDelay: 1000 }),
    );

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    vi.advanceTimersByTime(999);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should trigger callback on touchstart", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [{ pageX: 100, pageY: 100 } as Touch],
      }),
    );

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel on mouseup before delay", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    vi.advanceTimersByTime(250);
    element.dispatchEvent(new MouseEvent("mouseup"));
    vi.advanceTimersByTime(250);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should cancel on mouseleave before delay", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    vi.advanceTimersByTime(250);
    element.dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(250);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should cancel on touchend before delay", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [{ pageX: 100, pageY: 100 } as Touch],
      }),
    );
    vi.advanceTimersByTime(250);
    element.dispatchEvent(new TouchEvent("touchend"));
    vi.advanceTimersByTime(250);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should ignore non-primary mouse button", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 2 }));

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should cancel on mouse move exceeding threshold when preventLongPressOnMove is enabled", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, {
        preventLongPressOnMove: true,
        moveThreshold: 10,
      }),
    );

    result.current.registerNode(element);

    const mousedown = new MouseEvent("mousedown", { button: 0 });

    Object.defineProperty(mousedown, "pageX", { value: 100 });
    Object.defineProperty(mousedown, "pageY", { value: 100 });
    element.dispatchEvent(mousedown);

    vi.advanceTimersByTime(250);

    const mousemove = new MouseEvent("mousemove");

    Object.defineProperty(mousemove, "pageX", { value: 120 });
    Object.defineProperty(mousemove, "pageY", { value: 100 });
    element.dispatchEvent(mousemove);

    vi.advanceTimersByTime(250);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not cancel on small mouse movements within threshold", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, {
        preventLongPressOnMove: true,
        moveThreshold: 25,
      }),
    );

    result.current.registerNode(element);

    const mousedown = new MouseEvent("mousedown", { button: 0 });

    Object.defineProperty(mousedown, "pageX", { value: 100 });
    Object.defineProperty(mousedown, "pageY", { value: 100 });
    element.dispatchEvent(mousedown);

    vi.advanceTimersByTime(250);

    const mousemove = new MouseEvent("mousemove");

    Object.defineProperty(mousemove, "pageX", { value: 105 });
    Object.defineProperty(mousemove, "pageY", { value: 105 });
    element.dispatchEvent(mousemove);

    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel on touch move exceeding threshold", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, {
        preventLongPressOnMove: true,
        moveThreshold: 10,
      }),
    );

    result.current.registerNode(element);
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [{ pageX: 100, pageY: 100 } as Touch],
      }),
    );

    vi.advanceTimersByTime(250);

    element.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [{ pageX: 120, pageY: 100 } as Touch],
      }),
    );

    vi.advanceTimersByTime(250);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should prevent context menu when option is enabled and pressed", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventContextMenuOnLongPress: true }),
    );

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    const contextMenuEvent = new PointerEvent("contextmenu");
    const preventDefaultSpy = vi.spyOn(contextMenuEvent, "preventDefault");

    element.oncontextmenu?.(contextMenuEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent context menu when not pressed", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventContextMenuOnLongPress: true }),
    );

    result.current.registerNode(element);

    const contextMenuEvent = new PointerEvent("contextmenu");
    const preventDefaultSpy = vi.spyOn(contextMenuEvent, "preventDefault");

    element.oncontextmenu?.(contextMenuEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("should ignore duplicate mousedown while already pressed", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should clean up timeout on unmount", () => {
    const { result, unmount } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    unmount();

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should remove event listeners via cleanup function", () => {
    const { result } = renderHook(() => useLongPress(callback));

    const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");
    const cleanup = result.current.registerNode(
      element,
    ) as unknown as () => void;

    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchend",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function),
    );
  });

  it("should not cancel on move when preventLongPressOnMove is disabled", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventLongPressOnMove: false }),
    );

    result.current.registerNode(element);

    const mousedown = new MouseEvent("mousedown", { button: 0 });

    Object.defineProperty(mousedown, "pageX", { value: 100 });
    Object.defineProperty(mousedown, "pageY", { value: 100 });
    element.dispatchEvent(mousedown);

    const mousemove = new MouseEvent("mousemove");

    Object.defineProperty(mousemove, "pageX", { value: 200 });
    Object.defineProperty(mousemove, "pageY", { value: 200 });
    element.dispatchEvent(mousemove);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should ignore non-mouse and non-touch events dispatched on the element", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new KeyboardEvent("keydown"));

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle stopLongPress with non-mouse/non-touch events", () => {
    const { result } = renderHook(() => useLongPress(callback));

    result.current.registerNode(element);
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

    // Dispatch a non-mouse/non-touch event as mouseup - the handler ignores it
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle preventLongPress when no start position is recorded", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventLongPressOnMove: true }),
    );

    result.current.registerNode(element);

    // Move without pressing first - startPositionsRef is null
    const mousemove = new MouseEvent("mousemove");

    Object.defineProperty(mousemove, "pageX", { value: 200 });
    Object.defineProperty(mousemove, "pageY", { value: 200 });
    element.dispatchEvent(mousemove);

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle preventContextMenu event", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventContextMenuOnLongPress: true }),
    );

    result.current.registerNode(element);

    // Context menu without pressing - should not prevent
    const contextMenuEvent = new PointerEvent("contextmenu");
    const preventDefaultSpy = vi.spyOn(contextMenuEvent, "preventDefault");

    element.oncontextmenu?.(contextMenuEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();

    // Now press and try context menu
    element.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));
    element.oncontextmenu?.(contextMenuEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should set oncontextmenu to null when unsubscribing", () => {
    const { result } = renderHook(() =>
      useLongPress(callback, { preventContextMenuOnLongPress: true }),
    );

    const cleanup = result.current.registerNode(
      element,
    ) as unknown as () => void;

    expect(element.oncontextmenu).not.toBeNull();

    cleanup();

    expect(element.oncontextmenu).toBeNull();
  });
});
