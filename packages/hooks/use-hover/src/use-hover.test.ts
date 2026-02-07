import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useHover } from "./use-hover.ts";

describe("useHover", () => {
  it("should return initial state with isHovered false", () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);
    expect(typeof result.current.setIsHovered).toBe("function");
    expect(typeof result.current.registerRef).toBe("function");
  });

  it("should allow manual control of hover state", () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);

    act(() => {
      result.current.setIsHovered(true);
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.setIsHovered(false);
    });
    expect(result.current.isHovered).toBe(false);
  });

  it("should set isHovered to true on mouseenter event", () => {
    const { result } = renderHook(() => useHover());
    const mockElement = document.createElement("div");

    result.current.registerRef(mockElement);

    expect(result.current.isHovered).toBe(false);

    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(true);
  });

  it("should set isHovered to false on mouseleave event", () => {
    const { result } = renderHook(() => useHover());
    const mockElement = document.createElement("div");

    result.current.registerRef(mockElement);

    // First trigger mouseenter
    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(true);

    // Then trigger mouseleave
    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(false);
  });

  it("should handle multiple hover cycles", () => {
    const { result } = renderHook(() => useHover());
    const mockElement = document.createElement("div");

    result.current.registerRef(mockElement);

    // First cycle
    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(false);

    // Second cycle
    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseenter", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(true);

    act(() => {
      mockElement.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: true }),
      );
    });
    expect(result.current.isHovered).toBe(false);
  });

  it("should clean up event listeners when element is unregistered", () => {
    const { result } = renderHook(() => useHover());
    const mockElement = document.createElement("div");
    const addEventListenerSpy = vi.spyOn(mockElement, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(mockElement, "removeEventListener");

    result.current.registerRef(mockElement);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function),
    );

    // Unregister by passing null
    result.current.registerRef(null);

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseenter",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mouseleave",
      expect.any(Function),
    );
  });

  it("should handle registering different elements", () => {
    const { result } = renderHook(() => useHover());
    const element1 = document.createElement("div");
    const element2 = document.createElement("span");

    // Register first element
    result.current.registerRef(element1);
    act(() => {
      element1.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
    });
    expect(result.current.isHovered).toBe(true);

    // Register second element (should clean up first)
    result.current.registerRef(element2);

    // First element events should no longer affect state
    act(() => {
      element1.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    });
    expect(result.current.isHovered).toBe(true); // Should remain true

    // Second element events should work
    act(() => {
      element2.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    });
    expect(result.current.isHovered).toBe(false);
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => useHover());

    const initialSetIsHovered = result.current.setIsHovered;
    const initialRegisterRef = result.current.registerRef;

    rerender();

    expect(result.current.setIsHovered).toBe(initialSetIsHovered);
    expect(result.current.registerRef).toBe(initialRegisterRef);
  });

  it("should handle null element registration gracefully", () => {
    const { result } = renderHook(() => useHover());

    expect(() => result.current.registerRef(null)).not.toThrow();
    expect(result.current.isHovered).toBe(false);
  });
});
