import { act, renderHook } from "@testing-library/react";
import { useRef, type Ref } from "react";
import { describe, expect, it, vi } from "vitest";
import { useForkedRefs } from "./use-forked-refs.ts";

describe("useForkedRefs", () => {
  describe("basic functionality", () => {
    it("should return a ref callback function", () => {
      const { result } = renderHook(() => useForkedRefs());

      expect(typeof result.current).toBe("function");
    });

    it("should handle single ref object", () => {
      const { result } = renderHook(() => {
        const ref = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(ref);

        return { ref, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.ref.current).toBe(element);
    });

    it("should handle single callback ref", () => {
      const callbackRef = vi.fn();
      const { result } = renderHook(() => useForkedRefs(callbackRef));

      const element = document.createElement("div");

      act(() => {
        result.current(element);
      });

      expect(callbackRef).toHaveBeenCalledWith(element);
    });

    it("should handle multiple ref objects", () => {
      const { result } = renderHook(() => {
        const ref1 = useRef<HTMLDivElement>(null);
        const ref2 = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(ref1, ref2);

        return { ref1, ref2, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.ref1.current).toBe(element);
      expect(result.current.ref2.current).toBe(element);
    });

    it("should handle multiple callback refs", () => {
      const callbackRef1 = vi.fn();
      const callbackRef2 = vi.fn();
      const { result } = renderHook(() =>
        useForkedRefs(callbackRef1, callbackRef2),
      );

      const element = document.createElement("div");

      act(() => {
        result.current(element);
      });

      expect(callbackRef1).toHaveBeenCalledWith(element);
      expect(callbackRef2).toHaveBeenCalledWith(element);
    });

    it("should handle mixed ref types", () => {
      const callbackRef = vi.fn();
      const { result } = renderHook(() => {
        const refObject = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(refObject, callbackRef);

        return { refObject, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.refObject.current).toBe(element);
      expect(callbackRef).toHaveBeenCalledWith(element);
    });
  });

  describe("undefined and null refs", () => {
    it("should handle undefined refs", () => {
      const { result } = renderHook(() => useForkedRefs(undefined, undefined));

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).not.toThrow();
    });

    it("should handle mixed undefined and valid refs", () => {
      const callbackRef = vi.fn();
      const { result } = renderHook(() => {
        const refObject = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(refObject, undefined, callbackRef);

        return { refObject, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.refObject.current).toBe(element);
      expect(callbackRef).toHaveBeenCalledWith(element);
    });

    it("should handle null values", () => {
      const { result } = renderHook(() => useForkedRefs(null));

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).not.toThrow();
    });
  });

  describe("ref updates", () => {
    it("should update all refs when called with new element", () => {
      const callbackRef = vi.fn();
      const { result } = renderHook(() => {
        const refObject = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(refObject, callbackRef);

        return { refObject, forkedRef };
      });

      const element1 = document.createElement("div");
      const element2 = document.createElement("span");

      act(() => {
        result.current.forkedRef(element1);
      });

      expect(result.current.refObject.current).toBe(element1);
      expect(callbackRef).toHaveBeenCalledWith(element1);

      act(() => {
        result.current.forkedRef(element2);
      });

      expect(result.current.refObject.current).toBe(element2);
      expect(callbackRef).toHaveBeenCalledWith(element2);
    });

    it("should handle null updates", () => {
      const callbackRef = vi.fn();
      const { result } = renderHook(() => {
        const refObject = useRef<HTMLDivElement>(null);
        const forkedRef = useForkedRefs(refObject, callbackRef);

        return { refObject, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.refObject.current).toBe(element);
      expect(callbackRef).toHaveBeenCalledWith(element);

      act(() => {
        result.current.forkedRef(null);
      });

      expect(result.current.refObject.current).toBe(null);
      expect(callbackRef).toHaveBeenCalledWith(null);
    });
  });

  describe("ref stability", () => {
    it("should return stable ref callback when refs don't change", () => {
      const callbackRef = vi.fn();
      const { result, rerender } = renderHook(() => {
        const refObject = useRef<HTMLDivElement>(null);

        return useForkedRefs(refObject, callbackRef);
      });

      const firstCallback = result.current;

      rerender();
      const secondCallback = result.current;

      expect(firstCallback).toBe(secondCallback);
    });

    it("should return new ref callback when refs change", () => {
      const callbackRef1 = vi.fn();
      const callbackRef2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ callback }) => useForkedRefs(callback),
        { initialProps: { callback: callbackRef1 } },
      );

      const firstCallback = result.current;

      rerender({ callback: callbackRef2 });

      const secondCallback = result.current;

      expect(firstCallback).not.toBe(secondCallback);
    });
  });

  describe("error handling", () => {
    it("should handle callback ref that throws", () => {
      const throwingRef = vi.fn().mockImplementation(() => {
        throw new Error("Ref error");
      });

      const normalRef = vi.fn();

      const { result } = renderHook(() =>
        useForkedRefs(throwingRef, normalRef),
      );

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).toThrow("Ref error");

      // Normal ref should still be called before the error
      expect(throwingRef).toHaveBeenCalledWith(element);
    });

    it("should handle invalid ref objects gracefully", () => {
      const invalidRef = { notCurrent: null } as unknown as Ref<unknown>;
      const validRef = vi.fn();

      const { result } = renderHook(() => useForkedRefs(invalidRef, validRef));

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).not.toThrow();

      expect(validRef).toHaveBeenCalledWith(element);
    });
  });

  describe("type safety", () => {
    it("should work with different element types", () => {
      const { result } = renderHook(() => {
        const divRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);

        // This should work with common base type
        const forkedRef = useForkedRefs(divRef, inputRef);

        return { divRef, inputRef, forkedRef };
      });

      const element = document.createElement("div");

      act(() => {
        result.current.forkedRef(element);
      });

      expect(result.current.divRef.current).toBe(element);
      expect(result.current.inputRef.current).toBe(element);
    });
  });

  describe("edge cases", () => {
    it("should handle empty refs array", () => {
      const { result } = renderHook(() => useForkedRefs());

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).not.toThrow();
    });

    it("should handle large number of refs", () => {
      const refs = Array.from({ length: 100 }, () => vi.fn());
      const { result } = renderHook(() => useForkedRefs(...refs));

      const element = document.createElement("div");

      act(() => {
        result.current(element);
      });

      refs.forEach(ref => {
        expect(ref).toHaveBeenCalledWith(element);
      });
    });

    it("should handle refs that are functions but not valid callbacks", () => {
      const notARef = "not a ref" as unknown as Ref<unknown>;
      const validRef = vi.fn();

      const { result } = renderHook(() => useForkedRefs(notARef, validRef));

      const element = document.createElement("div");

      expect(() => {
        act(() => {
          result.current(element);
        });
      }).not.toThrow();

      expect(validRef).toHaveBeenCalledWith(element);
    });
  });
});
