import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useEventListener } from "./use-event-listener.ts";

vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
}));

describe("useEventListener", () => {
  let element: HTMLDivElement;
  let handler: (ev: MouseEvent) => void;

  beforeEach(() => {
    element = document.createElement("div");
    handler = vi.fn<(ev: MouseEvent) => void>();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add event listener to element", () => {
    const spy = vi.spyOn(element, "addEventListener");

    renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
      }),
    );

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), undefined);
  });

  it("should remove event listener on unmount", () => {
    const spy = vi.spyOn(element, "removeEventListener");

    const { unmount } = renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
      }),
    );

    unmount();

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), undefined);
  });

  it("should call handler when event fires", () => {
    renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
      }),
    );

    element.dispatchEvent(new MouseEvent("click"));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not add listener when shouldAttach is false", () => {
    const spy = vi.spyOn(element, "addEventListener");

    renderHook(() =>
      useEventListener({ target: element, eventType: "click", handler }, false),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it("should handle null target", () => {
    expect(() => {
      renderHook(() =>
        useEventListener({
          target: null,
          eventType: "click",
          handler,
        }),
      );
    }).not.toThrow();
  });

  it("should work with ref objects", () => {
    const spy = vi.spyOn(element, "addEventListener");

    renderHook(() =>
      useEventListener({
        target: { current: element },
        eventType: "click",
        handler,
      }),
    );

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), undefined);
  });

  it("should handle ref with null current", () => {
    const spy = vi.spyOn(element, "addEventListener");

    renderHook(() =>
      useEventListener({
        target: { current: null } as unknown as React.RefObject<HTMLElement>,
        eventType: "click",
        handler,
      }),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it("should pass boolean options", () => {
    const spy = vi.spyOn(element, "addEventListener");

    renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
        options: true,
      }),
    );

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), true);
  });

  it("should pass object options when supported", () => {
    const spy = vi.spyOn(element, "addEventListener");
    const options = { passive: true, capture: false };

    renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
        options,
      }),
    );

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), options);
  });

  it("should not call handler after unmount", () => {
    const { unmount } = renderHook(() =>
      useEventListener({
        target: element,
        eventType: "click",
        handler,
      }),
    );

    unmount();

    element.dispatchEvent(new MouseEvent("click"));

    expect(handler).not.toHaveBeenCalled();
  });

  it("should update listeners when target changes", () => {
    const element2 = document.createElement("div");
    const spy1 = vi.spyOn(element, "removeEventListener");
    const spy2 = vi.spyOn(element2, "addEventListener");

    const { rerender } = renderHook(
      ({ target }) =>
        useEventListener({
          target,
          eventType: "click",
          handler,
        }),
      { initialProps: { target: element as HTMLElement } },
    );

    rerender({ target: element2 });

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it("should update listeners when event type changes", () => {
    const addSpy = vi.spyOn(element, "addEventListener");
    const removeSpy = vi.spyOn(element, "removeEventListener");

    const { rerender } = renderHook(
      ({ eventType }: { eventType: "click" | "mousedown" }) =>
        useEventListener({
          target: element,
          eventType,
          handler,
        }),
      { initialProps: { eventType: "click" as "click" | "mousedown" } },
    );

    rerender({ eventType: "mousedown" });

    expect(removeSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      undefined,
    );
    expect(addSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
      undefined,
    );
  });

  it("should work with window target", () => {
    const spy = vi.spyOn(window, "addEventListener");
    const resizeHandler = vi.fn<(ev: UIEvent) => void>();

    renderHook(() =>
      useEventListener({
        target: window,
        eventType: "resize",
        handler: resizeHandler,
      }),
    );

    expect(spy).toHaveBeenCalledWith("resize", expect.any(Function), undefined);

    spy.mockRestore();
  });

  it("should work with document target", () => {
    const spy = vi.spyOn(document, "addEventListener");

    renderHook(() =>
      useEventListener({
        target: document,
        eventType: "click",
        handler,
      }),
    );

    expect(spy).toHaveBeenCalledWith("click", expect.any(Function), undefined);

    spy.mockRestore();
  });

  it("should add listener when shouldAttach changes from false to true", () => {
    const spy = vi.spyOn(element, "addEventListener");

    const { rerender } = renderHook(
      ({ shouldAttach }) =>
        useEventListener(
          { target: element, eventType: "click", handler },
          shouldAttach,
        ),
      { initialProps: { shouldAttach: false } },
    );

    expect(spy).not.toHaveBeenCalled();

    rerender({ shouldAttach: true });

    expect(spy).toHaveBeenCalled();
  });
});
