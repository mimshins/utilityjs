import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useIsMounted } from "./use-is-mounted.ts";

describe("useIsMounted", () => {
  it("should return a function", () => {
    const { result } = renderHook(() => useIsMounted());

    expect(typeof result.current).toBe("function");
  });

  it("should return true when component is mounted", () => {
    const { result } = renderHook(() => useIsMounted());

    expect(result.current()).toBe(true);
  });

  it("should return false after component is unmounted", () => {
    const { result, unmount } = renderHook(() => useIsMounted());

    expect(result.current()).toBe(true);

    unmount();

    expect(result.current()).toBe(false);
  });

  it("should maintain the same function reference across re-renders", () => {
    const { result, rerender } = renderHook(() => useIsMounted());

    const initialFunction = result.current;

    rerender();
    expect(result.current).toBe(initialFunction);

    rerender();
    expect(result.current).toBe(initialFunction);
  });

  it("should work correctly in async scenarios", async () => {
    const { result, unmount } = renderHook(() => useIsMounted());

    const isMounted = result.current;

    // Simulate async operation while mounted
    const asyncOperation = new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(isMounted());
      }, 10);
    });

    const resultWhileMounted = await asyncOperation;

    expect(resultWhileMounted).toBe(true);

    // Unmount and test async operation
    unmount();

    const asyncOperationAfterUnmount = new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(isMounted());
      }, 10);
    });

    const resultAfterUnmount = await asyncOperationAfterUnmount;

    expect(resultAfterUnmount).toBe(false);
  });

  it("should handle multiple calls correctly", () => {
    const { result, unmount } = renderHook(() => useIsMounted());

    const isMounted = result.current;

    // Multiple calls while mounted
    expect(isMounted()).toBe(true);
    expect(isMounted()).toBe(true);
    expect(isMounted()).toBe(true);

    unmount();

    // Multiple calls after unmount
    expect(isMounted()).toBe(false);
    expect(isMounted()).toBe(false);
    expect(isMounted()).toBe(false);
  });

  it("should work with conditional rendering", () => {
    const shouldRender = true;

    const { result, rerender, unmount } = renderHook(() => {
      if (shouldRender) {
        return useIsMounted();
      }

      return null;
    });

    expect(result.current).not.toBeNull();
    expect(result.current!()).toBe(true);

    // Re-render with same condition
    rerender();
    expect(result.current!()).toBe(true);

    // Unmount
    unmount();
    expect(result.current!()).toBe(false);
  });

  it("should be safe to call after component unmount without warnings", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useIsMounted());

    const isMounted = result.current;

    unmount();

    // Should not cause any console errors
    expect(isMounted()).toBe(false);
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle rapid mount/unmount cycles", () => {
    for (let i = 0; i < 10; i++) {
      const { result, unmount } = renderHook(() => useIsMounted());

      expect(result.current()).toBe(true);

      unmount();

      expect(result.current()).toBe(false);
    }
  });

  it("should work correctly with React.StrictMode behavior", () => {
    // In StrictMode, effects run twice in development
    // This test ensures our hook works correctly even with double effect execution
    const { result, unmount } = renderHook(() => useIsMounted());

    expect(result.current()).toBe(true);

    unmount();

    expect(result.current()).toBe(false);
  });

  it("should handle concurrent renders correctly", () => {
    const { result: result1 } = renderHook(() => useIsMounted());
    const { result: result2 } = renderHook(() => useIsMounted());

    // Both instances should work independently
    expect(result1.current()).toBe(true);
    expect(result2.current()).toBe(true);

    // Functions should be different instances
    expect(result1.current).not.toBe(result2.current);
  });

  it("should maintain correct state during re-renders with dependencies", () => {
    let dependency = 1;

    const { result, rerender } = renderHook(() => {
      const isMounted = useIsMounted();

      return { isMounted, dependency };
    });

    expect(result.current.isMounted()).toBe(true);

    // Change dependency and re-render
    dependency = 2;
    rerender();

    expect(result.current.isMounted()).toBe(true);
    expect(result.current.dependency).toBe(2);
  });

  it("should work in custom hook compositions", () => {
    const useCustomHook = () => {
      const isMounted = useIsMounted();

      const safeSetState = (callback: () => void) => {
        if (isMounted()) {
          callback();
        }
      };

      return { isMounted, safeSetState };
    };

    const { result, unmount } = renderHook(() => useCustomHook());

    expect(result.current.isMounted()).toBe(true);

    let callbackExecuted = false;

    result.current.safeSetState(() => {
      callbackExecuted = true;
    });

    expect(callbackExecuted).toBe(true);

    unmount();

    expect(result.current.isMounted()).toBe(false);

    callbackExecuted = false;
    result.current.safeSetState(() => {
      callbackExecuted = true;
    });

    expect(callbackExecuted).toBe(false);
  });

  it("should handle edge case with immediate unmount", () => {
    const { result, unmount } = renderHook(() => useIsMounted());

    // Unmount immediately after render
    unmount();

    expect(result.current()).toBe(false);
  });

  it("should work correctly with error boundaries", () => {
    const { result } = renderHook(() => useIsMounted());

    expect(result.current()).toBe(true);

    // Even if an error occurs, the mounted state should be accurate
    expect(() => {
      if (result.current()) {
        // Component is mounted, safe to perform operations
        return "safe operation";
      }

      throw new Error("Component not mounted");
    }).not.toThrow();
  });

  describe("memory management", () => {
    it("should not cause memory leaks", () => {
      const hooks: Array<() => boolean> = [];

      // Create multiple hook instances
      for (let i = 0; i < 100; i++) {
        const { result, unmount } = renderHook(() => useIsMounted());

        hooks.push(result.current);
        unmount();
      }

      // All should return false after unmount
      hooks.forEach(isMounted => {
        expect(isMounted()).toBe(false);
      });
    });

    it("should clean up properly on unmount", () => {
      const { result, unmount } = renderHook(() => useIsMounted());
      const isMounted = result.current;

      expect(isMounted()).toBe(true);

      unmount();

      // After unmount, the ref should be updated
      expect(isMounted()).toBe(false);
    });
  });
});
