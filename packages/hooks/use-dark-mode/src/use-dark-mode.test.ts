import { act, renderHook } from "@testing-library/react";
import type * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDarkMode } from "./use-dark-mode.ts";

vi.mock("@utilityjs/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue([false]),
}));

vi.mock("@utilityjs/use-persisted-state", () => ({
  usePersistedState: vi.fn().mockReturnValue([undefined, vi.fn()]),
}));

const mockUseMediaQuery = vi.mocked(
  await import("@utilityjs/use-media-query"),
).useMediaQuery;

const mockUsePersistedState = vi.mocked(
  await import("@utilityjs/use-persisted-state"),
).usePersistedState;

describe("useDarkMode", () => {
  let mockSetState: React.Dispatch<unknown>;

  beforeEach(() => {
    mockSetState = vi.fn() as React.Dispatch<unknown>;
    mockUseMediaQuery.mockReturnValue([false]);
    mockUsePersistedState.mockReturnValue([undefined, mockSetState]);
    document.body.classList.remove("dark-mode");
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.className = "";
  });

  describe("initialization", () => {
    it("should use system preference when no stored state", () => {
      mockUseMediaQuery.mockReturnValue([true]);
      mockUsePersistedState.mockReturnValue([undefined, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(true);
    });

    it("should use stored state over system preference", () => {
      mockUseMediaQuery.mockReturnValue([true]);
      mockUsePersistedState.mockReturnValue([false, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(false);
    });

    it("should default to false when no preference and no stored state", () => {
      mockUseMediaQuery.mockReturnValue([false]);
      mockUsePersistedState.mockReturnValue([undefined, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      expect(result.current.isDarkMode).toBe(false);
    });
  });

  describe("configuration options", () => {
    it("should use custom storage key", () => {
      renderHook(() => useDarkMode({ storageKey: "my-key" }));

      expect(mockUsePersistedState).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ name: "my-key" }),
      );
    });

    it("should use custom storage", () => {
      const customStorage = { getItem: vi.fn(), setItem: vi.fn() };

      renderHook(() => useDarkMode({ storage: customStorage }));

      expect(mockUsePersistedState).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ storage: customStorage }),
      );
    });

    it("should use default storage key", () => {
      renderHook(() => useDarkMode());

      expect(mockUsePersistedState).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ name: "utilityjs-dark-mode" }),
      );
    });

    it("should pass initialState to usePersistedState", () => {
      renderHook(() => useDarkMode({ initialState: true }));

      expect(mockUsePersistedState).toHaveBeenCalledWith(
        true,
        expect.any(Object),
      );
    });
  });

  describe("CSS class management", () => {
    it("should add dark-mode class when dark mode is on", () => {
      mockUsePersistedState.mockReturnValue([true, mockSetState]);

      renderHook(() => useDarkMode());

      expect(document.body.classList.contains("dark-mode")).toBe(true);
    });

    it("should not have dark-mode class when dark mode is off", () => {
      mockUsePersistedState.mockReturnValue([false, mockSetState]);

      renderHook(() => useDarkMode());

      expect(document.body.classList.contains("dark-mode")).toBe(false);
    });

    it("should use custom toggle class name", () => {
      mockUsePersistedState.mockReturnValue([true, mockSetState]);

      renderHook(() => useDarkMode({ toggleClassName: "dark-theme" }));

      expect(document.body.classList.contains("dark-theme")).toBe(true);
    });
  });

  describe("control functions", () => {
    it("should enable dark mode", () => {
      mockUsePersistedState.mockReturnValue([false, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.enable();
      });

      expect(mockSetState).toHaveBeenCalledWith(true);
    });

    it("should disable dark mode", () => {
      mockUsePersistedState.mockReturnValue([true, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.disable();
      });

      expect(mockSetState).toHaveBeenCalledWith(false);
    });

    it("should toggle from false to true", () => {
      mockUsePersistedState.mockReturnValue([false, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggle();
      });

      expect(mockSetState).toHaveBeenCalledWith(true);
    });

    it("should toggle from true to false", () => {
      mockUsePersistedState.mockReturnValue([true, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggle();
      });

      expect(mockSetState).toHaveBeenCalledWith(false);
    });

    it("should toggle based on system preference when no stored state", () => {
      mockUseMediaQuery.mockReturnValue([true]);
      mockUsePersistedState.mockReturnValue([undefined, mockSetState]);

      const { result } = renderHook(() => useDarkMode());

      act(() => {
        result.current.toggle();
      });

      expect(mockSetState).toHaveBeenCalledWith(false);
    });
  });

  describe("media query integration", () => {
    it("should query prefers-color-scheme: dark", () => {
      renderHook(() => useDarkMode());

      expect(mockUseMediaQuery).toHaveBeenCalledWith(
        "(prefers-color-scheme: dark)",
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty options object", () => {
      const { result } = renderHook(() => useDarkMode({}));

      expect(result.current).toEqual(
        expect.objectContaining({
          isDarkMode: expect.any(Boolean) as boolean,
          enable: expect.any(Function) as () => void,
          disable: expect.any(Function) as () => void,
          toggle: expect.any(Function) as () => void,
        }),
      );
    });

    it("should handle no options", () => {
      const { result } = renderHook(() => useDarkMode());

      expect(typeof result.current.isDarkMode).toBe("boolean");
      expect(typeof result.current.enable).toBe("function");
      expect(typeof result.current.disable).toBe("function");
      expect(typeof result.current.toggle).toBe("function");
    });
  });
});
