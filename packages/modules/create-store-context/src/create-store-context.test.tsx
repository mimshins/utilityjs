import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import createStoreContext from "./create-store-context.tsx";

type TestStore = {
  count: number;
  text: string;
  increment: () => void;
  setText: (text: string) => void;
};

const createTestStore = () =>
  createStoreContext<TestStore>(setState => ({
    count: 0,
    text: "",
    increment: () => setState(prev => ({ ...prev, count: prev.count + 1 })),
    setText: (text: string) => setState(prev => ({ ...prev, text })),
  }));

describe("createStoreContext", () => {
  describe("StoreProvider", () => {
    it("should provide store to children", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result } = renderHook(() => useStore(s => s.count), {
        wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
      });

      expect(result.current).toBe(0);
    });

    it("should initialize store with factory values", () => {
      const { StoreProvider, useStore } = createStoreContext<{ value: number }>(
        () => ({ value: 42 }),
      );

      const { result } = renderHook(() => useStore(s => s.value), {
        wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
      });

      expect(result.current).toBe(42);
    });
  });

  describe("useStore", () => {
    it("should throw error when used outside provider", () => {
      const { useStore } = createTestStore();

      expect(() => renderHook(() => useStore(s => s.count))).toThrow(
        "You can only use `useStore` in a subtree of `<StoreProvider>`",
      );
    });

    it("should select partial state", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result } = renderHook(() => useStore(s => s.text), {
        wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
      });

      expect(result.current).toBe("");
    });

    it("should return derived values from selector", () => {
      const { StoreProvider, useStore } = createStoreContext<{
        items: number[];
      }>(() => ({ items: [1, 2, 3] }));

      const { result } = renderHook(() => useStore(s => s.items.length), {
        wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
      });

      expect(result.current).toBe(3);
    });
  });

  describe("state updates", () => {
    it("should update state via setState", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result } = renderHook(
        () => ({
          count: useStore(s => s.count),
          increment: useStore(s => s.increment),
        }),
        {
          wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
        },
      );

      expect(result.current.count).toBe(0);

      act(() => result.current.increment());

      expect(result.current.count).toBe(1);
    });

    it("should handle multiple state updates", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result } = renderHook(
        () => ({
          count: useStore(s => s.count),
          increment: useStore(s => s.increment),
        }),
        {
          wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
        },
      );

      act(() => {
        result.current.increment();
        result.current.increment();
        result.current.increment();
      });

      expect(result.current.count).toBe(3);
    });

    it("should update different state properties independently", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result } = renderHook(
        () => ({
          count: useStore(s => s.count),
          text: useStore(s => s.text),
          increment: useStore(s => s.increment),
          setText: useStore(s => s.setText),
        }),
        {
          wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
        },
      );

      act(() => result.current.increment());
      act(() => result.current.setText("hello"));

      expect(result.current.count).toBe(1);
      expect(result.current.text).toBe("hello");
    });
  });

  describe("getState access", () => {
    it("should provide getState to factory", () => {
      const { StoreProvider, useStore } = createStoreContext<{
        value: number;
        double: () => number;
      }>((_, getState) => ({
        value: 5,
        double: () => getState().value * 2,
      }));

      const { result } = renderHook(
        () => ({
          double: useStore(s => s.double),
        }),
        {
          wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
        },
      );

      expect(result.current.double()).toBe(10);
    });
  });

  describe("subscription cleanup", () => {
    it("should unsubscribe when component unmounts", () => {
      const { StoreProvider, useStore } = createTestStore();

      const { result, unmount } = renderHook(() => useStore(s => s.count), {
        wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>,
      });

      expect(result.current).toBe(0);
      unmount();
      // Test passes if no errors occur during unmount
    });
  });
});
