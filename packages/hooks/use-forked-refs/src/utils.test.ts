import { renderHook } from "@testing-library/react";
import { useRef, type RefObject } from "react";
import { describe, expect, it, vi } from "vitest";
import { handleRef } from "./utils.ts";

describe("utils", () => {
  describe("handleRef", () => {
    describe("callback refs", () => {
      it("should call function ref with instance", () => {
        const callbackRef = vi.fn();
        const element = document.createElement("div");

        handleRef(callbackRef, element);

        expect(callbackRef).toHaveBeenCalledWith(element);
      });

      it("should call function ref with null", () => {
        const callbackRef = vi.fn();

        handleRef(callbackRef, null);

        expect(callbackRef).toHaveBeenCalledWith(null);
      });

      it("should handle function ref that throws", () => {
        const throwingRef = vi.fn().mockImplementation(() => {
          throw new Error("Callback error");
        });

        const element = document.createElement("div");

        expect(() => {
          handleRef(throwingRef, element);
        }).toThrow("Callback error");

        expect(throwingRef).toHaveBeenCalledWith(element);
      });
    });

    describe("ref objects", () => {
      it("should set current property of ref object", () => {
        const { result } = renderHook(() => useRef<HTMLDivElement>(null));
        const element = document.createElement("div");

        handleRef(result.current, element);

        expect(result.current.current).toBe(element);
      });

      it("should set current property to null", () => {
        const { result } = renderHook(() => useRef<HTMLDivElement>(null));
        const element = document.createElement("div");

        // First set to element
        handleRef(result.current, element);
        expect(result.current.current).toBe(element);

        // Then set to null
        handleRef(result.current, null);
        expect(result.current.current).toBe(null);
      });

      it("should not modify ref object without current property", () => {
        const invalidRef = {} as React.RefObject<HTMLDivElement>;
        const element = document.createElement("div");

        expect(() => {
          handleRef(invalidRef, element);
        }).not.toThrow();

        // Should not add current property since it doesn't exist
        expect(invalidRef.current).toBeUndefined();
      });

      it("should handle readonly ref objects", () => {
        const readonlyRef = Object.freeze({
          current: null,
        }) as unknown as React.RefObject<HTMLDivElement>;

        const element = document.createElement("div");

        expect(() => {
          handleRef(readonlyRef, element);
        }).toThrow();
      });
    });

    describe("invalid refs", () => {
      it("should handle null ref", () => {
        const element = document.createElement("div");

        expect(() => {
          handleRef(null, element);
        }).not.toThrow();
      });

      it("should handle undefined ref", () => {
        const element = document.createElement("div");

        expect(() => {
          handleRef(undefined as never, element);
        }).not.toThrow();
      });

      it("should handle string ref (legacy)", () => {
        const element = document.createElement("div");

        expect(() => {
          handleRef("stringRef" as never, element);
        }).not.toThrow();
      });

      it("should handle number ref", () => {
        const element = document.createElement("div");

        expect(() => {
          handleRef(123 as never, element);
        }).not.toThrow();
      });

      it("should handle boolean ref", () => {
        const element = document.createElement("div");

        expect(() => {
          handleRef(true as never, element);
        }).not.toThrow();
      });

      it("should handle object without current property", () => {
        const objectRef = { notCurrent: null } as unknown as RefObject<unknown>;
        const element = document.createElement("div");

        expect(() => {
          handleRef(objectRef, element);
        }).not.toThrow();

        expect(objectRef?.current).toBeUndefined();
      });
    });

    describe("edge cases", () => {
      it("should handle ref object with getter/setter", () => {
        let storedValue: HTMLDivElement | null = null;
        const refWithGetterSetter = {
          get current() {
            return storedValue;
          },
          set current(value) {
            storedValue = value;
          },
        } as React.RefObject<HTMLDivElement>;

        const element = document.createElement("div");

        handleRef(refWithGetterSetter, element);

        expect(refWithGetterSetter.current).toBe(element);
        expect(storedValue).toBe(element);
      });

      it("should handle ref object with current property that throws on set", () => {
        const refWithThrowingSetter = {
          get current() {
            return null;
          },
          set current(_) {
            throw new Error("Cannot set current");
          },
        } as unknown as RefObject<HTMLDivElement>;

        const element = document.createElement("div");

        expect(() => {
          handleRef(refWithThrowingSetter, element);
        }).toThrow("Cannot set current");
      });

      it("should handle function that is also an object with current property", () => {
        const functionWithCurrent = vi.fn() as ReturnType<typeof vi.fn> & {
          current: unknown;
        };

        functionWithCurrent.current = null;
        const element = document.createElement("div");

        handleRef(functionWithCurrent, element);

        // Should call as function, not set current property
        expect(functionWithCurrent).toHaveBeenCalledWith(element);
        expect(functionWithCurrent.current).toBe(null);
      });

      it("should handle different element types", () => {
        const { result } = renderHook(() => useRef<HTMLElement>(null));
        const divElement = document.createElement("div");
        const spanElement = document.createElement("span");

        handleRef(result.current, divElement);
        expect(result.current.current).toBe(divElement);

        handleRef(result.current, spanElement);
        expect(result.current.current).toBe(spanElement);
      });

      it("should handle non-DOM elements", () => {
        const { result } = renderHook(() => useRef(null));
        const customObject = { type: "custom" };

        handleRef(result.current, customObject);
        expect(result.current.current).toBe(customObject);
      });
    });
  });
});
