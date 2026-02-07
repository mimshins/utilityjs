import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { reducer } from "./reducer.ts";
import { useMementoState } from "./use-memento-state.ts";

describe("reducer", () => {
  it("should return previous state for unknown action type", () => {
    const state = { past: [], present: "test", future: [] };
    const result = reducer(state, { type: "UNKNOWN" } as never);

    expect(result).toBe(state);
  });
});

describe("useMementoState", () => {
  it("should initialize with the provided initial state", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should initialize with complex initial state", () => {
    const initialState = { count: 0, name: "test" };
    const { result } = renderHook(() => useMementoState(initialState));

    expect(result.current.state).toEqual(initialState);
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should update state and add to history", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.setState("updated");
    });

    expect(result.current.state).toBe("updated");
    expect(result.current.pastStates).toEqual(["initial"]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should handle functional state updates", () => {
    const { result } = renderHook(() => useMementoState(10));

    act(() => {
      result.current.setState(prev => prev + 5);
    });

    expect(result.current.state).toBe(15);
    expect(result.current.pastStates).toEqual([10]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should not update history when setting same value", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.setState("initial");
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should perform undo operation", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.setState("updated");
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual(["updated"]);
  });

  it("should perform redo operation", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.setState("updated");
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe("updated");
    expect(result.current.pastStates).toEqual(["initial"]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should handle multiple state changes", () => {
    const { result } = renderHook(() => useMementoState(0));

    act(() => {
      result.current.setState(1);
    });

    act(() => {
      result.current.setState(2);
    });

    act(() => {
      result.current.setState(3);
    });

    expect(result.current.state).toBe(3);
    expect(result.current.pastStates).toEqual([0, 1, 2]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should handle multiple undo operations", () => {
    const { result } = renderHook(() => useMementoState(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.setState(3);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe(2);
    expect(result.current.pastStates).toEqual([0, 1]);
    expect(result.current.futureStates).toEqual([3]);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe(1);
    expect(result.current.pastStates).toEqual([0]);
    expect(result.current.futureStates).toEqual([2, 3]);
  });

  it("should handle multiple redo operations", () => {
    const { result } = renderHook(() => useMementoState(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
      result.current.setState(3);
    });

    act(() => {
      result.current.undo();
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe(2);
    expect(result.current.pastStates).toEqual([0, 1]);
    expect(result.current.futureStates).toEqual([3]);

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe(3);
    expect(result.current.pastStates).toEqual([0, 1, 2]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should clear future states when setting new state after undo", () => {
    const { result } = renderHook(() => useMementoState(0));

    act(() => {
      result.current.setState(1);
      result.current.setState(2);
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.futureStates).toEqual([2]);

    act(() => {
      result.current.setState(3);
    });

    expect(result.current.state).toBe(3);
    expect(result.current.pastStates).toEqual([0, 1]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should reset to initial state", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.setState("updated1");
      result.current.setState("updated2");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should correctly report hasPastState", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    expect(result.current.hasPastState()).toBe(false);

    act(() => {
      result.current.setState("updated");
    });

    expect(result.current.hasPastState()).toBe(true);

    act(() => {
      result.current.undo();
    });

    expect(result.current.hasPastState()).toBe(false);
  });

  it("should correctly report hasFutureState", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    expect(result.current.hasFutureState()).toBe(false);

    act(() => {
      result.current.setState("updated");
    });

    expect(result.current.hasFutureState()).toBe(false);

    act(() => {
      result.current.undo();
    });

    expect(result.current.hasFutureState()).toBe(true);

    act(() => {
      result.current.redo();
    });

    expect(result.current.hasFutureState()).toBe(false);
  });

  it("should not undo when no past states exist", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should not redo when no future states exist", () => {
    const { result } = renderHook(() => useMementoState("initial"));

    act(() => {
      result.current.redo();
    });

    expect(result.current.state).toBe("initial");
    expect(result.current.pastStates).toEqual([]);
    expect(result.current.futureStates).toEqual([]);
  });

  it("should handle complex object states", () => {
    const initialState = { items: [] as string[], count: 0 };
    const { result } = renderHook(() => useMementoState(initialState));

    const newState = { items: ["item1"], count: 1 };

    act(() => {
      result.current.setState(newState);
    });

    expect(result.current.state).toEqual(newState);
    expect(result.current.pastStates).toEqual([initialState]);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toEqual(initialState);
    expect(result.current.futureStates).toEqual([newState]);
  });

  it("should handle array states", () => {
    const { result } = renderHook(() => useMementoState([1, 2, 3]));

    act(() => {
      result.current.setState([1, 2, 3, 4]);
    });

    expect(result.current.state).toEqual([1, 2, 3, 4]);
    expect(result.current.pastStates).toEqual([[1, 2, 3]]);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toEqual([1, 2, 3]);
    expect(result.current.futureStates).toEqual([[1, 2, 3, 4]]);
  });

  it("should maintain referential stability of functions", () => {
    const { result, rerender } = renderHook(() => useMementoState("initial"));

    const initialSetState = result.current.setState;
    const initialUndo = result.current.undo;
    const initialRedo = result.current.redo;
    const initialReset = result.current.reset;
    const initialHasPastState = result.current.hasPastState;
    const initialHasFutureState = result.current.hasFutureState;

    rerender();

    expect(result.current.setState).toBe(initialSetState);
    expect(result.current.undo).toBe(initialUndo);
    expect(result.current.redo).toBe(initialRedo);
    expect(result.current.reset).toBe(initialReset);
    expect(result.current.hasPastState).toBe(initialHasPastState);
    expect(result.current.hasFutureState).toBe(initialHasFutureState);
  });

  it("should handle null and undefined values", () => {
    const { result } = renderHook(() => useMementoState<string | null>(null));

    act(() => {
      result.current.setState("not null");
    });

    expect(result.current.state).toBe("not null");
    expect(result.current.pastStates).toEqual([null]);

    act(() => {
      result.current.setState(null);
    });

    expect(result.current.state).toBe(null);
    expect(result.current.pastStates).toEqual([null, "not null"]);
  });

  it("should handle boolean states", () => {
    const { result } = renderHook(() => useMementoState(false));

    act(() => {
      result.current.setState(true);
    });

    expect(result.current.state).toBe(true);
    expect(result.current.pastStates).toEqual([false]);

    act(() => {
      result.current.undo();
    });

    expect(result.current.state).toBe(false);
    expect(result.current.futureStates).toEqual([true]);
  });
});
