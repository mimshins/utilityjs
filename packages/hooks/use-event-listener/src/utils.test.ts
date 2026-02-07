import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isOptionParamSupported } from "./utils.ts";

describe("utils", () => {
  describe("isOptionParamSupported", () => {
    let mockAddEventListener: ReturnType<typeof vi.fn>;
    let mockRemoveEventListener: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockAddEventListener = vi.fn();
      mockRemoveEventListener = vi.fn();

      // Mock window object
      Object.defineProperty(globalThis, "window", {
        value: {
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        },
        writable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should return true when options parameter is supported", () => {
      // Mock addEventListener to trigger the passive getter
      mockAddEventListener.mockImplementation(
        (_, __, options: boolean | AddEventListenerOptions | undefined) => {
          if (options && typeof options === "object" && "passive" in options) {
            // Trigger the getter
            void options.passive;
          }
        },
      );

      const result = isOptionParamSupported();

      expect(result).toBe(true);
      expect(mockAddEventListener).toHaveBeenCalledWith(
        "test",
        expect.any(Function),
        expect.objectContaining({
          passive: null,
        }),
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        "test",
        expect.any(Function),
        expect.objectContaining({
          passive: null,
        }),
      );
    });

    it("should return false when options parameter is not supported", () => {
      // Mock addEventListener to not trigger the passive getter
      mockAddEventListener.mockImplementation(() => {
        // Do nothing, don't access options.passive
      });

      const result = isOptionParamSupported();

      expect(result).toBe(false);
    });

    it("should return false when addEventListener throws an error", () => {
      mockAddEventListener.mockImplementation(() => {
        throw new Error("Not supported");
      });

      const result = isOptionParamSupported();

      expect(result).toBe(false);
    });

    it("should clean up event listeners", () => {
      mockAddEventListener.mockImplementation(
        (
          _event,
          _fn,
          options: boolean | AddEventListenerOptions | undefined,
        ) => {
          if (options && typeof options === "object" && "passive" in options) {
            void options.passive;
          }
        },
      );

      isOptionParamSupported();

      expect(mockAddEventListener).toHaveBeenCalled();
      expect(mockRemoveEventListener).toHaveBeenCalled();

      const addCall = mockAddEventListener.mock.calls[0];
      const removeCall = mockRemoveEventListener.mock.calls[0];

      // Should use same parameters for add and remove
      expect(addCall?.[0]).toBe(removeCall?.[0]); // event type
      expect(addCall?.[1]).toBe(removeCall?.[1]); // function
      expect(addCall?.[2]).toEqual(removeCall?.[2]); // options
    });

    it("should handle case where removeEventListener throws", () => {
      mockAddEventListener.mockImplementation(
        (
          _event,
          _fn,
          options: boolean | AddEventListenerOptions | undefined,
        ) => {
          if (options && typeof options === "object" && "passive" in options) {
            void options.passive;
          }
        },
      );
      mockRemoveEventListener.mockImplementation(() => {
        throw new Error("Remove failed");
      });

      // Should not throw even if removeEventListener fails
      expect(() => {
        isOptionParamSupported();
      }).not.toThrow();
    });

    it("should use correct test event name", () => {
      mockAddEventListener.mockImplementation(
        (
          _event,
          _fn,
          options: boolean | AddEventListenerOptions | undefined,
        ) => {
          if (options && typeof options === "object" && "passive" in options) {
            void options.passive;
          }
        },
      );

      isOptionParamSupported();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        "test",
        expect.any(Function),
        expect.any(Object),
      );
    });

    it("should use empty function as event handler", () => {
      mockAddEventListener.mockImplementation(
        (
          _event,
          _fn,
          options: boolean | AddEventListenerOptions | undefined,
        ) => {
          if (options && typeof options === "object" && "passive" in options) {
            void options.passive;
          }
        },
      );

      isOptionParamSupported();

      const handler = mockAddEventListener.mock.calls[0]?.[1] as () => void;

      expect(typeof handler).toBe("function");

      // Should not throw when called
      expect(() => {
        handler();
      }).not.toThrow();
    });

    it("should create options object with passive getter", () => {
      let capturedOptions: AddEventListenerOptions | boolean | undefined;

      mockAddEventListener.mockImplementation(
        (_, __, options: boolean | AddEventListenerOptions | undefined) => {
          capturedOptions = options;

          if (options && typeof options === "object" && "passive" in options) {
            void options.passive;
          }
        },
      );

      isOptionParamSupported();

      expect(capturedOptions).toBeDefined();
      expect(typeof capturedOptions).toBe("object");
      expect(
        capturedOptions &&
          typeof capturedOptions === "object" &&
          "passive" in capturedOptions,
      ).toBe(true);
    });
  });
});
