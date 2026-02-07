import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRegisterNodeRef, type Callback } from "./use-register-node-ref.ts";

// Mock the dependency
vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: vi.fn((value: unknown) => ({ current: value })),
}));

describe("useRegisterNodeRef", () => {
  let mockElement: HTMLElement;
  let callback: Callback<HTMLElement>;
  let cleanup: ReturnType<Callback<HTMLElement>>;

  beforeEach(() => {
    mockElement = document.createElement("div");
    cleanup = vi.fn();
    callback = vi.fn(() => cleanup);
  });

  it("should call callback when node is registered", () => {
    const { result } = renderHook(() => useRegisterNodeRef(callback));

    result.current(mockElement);

    expect(callback).toHaveBeenCalledWith(mockElement);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when node is null", () => {
    const { result } = renderHook(() => useRegisterNodeRef(callback));

    result.current(null);

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call cleanup function when node changes", () => {
    const { result } = renderHook(() => useRegisterNodeRef(callback));

    // Register first node
    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(1);

    // Register second node
    const secondElement = document.createElement("div");

    result.current(secondElement);

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(secondElement);
  });

  it("should call cleanup function when node is set to null", () => {
    const { result } = renderHook(() => useRegisterNodeRef(callback));

    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(1);

    result.current(null);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("should handle callback without cleanup function", () => {
    const callbackWithoutCleanup = vi.fn();
    const { result } = renderHook(() =>
      useRegisterNodeRef(callbackWithoutCleanup),
    );

    result.current(mockElement);
    expect(callbackWithoutCleanup).toHaveBeenCalledWith(mockElement);

    // Should not throw when changing nodes
    const secondElement = document.createElement("span");

    expect(() => result.current(secondElement)).not.toThrow();
    expect(callbackWithoutCleanup).toHaveBeenCalledTimes(2);
  });

  it("should handle callback returning undefined", () => {
    const callbackReturningUndefined = vi.fn(() => undefined);
    const { result } = renderHook(() =>
      useRegisterNodeRef(callbackReturningUndefined),
    );

    result.current(mockElement);
    expect(callbackReturningUndefined).toHaveBeenCalledWith(mockElement);

    // Should not throw when changing nodes
    expect(() => result.current(null)).not.toThrow();
  });

  it("should re-register callback when dependencies change", () => {
    let dep = "initial";
    const { result, rerender } = renderHook(() =>
      useRegisterNodeRef(callback, [dep]),
    );

    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(1);

    // Change dependency
    dep = "changed";
    rerender();

    // Register same node again - should trigger callback due to dep change
    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should call callback again when same node is re-registered", () => {
    const dep = "constant";
    const { result } = renderHook(() => useRegisterNodeRef(callback, [dep]));

    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(1);

    // Re-registering same node still triggers callback (cleanup + re-register)
    result.current(mockElement);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should handle multiple rapid node changes", () => {
    const { result } = renderHook(() => useRegisterNodeRef(callback));

    const elements = [
      document.createElement("div"),
      document.createElement("span"),
      document.createElement("p"),
    ];

    elements.forEach((element, index) => {
      result.current(element);
      expect(callback).toHaveBeenCalledTimes(index + 1);
      expect(callback).toHaveBeenLastCalledWith(element);
    });

    // Cleanup should be called for each change except the last
    expect(cleanup).toHaveBeenCalledTimes(elements.length - 1);
  });

  it("should work with different HTML element types", () => {
    const buttonCallback = vi.fn();
    const inputCallback = vi.fn();

    const { result: buttonResult } = renderHook(() =>
      useRegisterNodeRef<HTMLButtonElement>(buttonCallback),
    );

    const { result: inputResult } = renderHook(() =>
      useRegisterNodeRef<HTMLInputElement>(inputCallback),
    );

    const button = document.createElement("button");
    const input = document.createElement("input");

    buttonResult.current(button);
    inputResult.current(input);

    expect(buttonCallback).toHaveBeenCalledWith(button);
    expect(inputCallback).toHaveBeenCalledWith(input);
  });

  it("should handle cleanup function that throws", () => {
    const throwingCleanup = vi.fn(() => {
      throw new Error("Cleanup error");
    });

    const callbackWithThrowingCleanup = vi.fn(() => throwingCleanup);

    const { result } = renderHook(() =>
      useRegisterNodeRef(callbackWithThrowingCleanup),
    );

    result.current(mockElement);
    expect(callbackWithThrowingCleanup).toHaveBeenCalledTimes(1);

    // Should handle cleanup error gracefully
    expect(() => result.current(null)).toThrow("Cleanup error");
    expect(throwingCleanup).toHaveBeenCalledTimes(1);
  });

  it("should maintain stable reference when dependencies don't change", () => {
    const { result, rerender } = renderHook(() =>
      useRegisterNodeRef(callback, ["stable"]),
    );

    const firstRef = result.current;

    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it("should create new reference when dependencies change", () => {
    let dep = "initial";
    const { result, rerender } = renderHook(() =>
      useRegisterNodeRef(callback, [dep]),
    );

    const firstRef = result.current;

    dep = "changed";
    rerender();

    const secondRef = result.current;

    expect(firstRef).not.toBe(secondRef);
  });

  it("should handle empty dependencies array", () => {
    const { result, rerender } = renderHook(() =>
      useRegisterNodeRef(callback, []),
    );

    const firstRef = result.current;

    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it("should handle complex cleanup scenarios", () => {
    const cleanupCalls: string[] = [];

    const createCallback = (id: string) =>
      vi.fn(() => {
        return () => {
          cleanupCalls.push(id);
        };
      });

    const callback1 = createCallback("callback1");

    const { result } = renderHook(() => useRegisterNodeRef(callback1));

    // Register with first callback
    result.current(mockElement);
    expect(callback1).toHaveBeenCalledTimes(1);

    // Set to null triggers cleanup
    result.current(null);
    expect(cleanupCalls).toContain("callback1");
  });
});
