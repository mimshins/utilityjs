import { act, renderHook } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import { useControlledProp } from "./use-controlled-prop.ts";

describe("useControlledProp", () => {
  let consoleErrorSpy: Mock;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("controlled mode", () => {
    it("should return controlled value when provided", () => {
      const { result } = renderHook(() =>
        useControlledProp("controlled", "default", "fallback"),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe("controlled");
      expect(isControlled).toBe(true);
    });

    it("should update when controlled value changes", () => {
      const { result, rerender } = renderHook(
        ({ controlled }) =>
          useControlledProp(controlled, "default", "fallback"),
        { initialProps: { controlled: "initial" } },
      );

      expect(result.current[0]).toBe("initial");

      rerender({ controlled: "updated" });
      expect(result.current[0]).toBe("updated");
    });

    it("should not call setter in controlled mode", () => {
      const { result } = renderHook(() =>
        useControlledProp("controlled", "default", "fallback"),
      );

      const [, setUncontrolledValue] = result.current;

      act(() => {
        setUncontrolledValue("new value");
      });

      expect(result.current[0]).toBe("controlled");
    });

    it("should warn when switching from controlled to uncontrolled", () => {
      const { rerender } = renderHook(
        ({ controlled }) =>
          useControlledProp(controlled, "default", "fallback"),
        { initialProps: { controlled: "controlled" } },
      );

      rerender({ controlled: undefined as never });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "A component is changing the controlled state of a prop to be uncontrolled",
        ),
      );
    });
  });

  describe("uncontrolled mode", () => {
    it("should return default value when controlled is undefined", () => {
      const { result } = renderHook(() =>
        useControlledProp(undefined, "default", "fallback"),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe("default");
      expect(isControlled).toBe(false);
    });

    it("should return fallback when both controlled and default are undefined", () => {
      const { result } = renderHook(() =>
        useControlledProp(undefined, undefined, "fallback"),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe("fallback");
      expect(isControlled).toBe(false);
    });

    it("should update value when setter is called", () => {
      const { result } = renderHook(() =>
        useControlledProp(undefined, "default", "fallback"),
      );

      const [, setUncontrolledValue] = result.current;

      act(() => {
        setUncontrolledValue("new value");
      });

      expect(result.current[0]).toBe("new value");
    });

    it("should support function updates", () => {
      const { result } = renderHook(() =>
        useControlledProp(undefined, "default", "fallback"),
      );

      const [, setUncontrolledValue] = result.current;

      act(() => {
        setUncontrolledValue(prev => `${prev}-updated`);
      });

      expect(result.current[0]).toBe("default-updated");
    });

    it("should warn when switching from uncontrolled to controlled", () => {
      const { rerender } = renderHook(
        ({ controlled }) =>
          useControlledProp(controlled, "default", "fallback"),
        { initialProps: { controlled: undefined } },
      );

      rerender({ controlled: "controlled" as never });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "A component is changing the uncontrolled state of a prop to be controlled",
        ),
      );
    });

    it("should warn when default value changes", () => {
      const { rerender } = renderHook(
        ({ defaultValue }) => useControlledProp(undefined, defaultValue, []),
        { initialProps: { defaultValue: [1, 2, 3] } },
      );

      rerender({ defaultValue: [1, 2, 4] });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "A component is changing the defaultValue state of an uncontrolled prop",
        ),
      );
    });

    it("should not warn when default value changes to equal value", () => {
      const { rerender } = renderHook(
        ({ defaultValue }) =>
          useControlledProp(undefined, defaultValue, "fallback" as never),
        { initialProps: { defaultValue: [1, 2, 3] } },
      );

      rerender({ defaultValue: [1, 2, 3] });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should warn when all values are undefined", () => {
      renderHook(() => useControlledProp(undefined, undefined, undefined));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("The values you provide are `undefined`!"),
      );
    });

    it("should handle null values", () => {
      const { result } = renderHook(() =>
        useControlledProp(null, undefined, "fallback"),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe(null);
      expect(isControlled).toBe(true);
    });

    it("should handle zero values", () => {
      const { result } = renderHook(() =>
        useControlledProp(0, undefined, "fallback" as never),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe(0);
      expect(isControlled).toBe(true);
    });

    it("should handle false values", () => {
      const { result } = renderHook(() =>
        useControlledProp(false, undefined, "fallback" as never),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe(false);
      expect(isControlled).toBe(true);
    });

    it("should handle empty string values", () => {
      const { result } = renderHook(() =>
        useControlledProp("", undefined, "fallback"),
      );

      const [value, , isControlled] = result.current;

      expect(value).toBe("");
      expect(isControlled).toBe(true);
    });
  });

  describe("production mode", () => {
    it("should not warn in production mode", () => {
      const originalEnv = process.env["NODE_ENV"];

      process.env["NODE_ENV"] = "production";

      try {
        const { rerender } = renderHook(
          ({ controlled }) =>
            useControlledProp(controlled, "default", "fallback"),
          { initialProps: { controlled: "controlled" } },
        );

        rerender({ controlled: undefined as never });

        expect(consoleErrorSpy).not.toHaveBeenCalled();
      } finally {
        process.env["NODE_ENV"] = originalEnv;
      }
    });
  });

  describe("array equality", () => {
    it("should detect array changes correctly", () => {
      const { rerender } = renderHook(
        ({ defaultValue }) => useControlledProp(undefined, defaultValue, []),
        { initialProps: { defaultValue: [1, 2, 3] } },
      );

      rerender({ defaultValue: [1, 2, 4] });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "A component is changing the defaultValue state of an uncontrolled prop",
        ),
      );
    });

    it("should not warn for equal arrays", () => {
      const { rerender } = renderHook(
        ({ defaultValue }) => useControlledProp(undefined, defaultValue, []),
        { initialProps: { defaultValue: [1, 2, 3] } },
      );

      rerender({ defaultValue: [1, 2, 3] });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should detect different array lengths", () => {
      const { rerender } = renderHook(
        ({ defaultValue }) => useControlledProp(undefined, defaultValue, []),
        { initialProps: { defaultValue: [1, 2, 3] } },
      );

      rerender({ defaultValue: [1, 2] });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "A component is changing the defaultValue state of an uncontrolled prop",
        ),
      );
    });
  });
});
