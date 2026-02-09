import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateBackoff, delay } from "./utils.ts";

describe("calculateBackoff", () => {
  it("should calculate exponential backoff with jitter", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    const result = calculateBackoff(0, 1000);

    expect(result).toBe(1500);
  });

  it("should increase delay exponentially with attempt number", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    expect(calculateBackoff(0, 1000)).toBe(1000);
    expect(calculateBackoff(1, 1000)).toBe(2000);
    expect(calculateBackoff(2, 1000)).toBe(4000);
    expect(calculateBackoff(3, 1000)).toBe(8000);
  });

  it("should add random jitter between 0-1000ms", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.75);

    const result = calculateBackoff(0, 1000);

    expect(result).toBe(1750);
  });

  it("should use default baseDelay of 1000ms", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const result = calculateBackoff(0);

    expect(result).toBe(1000);
  });

  it("should work with custom baseDelay", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const result = calculateBackoff(2, 500);

    expect(result).toBe(2000);
  });
});

describe("delay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should delay execution for specified milliseconds", async () => {
    const promise = delay(1000);

    vi.advanceTimersByTime(999);
    expect(promise).not.toBe(
      await Promise.race([promise, Promise.resolve("not resolved")]),
    );

    vi.advanceTimersByTime(1);
    await expect(promise).resolves.toBeUndefined();
  });

  it("should resolve with undefined", async () => {
    const promise = delay(500);

    vi.advanceTimersByTime(500);

    await expect(promise).resolves.toBeUndefined();
  });

  it("should handle zero delay", async () => {
    const promise = delay(0);

    vi.advanceTimersByTime(0);

    await expect(promise).resolves.toBeUndefined();
  });
});
