import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInitOnce } from "./use-init-once.ts";

describe("useInitOnce", () => {
  it("should call init factory only once", () => {
    const initFactory = vi.fn(() => "initialized value");
    const { result, rerender } = renderHook(() => useInitOnce(initFactory));

    expect(initFactory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe("initialized value");

    // Rerender multiple times
    rerender();
    rerender();
    rerender();

    expect(initFactory).toHaveBeenCalledTimes(1);
    expect(result.current).toBe("initialized value");
  });

  it("should return the same value across re-renders", () => {
    const { result, rerender } = renderHook(() =>
      useInitOnce(() => Math.random()),
    );

    const initialValue = result.current;

    rerender();
    expect(result.current).toBe(initialValue);

    rerender();
    expect(result.current).toBe(initialValue);
  });

  it("should work with different data types", () => {
    // String
    const { result: stringResult } = renderHook(() =>
      useInitOnce(() => "test string"),
    );

    expect(stringResult.current).toBe("test string");

    // Number
    const { result: numberResult } = renderHook(() => useInitOnce(() => 42));

    expect(numberResult.current).toBe(42);

    // Object
    const testObj = { id: 1, name: "test" };
    const { result: objectResult } = renderHook(() =>
      useInitOnce(() => testObj),
    );

    expect(objectResult.current).toBe(testObj);

    // Array
    const testArray = [1, 2, 3];
    const { result: arrayResult } = renderHook(() =>
      useInitOnce(() => testArray),
    );

    expect(arrayResult.current).toBe(testArray);

    // Function
    const testFunction = () => "hello";
    const { result: functionResult } = renderHook(() =>
      useInitOnce(() => testFunction),
    );

    expect(functionResult.current).toBe(testFunction);
  });

  it("should handle null and undefined values", () => {
    const { result: nullResult } = renderHook(() => useInitOnce(() => null));

    expect(nullResult.current).toBe(null);

    const { result: undefinedResult } = renderHook(() =>
      useInitOnce(() => undefined),
    );

    expect(undefinedResult.current).toBe(undefined);
  });

  it("should handle expensive computations", () => {
    const expensiveComputation = vi.fn(() => {
      // Simulate expensive operation
      let result = 0;

      for (let i = 0; i < 1000; i++) {
        result += i;
      }

      return result;
    });

    const { result, rerender } = renderHook(() =>
      useInitOnce(expensiveComputation),
    );

    expect(expensiveComputation).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(499500); // Sum of 0 to 999

    // Multiple re-renders should not trigger expensive computation again
    rerender();
    rerender();
    rerender();

    expect(expensiveComputation).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(499500);
  });

  it("should work with factory that returns objects", () => {
    const createConfig = vi.fn(() => ({
      apiUrl: "https://api.example.com",
      timeout: 5000,
      retries: 3,
    }));

    const { result, rerender } = renderHook(() => useInitOnce(createConfig));

    const initialConfig = result.current;

    expect(createConfig).toHaveBeenCalledTimes(1);
    expect(initialConfig).toEqual({
      apiUrl: "https://api.example.com",
      timeout: 5000,
      retries: 3,
    });

    rerender();
    expect(result.current).toBe(initialConfig); // Same reference
    expect(createConfig).toHaveBeenCalledTimes(1);
  });

  it("should work with factory that creates instances", () => {
    class TestClass {
      value: string;
      constructor(value: string) {
        this.value = value;
      }
    }

    const createInstance = vi.fn(() => new TestClass("test"));

    const { result, rerender } = renderHook(() => useInitOnce(createInstance));

    const initialInstance = result.current;

    expect(createInstance).toHaveBeenCalledTimes(1);
    expect(initialInstance).toBeInstanceOf(TestClass);
    expect(initialInstance.value).toBe("test");

    rerender();
    expect(result.current).toBe(initialInstance); // Same instance
    expect(createInstance).toHaveBeenCalledTimes(1);
  });

  it("should handle factory that throws error", () => {
    const errorFactory = vi.fn(() => {
      throw new Error("Initialization failed");
    });

    expect(() => {
      renderHook(() => useInitOnce(errorFactory));
    }).toThrow("Initialization failed");

    // Factory should be called at least once
    expect(errorFactory.mock.calls.length).toBeGreaterThan(0);
  });

  it("should work with different factories in different hook instances", () => {
    const factory1 = vi.fn(() => "value1");
    const factory2 = vi.fn(() => "value2");

    const { result: result1 } = renderHook(() => useInitOnce(factory1));
    const { result: result2 } = renderHook(() => useInitOnce(factory2));

    expect(factory1).toHaveBeenCalledTimes(1);
    expect(factory2).toHaveBeenCalledTimes(1);
    expect(result1.current).toBe("value1");
    expect(result2.current).toBe("value2");
  });

  it("should handle boolean values correctly", () => {
    const { result: trueResult } = renderHook(() => useInitOnce(() => true));

    expect(trueResult.current).toBe(true);

    const { result: falseResult } = renderHook(() => useInitOnce(() => false));

    expect(falseResult.current).toBe(false);
  });

  it("should handle zero and empty string correctly", () => {
    const { result: zeroResult } = renderHook(() => useInitOnce(() => 0));

    expect(zeroResult.current).toBe(0);

    const { result: emptyStringResult } = renderHook(() =>
      useInitOnce(() => ""),
    );

    expect(emptyStringResult.current).toBe("");
  });

  it("should work with async factory results (resolved values)", () => {
    const asyncValue = Promise.resolve("async result");
    const { result } = renderHook(() => useInitOnce(() => asyncValue));

    expect(result.current).toBe(asyncValue);
  });

  it("should maintain reference equality for complex objects", () => {
    const complexObject = {
      nested: {
        array: [1, 2, 3],
        map: new Map([["key", "value"]]),
        set: new Set([1, 2, 3]),
      },
    };

    const { result, rerender } = renderHook(() =>
      useInitOnce(() => complexObject),
    );

    const initial = result.current;

    rerender();

    expect(result.current).toBe(initial);
    expect(result.current.nested).toBe(initial.nested);
    expect(result.current.nested.array).toBe(initial.nested.array);
    expect(result.current.nested.map).toBe(initial.nested.map);
    expect(result.current.nested.set).toBe(initial.nested.set);
  });
});
