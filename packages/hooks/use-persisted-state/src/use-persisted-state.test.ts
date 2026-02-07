import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __INSTANCES_REF_MAP__ } from "./constants.ts";
import { usePersistedState, type DataStorage } from "./use-persisted-state.ts";
import { emitInstances } from "./utils.ts";

vi.mock("@utilityjs/use-is-server-handoff-complete", () => ({
  useIsServerHandoffComplete: vi.fn(() => true),
}));

describe("usePersistedState", () => {
  let mockStorage: DataStorage<string>;
  let storageData: Record<string, string | null>;

  beforeEach(() => {
    storageData = {};
    mockStorage = {
      setItem: vi.fn((key: string, value: string) => {
        storageData[key] = value;
      }),
      getItem: vi.fn((key: string) => storageData[key] ?? null),
    };
    __INSTANCES_REF_MAP__.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with initial value when storage is empty", () => {
    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    expect(result.current[0]).toBe("initial");
    expect(mockStorage.getItem).toHaveBeenCalledWith("test");
  });

  it("should initialize with stored value when available", () => {
    storageData["test"] = "stored";

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    expect(result.current[0]).toBe("stored");
  });

  it("should handle function as initial value", () => {
    const init = vi.fn(() => "computed");

    const { result } = renderHook(() =>
      usePersistedState(init, { name: "test", storage: mockStorage }),
    );

    expect(result.current[0]).toBe("computed");
  });

  it("should update state and persist to storage", () => {
    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(mockStorage.setItem).toHaveBeenCalledWith("test", "updated");
  });

  it("should handle function setter", () => {
    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      result.current[1]((prev: string) => prev + "-updated");
    });

    expect(result.current[0]).toBe("initial-updated");
  });

  it("should throw for invalid name", () => {
    expect(() => {
      renderHook(() =>
        usePersistedState("initial", {
          name: "",
          storage: mockStorage,
        }),
      );
    }).toThrow("Expected a valid `name` value");
  });

  it("should synchronize multiple instances with the same name", () => {
    const { result: r1 } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    const { result: r2 } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      r1.current[1]("synced");
    });

    expect(r1.current[0]).toBe("synced");
    expect(r2.current[0]).toBe("synced");
  });

  it("should clean up instance callbacks on unmount", () => {
    const { result: r1, unmount } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    const { result: r2 } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    unmount();

    act(() => {
      r2.current[1]("after-unmount");
    });

    expect(r1.current[0]).toBe("initial");
    expect(r2.current[0]).toBe("after-unmount");
  });

  it("should handle storage events with valid JSON", () => {
    const handlers: EventListener[] = [];
    const origAdd = window.addEventListener.bind(window);
    const origRemove = window.removeEventListener.bind(window);

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === "storage") handlers.push(handler as EventListener);
        origAdd(type, handler);
      },
    );

    vi.spyOn(window, "removeEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        origRemove(type, handler);
      },
    );

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "test",
        newValue: JSON.stringify("external"),
      });

      handlers.forEach(h => h(event));
    });

    expect(result.current[0]).toBe("external");
  });

  it("should reset to initial value on storage event with null newValue", () => {
    const handlers: EventListener[] = [];

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === "storage") handlers.push(handler as EventListener);
      },
    );

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      result.current[1]("changed");
    });

    act(() => {
      const event = new StorageEvent("storage", {
        key: "test",
        newValue: null,
      });

      handlers.forEach(h => h(event));
    });

    expect(result.current[0]).toBe("initial");
  });

  it("should reset to initial value on storage event with invalid JSON", () => {
    const handlers: EventListener[] = [];

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === "storage") handlers.push(handler as EventListener);
      },
    );

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "test",
        newValue: "not-json{",
      });

      handlers.forEach(h => h(event));
    });

    expect(result.current[0]).toBe("initial");
  });

  it("should ignore storage events for different keys", () => {
    const handlers: EventListener[] = [];

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === "storage") handlers.push(handler as EventListener);
      },
    );

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "other",
        newValue: JSON.stringify("nope"),
      });

      handlers.forEach(h => h(event));
    });

    expect(result.current[0]).toBe("initial");
  });

  it("should not update on storage event with same value", () => {
    const handlers: EventListener[] = [];

    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: EventListenerOrEventListenerObject) => {
        if (type === "storage") handlers.push(handler as EventListener);
      },
    );

    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    act(() => {
      const event = new StorageEvent("storage", {
        key: "test",
        newValue: JSON.stringify("initial"),
      });

      handlers.forEach(h => h(event));
    });

    expect(result.current[0]).toBe("initial");
  });

  it("should handle emitInstances when no instance exists", () => {
    expect(() => {
      emitInstances("nonexistent", vi.fn(), "value");
    }).not.toThrow();
  });

  it("should not emit when value is the same", () => {
    const { result } = renderHook(() =>
      usePersistedState("initial", { name: "test", storage: mockStorage }),
    );

    const instance = __INSTANCES_REF_MAP__.get("test");

    expect(instance).toBeDefined();
    instance!.value = "same";
    emitInstances<string>("test", result.current[1], "same");
    expect(instance!.value).toBe("same");
  });

  it("should work with different named instances independently", () => {
    const { result: r1 } = renderHook(() =>
      usePersistedState("a", { name: "key1", storage: mockStorage }),
    );

    const { result: r2 } = renderHook(() =>
      usePersistedState("b", { name: "key2", storage: mockStorage }),
    );

    act(() => {
      r1.current[1]("updated-a");
    });

    expect(r1.current[0]).toBe("updated-a");
    expect(r2.current[0]).toBe("b");
  });
});
