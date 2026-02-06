import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { copyToClipboard } from "./copy-to-clipboard.ts";

describe("copyToClipboard", () => {
  const originalNavigator = global.navigator;
  const originalDocument = global.document;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(global, "document", {
      value: originalDocument,
      writable: true,
    });
  });

  describe("modern Clipboard API", () => {
    it("should use navigator.clipboard.writeText when available", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global, "navigator", {
        value: { clipboard: { writeText: writeTextMock } },
        writable: true,
      });

      await copyToClipboard("test text");

      expect(writeTextMock).toHaveBeenCalledWith("test text");
    });

    it("should handle empty string", async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global, "navigator", {
        value: { clipboard: { writeText: writeTextMock } },
        writable: true,
      });

      await copyToClipboard("");

      expect(writeTextMock).toHaveBeenCalledWith("");
    });
  });

  describe("fallback behavior", () => {
    it("should use fallback when clipboard API is unavailable", async () => {
      Object.defineProperty(global, "navigator", {
        value: {},
        writable: true,
      });

      const mockTextArea = {
        value: "",
        select: vi.fn(),
      };

      const appendChildMock = vi.fn();
      const removeChildMock = vi.fn();
      const execCommandMock = vi.fn();

      Object.defineProperty(global, "document", {
        value: {
          createElement: vi.fn().mockReturnValue(mockTextArea),
          body: {
            appendChild: appendChildMock,
            removeChild: removeChildMock,
          },
          execCommand: execCommandMock,
        },
        writable: true,
      });

      await copyToClipboard("fallback text");

      expect(mockTextArea.value).toBe("fallback text");
      expect(mockTextArea.select).toHaveBeenCalled();
      expect(execCommandMock).toHaveBeenCalledWith("copy");
      expect(appendChildMock).toHaveBeenCalled();
      expect(removeChildMock).toHaveBeenCalled();
    });

    it("should use fallback when clipboard.writeText throws", async () => {
      const writeTextMock = vi.fn().mockRejectedValue(new Error("denied"));

      Object.defineProperty(global, "navigator", {
        value: { clipboard: { writeText: writeTextMock } },
        writable: true,
      });

      const mockTextArea = {
        value: "",
        select: vi.fn(),
      };

      const execCommandMock = vi.fn();

      Object.defineProperty(global, "document", {
        value: {
          createElement: vi.fn().mockReturnValue(mockTextArea),
          body: {
            appendChild: vi.fn(),
            removeChild: vi.fn(),
          },
          execCommand: execCommandMock,
        },
        writable: true,
      });

      await copyToClipboard("error fallback");

      expect(execCommandMock).toHaveBeenCalledWith("copy");
    });
  });
});
