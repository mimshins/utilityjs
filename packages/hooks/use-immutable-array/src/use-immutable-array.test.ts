import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useImmutableArray } from "./use-immutable-array.ts";

describe("useImmutableArray", () => {
  it("should initialize with provided array", () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useImmutableArray(initialArray));

    expect(result.current.values).toEqual([1, 2, 3]);
    // The hook uses the same array reference, not a copy
    expect(result.current.values).toBe(initialArray);
  });

  it("should initialize with empty array", () => {
    const { result } = renderHook(() => useImmutableArray([]));

    expect(result.current.values).toEqual([]);
  });

  describe("push", () => {
    it("should add element to end of array", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2]));

      act(() => {
        result.current.push(3);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });

    it("should not mutate original array", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2]));
      const originalValues = result.current.values;

      act(() => {
        result.current.push(3);
      });

      expect(originalValues).toEqual([1, 2]);
      expect(result.current.values).not.toBe(originalValues);
    });
  });

  describe("pop", () => {
    it("should remove last element from array", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.pop();
      });

      expect(result.current.values).toEqual([1, 2]);
    });

    it("should handle empty array", () => {
      const { result } = renderHook(() => useImmutableArray([]));

      act(() => {
        result.current.pop();
      });

      expect(result.current.values).toEqual([]);
    });
  });

  describe("shift", () => {
    it("should remove first element from array", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.shift();
      });

      expect(result.current.values).toEqual([2, 3]);
    });

    it("should handle empty array", () => {
      const { result } = renderHook(() => useImmutableArray([]));

      act(() => {
        result.current.shift();
      });

      expect(result.current.values).toEqual([]);
    });
  });

  describe("unshift", () => {
    it("should add element to beginning of array", () => {
      const { result } = renderHook(() => useImmutableArray([2, 3]));

      act(() => {
        result.current.unshift(1);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });

    it("should work with empty array", () => {
      const { result } = renderHook(() => useImmutableArray([]));

      act(() => {
        result.current.unshift(1 as never);
      });

      expect(result.current.values).toEqual([1]);
    });
  });

  describe("reverse", () => {
    it("should reverse array order", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.reverse();
      });

      expect(result.current.values).toEqual([3, 2, 1]);
    });

    it("should handle empty array", () => {
      const { result } = renderHook(() => useImmutableArray([]));

      act(() => {
        result.current.reverse();
      });

      expect(result.current.values).toEqual([]);
    });

    it("should handle single element array", () => {
      const { result } = renderHook(() => useImmutableArray([1]));

      act(() => {
        result.current.reverse();
      });

      expect(result.current.values).toEqual([1]);
    });
  });

  describe("removeByIndex", () => {
    it("should remove element at specified index", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3, 4]));

      act(() => {
        result.current.removeByIndex(1);
      });

      expect(result.current.values).toEqual([1, 3, 4]);
    });

    it("should remove first element", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.removeByIndex(0);
      });

      expect(result.current.values).toEqual([2, 3]);
    });

    it("should remove last element", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.removeByIndex(2);
      });

      expect(result.current.values).toEqual([1, 2]);
    });

    it("should handle invalid index gracefully", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.removeByIndex(10);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });
  });

  describe("removeByValue", () => {
    it("should remove all occurrences of value", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 2, 3, 2]));

      act(() => {
        result.current.removeByValue(2);
      });

      expect(result.current.values).toEqual([1, 3]);
    });

    it("should handle non-existent value", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.removeByValue(4);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });

    it("should work with object values", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const { result } = renderHook(() =>
        useImmutableArray([obj1, obj2, obj1]),
      );

      act(() => {
        result.current.removeByValue(obj1);
      });

      expect(result.current.values).toEqual([obj2]);
    });
  });

  describe("filter", () => {
    it("should filter array based on predicate", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3, 4, 5]));

      act(() => {
        result.current.filter(value => value % 2 === 0);
      });

      expect(result.current.values).toEqual([2, 4]);
    });

    it("should handle empty result", () => {
      const { result } = renderHook(() => useImmutableArray([1, 3, 5]));

      act(() => {
        result.current.filter(value => value % 2 === 0);
      });

      expect(result.current.values).toEqual([]);
    });

    it("should pass index and array to predicate", () => {
      const { result } = renderHook(() => useImmutableArray(["a", "b", "c"]));

      act(() => {
        result.current.filter((_value, index, array) => {
          expect(typeof index).toBe("number");
          expect(Array.isArray(array)).toBe(true);
          return index > 0;
        });
      });

      expect(result.current.values).toEqual(["b", "c"]);
    });
  });

  describe("insertItem", () => {
    it("should insert item at specified index", () => {
      const { result } = renderHook(() => useImmutableArray([1, 3, 4]));

      act(() => {
        result.current.insertItem(1, 2);
      });

      expect(result.current.values).toEqual([1, 2, 3, 4]);
    });

    it("should insert at beginning", () => {
      const { result } = renderHook(() => useImmutableArray([2, 3]));

      act(() => {
        result.current.insertItem(0, 1);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });

    it("should insert at end", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2]));

      act(() => {
        result.current.insertItem(2, 3);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });

    it("should handle index beyond array length", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2]));

      act(() => {
        result.current.insertItem(10, 3);
      });

      expect(result.current.values).toEqual([1, 2, 3]);
    });
  });

  describe("moveItem", () => {
    it("should move item from higher to lower index", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3, 4]));

      act(() => {
        result.current.moveItem(3, 1);
      });

      expect(result.current.values).toEqual([1, 4, 2, 3]);
    });

    it("should move item from lower to higher index", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3, 4]));

      act(() => {
        result.current.moveItem(1, 3);
      });

      expect(result.current.values).toEqual([1, 3, 4, 2]);
    });

    it("should handle moving to same index (no-op)", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3, 4]));

      act(() => {
        result.current.moveItem(2, 2);
      });

      expect(result.current.values).toEqual([1, 2, 3, 4]);
    });

    it("should move first item to last", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.values).toEqual([2, 3, 1]);
    });

    it("should move last item to first", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.moveItem(2, 0);
      });

      expect(result.current.values).toEqual([3, 1, 2]);
    });

    it("should handle moving in single element array", () => {
      const { result } = renderHook(() => useImmutableArray([1]));

      act(() => {
        result.current.moveItem(0, 0);
      });

      expect(result.current.values).toEqual([1]);
    });

    it("should handle moving with objects", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };
      const { result } = renderHook(() =>
        useImmutableArray([obj1, obj2, obj3]),
      );

      act(() => {
        result.current.moveItem(0, 2);
      });

      expect(result.current.values).toEqual([obj2, obj3, obj1]);
    });
  });

  describe("setValues", () => {
    it("should set values directly", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.setValues([4, 5, 6]);
      });

      expect(result.current.values).toEqual([4, 5, 6]);
    });

    it("should work with function updater", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.setValues(prev => [...prev, 4]);
      });

      expect(result.current.values).toEqual([1, 2, 3, 4]);
    });
  });

  describe("memoization", () => {
    it("should maintain stable function references when values don't change", () => {
      const { result, rerender } = renderHook(() =>
        useImmutableArray([1, 2, 3]),
      );

      const initialFunctions = {
        push: result.current.push,
        pop: result.current.pop,
        shift: result.current.shift,
        unshift: result.current.unshift,
        reverse: result.current.reverse,
        removeByIndex: result.current.removeByIndex,
        removeByValue: result.current.removeByValue,
        filter: result.current.filter,
        insertItem: result.current.insertItem,
        moveItem: result.current.moveItem,
        setValues: result.current.setValues,
      };

      rerender();

      expect(result.current.push).toBe(initialFunctions.push);
      expect(result.current.pop).toBe(initialFunctions.pop);
      expect(result.current.shift).toBe(initialFunctions.shift);
      expect(result.current.unshift).toBe(initialFunctions.unshift);
      expect(result.current.reverse).toBe(initialFunctions.reverse);
      expect(result.current.removeByIndex).toBe(initialFunctions.removeByIndex);
      expect(result.current.removeByValue).toBe(initialFunctions.removeByValue);
      expect(result.current.filter).toBe(initialFunctions.filter);
      expect(result.current.insertItem).toBe(initialFunctions.insertItem);
      expect(result.current.moveItem).toBe(initialFunctions.moveItem);
      expect(result.current.setValues).toBe(initialFunctions.setValues);
    });

    it("should update function references when values change", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      const initialPush = result.current.push;

      act(() => {
        result.current.push(4);
      });

      expect(result.current.push).not.toBe(initialPush);
    });
  });

  describe("complex operations", () => {
    it("should handle chained operations correctly", () => {
      const { result } = renderHook(() => useImmutableArray([1, 2, 3]));

      act(() => {
        result.current.push(4);
      });

      act(() => {
        result.current.unshift(0);
      });

      act(() => {
        result.current.removeByIndex(2);
      });

      expect(result.current.values).toEqual([0, 1, 3, 4]);
    });

    it("should work with different data types", () => {
      const { result } = renderHook(() =>
        useImmutableArray<string | number>([]),
      );

      act(() => {
        result.current.push("hello");
      });

      act(() => {
        result.current.push(42);
      });

      act(() => {
        result.current.push("world");
      });

      expect(result.current.values).toEqual(["hello", 42, "world"]);

      act(() => {
        result.current.filter(item => typeof item === "string");
      });

      expect(result.current.values).toEqual(["hello", "world"]);
    });
  });
});
