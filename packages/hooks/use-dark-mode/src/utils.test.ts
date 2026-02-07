import { describe, expect, it, vi } from "vitest";
import { addClassName, removeClassName } from "./utils.ts";

describe("utils", () => {
  describe("addClassName", () => {
    it("should add class when not present", () => {
      const mockElement = {
        classList: {
          contains: vi.fn().mockReturnValue(false),
          add: vi.fn(),
        },
      } as unknown as HTMLElement;

      addClassName(mockElement, "test-class");

      expect(mockElement.classList.contains).toHaveBeenCalledWith("test-class");
      expect(mockElement.classList.add).toHaveBeenCalledWith("test-class");
    });

    it("should not add class when already present", () => {
      const mockElement = {
        classList: {
          contains: vi.fn().mockReturnValue(true),
          add: vi.fn(),
        },
      } as unknown as HTMLElement;

      addClassName(mockElement, "test-class");

      expect(mockElement.classList.contains).toHaveBeenCalledWith("test-class");
      expect(mockElement.classList.add).not.toHaveBeenCalled();
    });

    it("should handle different class names", () => {
      const mockElement = {
        classList: {
          contains: vi.fn().mockReturnValue(false),
          add: vi.fn(),
        },
      } as unknown as HTMLElement;

      addClassName(mockElement, "dark-mode");
      addClassName(mockElement, "custom-theme");

      expect(mockElement.classList.add).toHaveBeenCalledWith("dark-mode");
      expect(mockElement.classList.add).toHaveBeenCalledWith("custom-theme");
    });
  });

  describe("removeClassName", () => {
    it("should remove class from element", () => {
      const mockElement = {
        classList: {
          remove: vi.fn(),
        },
      } as unknown as HTMLElement;

      removeClassName(mockElement, "test-class");

      expect(mockElement.classList.remove).toHaveBeenCalledWith("test-class");
    });

    it("should handle different class names", () => {
      const mockElement = {
        classList: {
          remove: vi.fn(),
        },
      } as unknown as HTMLElement;

      removeClassName(mockElement, "dark-mode");
      removeClassName(mockElement, "custom-theme");

      expect(mockElement.classList.remove).toHaveBeenCalledWith("dark-mode");
      expect(mockElement.classList.remove).toHaveBeenCalledWith("custom-theme");
    });

    it("should not throw when removing non-existent class", () => {
      const mockElement = {
        classList: {
          remove: vi.fn(),
        },
      } as unknown as HTMLElement;

      expect(() => {
        removeClassName(mockElement, "non-existent");
      }).not.toThrow();

      expect(mockElement.classList.remove).toHaveBeenCalledWith("non-existent");
    });
  });
});
