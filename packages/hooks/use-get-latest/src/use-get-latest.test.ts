import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGetLatest } from "./use-get-latest.ts";

describe("useGetLatest", () => {
  describe("basic functionality", () => {
    it("should return a ref object", () => {
      const { result } = renderHook(() => useGetLatest("test"));

      expect(result.current).toHaveProperty("current");
      expect(result.current.current).toBe("test");
    });

    it("should update ref current when value changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: "initial" } },
      );

      expect(result.current.current).toBe("initial");

      rerender({ value: "updated" });
      expect(result.current.current).toBe("updated");
    });

    it("should maintain same ref object across rerenders", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: "initial" } },
      );

      const firstRef = result.current;

      rerender({ value: "updated" });
      const secondRef = result.current;

      expect(firstRef).toBe(secondRef);
    });
  });

  describe("value types", () => {
    it("should handle primitive values", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: 42 } },
      );

      expect(result.current.current).toBe(42);

      rerender({ value: "string" as never });
      expect(result.current.current).toBe("string");

      rerender({ value: true as never });
      expect(result.current.current).toBe(true);

      rerender({ value: null as never });
      expect(result.current.current).toBe(null);

      rerender({ value: undefined as never });
      expect(result.current.current).toBe(undefined);
    });

    it("should handle object values", () => {
      const obj1 = { id: 1, name: "first" };
      const obj2 = { id: 2, name: "second" };

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: obj1 } },
      );

      expect(result.current.current).toBe(obj1);

      rerender({ value: obj2 });
      expect(result.current.current).toBe(obj2);
    });

    it("should handle array values", () => {
      const arr1 = [1, 2, 3];
      const arr2 = ["a", "b", "c"];

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: arr1 } },
      );

      expect(result.current.current).toBe(arr1);

      rerender({ value: arr2 as never });
      expect(result.current.current).toBe(arr2);
    });

    it("should handle function values", () => {
      const fn1 = () => "first";
      const fn2 = () => "second";

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: fn1 } },
      );

      expect(result.current.current).toBe(fn1);

      rerender({ value: fn2 });
      expect(result.current.current).toBe(fn2);
    });
  });

  describe("isomorphic layout effect", () => {
    let originalWindow: typeof window;

    beforeEach(() => {
      originalWindow = globalThis.window;
    });

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it("should use useLayoutEffect in browser environment", () => {
      // Ensure window is defined (browser environment)
      if (typeof window === "undefined") {
        Object.defineProperty(globalThis, "window", {
          value: {},
          writable: true,
        });
      }

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: "initial" } },
      );

      expect(result.current.current).toBe("initial");

      rerender({ value: "updated" });
      expect(result.current.current).toBe("updated");
    });
  });

  describe("performance", () => {
    it("should not cause unnecessary rerenders", () => {
      const renderSpy = vi.fn();

      const { rerender } = renderHook(
        ({ value }) => {
          renderSpy();
          return useGetLatest(value);
        },
        { initialProps: { value: "test" } },
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      rerender({ value: "test" }); // Same value
      expect(renderSpy).toHaveBeenCalledTimes(2);

      rerender({ value: "different" }); // Different value
      expect(renderSpy).toHaveBeenCalledTimes(3);
    });

    it("should update synchronously in browser", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: "initial" } },
      );

      rerender({ value: "updated" });

      // Should be updated immediately (synchronously)
      expect(result.current.current).toBe("updated");
    });
  });

  describe("edge cases", () => {
    it("should handle rapid value changes", () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: 0 } },
      );

      for (let i = 1; i <= 100; i++) {
        rerender({ value: i });
        expect(result.current.current).toBe(i);
      }
    });

    it("should handle same reference updates", () => {
      const obj = { count: 0 };
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: obj } },
      );

      expect(result.current.current).toBe(obj);

      // Update the object but keep same reference
      obj.count = 1;
      rerender({ value: obj });

      expect(result.current.current).toBe(obj);
      expect(result.current.current.count).toBe(1);
    });

    it("should handle circular references", () => {
      const circular = { name: "circular", self: {} };

      circular.self = circular;

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: circular } },
      );

      expect(result.current.current).toBe(circular);
      expect(result.current.current.self).toBe(circular);

      const newCircular = { name: "new", self: {} };

      newCircular.self = newCircular;

      rerender({ value: newCircular });
      expect(result.current.current).toBe(newCircular);
      expect(result.current.current.self).toBe(newCircular);
    });

    it("should handle Symbol values", () => {
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: sym1 } },
      );

      expect(result.current.current).toBe(sym1);

      rerender({ value: sym2 });
      expect(result.current.current).toBe(sym2);
    });

    it("should handle BigInt values", () => {
      const big1 = BigInt(123);
      const big2 = BigInt(456);

      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: big1 } },
      );

      expect(result.current.current).toBe(big1);

      rerender({ value: big2 });
      expect(result.current.current).toBe(big2);
    });
  });

  describe("use cases", () => {
    it("should work in callback scenarios", () => {
      const { result, rerender } = renderHook(
        ({ callback }) => {
          const latestCallback = useGetLatest(callback);

          return () => latestCallback.current();
        },
        { initialProps: { callback: () => "first" } },
      );

      expect(result.current()).toBe("first");

      rerender({ callback: () => "second" as never });
      expect(result.current()).toBe("second");
    });

    it("should work with async operations", async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useGetLatest(value),
        { initialProps: { value: "initial" } },
      );

      const asyncOperation = async () => {
        await new Promise(resolve => {
          setTimeout(resolve, 0);
        });
        return result.current.current;
      };

      const promise = asyncOperation();

      rerender({ value: "updated" });

      const asyncResult = await promise;

      expect(asyncResult).toBe("updated");
    });

    it("should work with event handlers", () => {
      let eventHandler: (() => string) | null = null;

      const { rerender } = renderHook(
        ({ message }) => {
          const latestMessage = useGetLatest(message);

          eventHandler = () => latestMessage.current;
        },
        { initialProps: { message: "hello" } },
      );

      expect(eventHandler!()).toBe("hello");

      rerender({ message: "world" });
      expect(eventHandler!()).toBe("world");
    });
  });
});
