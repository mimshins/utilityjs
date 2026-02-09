import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { retryWithBackoff } from "./retry-with-backoff.ts";
import * as utils from "./utils.ts";

describe("retryWithBackoff", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should return result on first successful attempt", async () => {
    const cb = vi.fn(async () => await Promise.resolve("success"));

    const promise = retryWithBackoff(cb);

    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe("success");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and succeed", async () => {
    const cb = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");

    const promise = retryWithBackoff(cb);

    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe("success");
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("should throw after exhausting all retries", async () => {
    const error = new Error("persistent failure");
    const cb = vi.fn(async () => {
      await Promise.resolve();

      throw error;
    });

    await expect(async () => {
      const promise = retryWithBackoff(cb, { maxRetries: 2 });

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow("persistent failure");

    expect(cb).toHaveBeenCalledTimes(3);
  });

  it("should use default maxRetries of 3", async () => {
    const cb = vi.fn(async () => {
      await Promise.resolve();

      throw new Error("fail");
    });

    await expect(async () => {
      const promise = retryWithBackoff(cb);

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow("fail");

    expect(cb).toHaveBeenCalledTimes(4);
  });

  it("should apply exponential backoff delays", async () => {
    const cb = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");

    const calculateBackoffSpy = vi.spyOn(utils, "calculateBackoff");
    const delaySpy = vi.spyOn(utils, "delay");

    const promise = retryWithBackoff(cb, { baseDelay: 500 });

    await vi.runAllTimersAsync();

    await promise;

    expect(calculateBackoffSpy).toHaveBeenCalledWith(0, 500);
    expect(calculateBackoffSpy).toHaveBeenCalledWith(1, 500);
    expect(delaySpy).toHaveBeenCalledTimes(2);
  });

  it("should not delay after last retry attempt", async () => {
    const cb = vi.fn(async () => {
      await Promise.resolve();

      throw new Error("fail");
    });

    const delaySpy = vi.spyOn(utils, "delay");

    await expect(async () => {
      const promise = retryWithBackoff(cb, { maxRetries: 1 });

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow("fail");

    expect(delaySpy).toHaveBeenCalledTimes(1);
  });

  it("should respect shouldRetry predicate", async () => {
    const nonRetryableError = new Error("validation error");

    const cb = vi.fn(async () => {
      await Promise.resolve();

      throw nonRetryableError;
    });

    const shouldRetry = vi.fn((error: Error) =>
      error.message.includes("network"),
    );

    await expect(async () => {
      const promise = retryWithBackoff(cb, { shouldRetry });

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow("validation error");

    expect(cb).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(nonRetryableError);
  });

  it("should retry when shouldRetry returns true", async () => {
    const error = new Error("network error");
    const cb = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce("success");

    const shouldRetry = vi.fn((error: Error) =>
      error.message.includes("network"),
    );

    const promise = retryWithBackoff(cb, { shouldRetry });

    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result).toBe("success");
    expect(cb).toHaveBeenCalledTimes(2);
    expect(shouldRetry).toHaveBeenCalledWith(error);
  });

  it("should handle non-Error thrown values", async () => {
    const cb = vi.fn(async () => {
      await Promise.resolve();

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw "string error";
    });

    await expect(async () => {
      const promise = retryWithBackoff(cb, { maxRetries: 0 });

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow("string error");
  });

  it("should convert non-Error values to Error instances", async () => {
    const cb = vi.fn(async () => {
      await Promise.resolve();

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw "string error";
    });

    const shouldRetry = vi.fn(() => false);

    await expect(async () => {
      const promise = retryWithBackoff(cb, { shouldRetry });

      await vi.runAllTimersAsync();

      await promise;
    }).rejects.toThrow();

    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should work with maxRetries set to 0", async () => {
    const cb = vi.fn(async () => {
      await Promise.resolve();

      throw new Error("fail");
    });

    const promise = retryWithBackoff(cb, { maxRetries: 0 });

    await vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow("fail");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("should use custom baseDelay", async () => {
    const cb = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce("success");

    const calculateBackoffSpy = vi.spyOn(utils, "calculateBackoff");

    const promise = retryWithBackoff(cb, { baseDelay: 2000 });

    await vi.runAllTimersAsync();

    await promise;

    expect(calculateBackoffSpy).toHaveBeenCalledWith(0, 2000);
  });
});
