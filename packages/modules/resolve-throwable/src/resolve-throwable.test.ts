import { describe, expect, it } from "vitest";
import { resolveThrowable } from "./resolve-throwable.ts";

describe("resolveThrowable", () => {
  describe("successful execution", () => {
    it("should return data on successful async function", async () => {
      const result = await resolveThrowable(async () =>
        Promise.resolve("success"),
      );

      expect(result.data).toBe("success");
      expect(result.error).toBeNull();
    });

    it("should return data on successful sync function", async () => {
      const result = await resolveThrowable(() => 42);

      expect(result.data).toBe(42);
      expect(result.error).toBeNull();
    });

    it("should handle resolved promises", async () => {
      const result = await resolveThrowable(() => Promise.resolve({ id: 1 }));

      expect(result.data).toEqual({ id: 1 });
      expect(result.error).toBeNull();
    });

    it("should handle null return value", async () => {
      const result = await resolveThrowable(() => null);

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });

    it("should handle undefined return value", async () => {
      const result = await resolveThrowable(() => undefined);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should return error on thrown Error", async () => {
      const result = await resolveThrowable(() => {
        throw new Error("test error");
      });

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe("test error");
    });

    it("should return error on rejected promise", async () => {
      const result = await resolveThrowable(() =>
        Promise.reject(new Error("rejected")),
      );

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe("rejected");
    });

    it("should handle custom error types", async () => {
      class CustomError extends Error {
        code: number;
        constructor(message: string, code: number) {
          super(message);
          this.code = code;
        }
      }

      const result = await resolveThrowable<CustomError, () => never>(() => {
        throw new CustomError("custom", 404);
      });

      expect(result.data).toBeNull();
      expect(result.error?.code).toBe(404);
    });

    it("should handle async function that throws", async () => {
      const result = await resolveThrowable(async () => {
        await Promise.resolve();
        throw new Error("async error");
      });

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe("async error");
    });
  });

  describe("type safety", () => {
    it("should preserve complex return types", async () => {
      type User = { name: string; age: number };
      const result = await resolveThrowable(
        async (): Promise<User> =>
          Promise.resolve({
            name: "John",
            age: 30,
          }),
      );

      expect(result.data?.name).toBe("John");
      expect(result.data?.age).toBe(30);
    });

    it("should handle array return types", async () => {
      const result = await resolveThrowable(() => [1, 2, 3]);

      expect(result.data).toEqual([1, 2, 3]);
    });
  });
});
