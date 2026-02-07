import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useOnChange } from "./use-on-change.ts";

vi.mock("@utilityjs/use-get-latest", () => ({
  useGetLatest: (value: unknown) => ({ current: value }),
}));

vi.mock("@utilityjs/use-previous-value", () => ({
  usePreviousValue: vi.fn(),
}));

const mockUsePreviousValue = vi.mocked(
  await import("@utilityjs/use-previous-value"),
).usePreviousValue;

describe("useOnChange", () => {
  it("should call onChange on initial render when value differs from previous (undefined)", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue(undefined);
    renderHook(() => useOnChange("initial", onChange));

    expect(onChange).toHaveBeenCalledWith("initial");
  });

  it("should not call onChange when value equals previous value", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue("same");
    renderHook(() => useOnChange("same", onChange));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should call onChange when value changes from previous", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue("old");
    renderHook(() => useOnChange("new", onChange));

    expect(onChange).toHaveBeenCalledWith("new");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should handle object reference changes", () => {
    const onChange = vi.fn();
    const obj1 = { id: 1 };
    const obj2 = { id: 1 };

    mockUsePreviousValue.mockReturnValue(obj1);
    renderHook(() => useOnChange(obj2, onChange));

    // Different references, so onChange fires
    expect(onChange).toHaveBeenCalledWith(obj2);
  });

  it("should not call onChange when same object reference", () => {
    const onChange = vi.fn();
    const obj = { id: 1 };

    mockUsePreviousValue.mockReturnValue(obj);
    renderHook(() => useOnChange(obj, onChange));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should call onChange on re-render when value changes", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue("old");
    const { rerender } = renderHook(
      ({ value }) => useOnChange(value, onChange),
      { initialProps: { value: "first" } },
    );

    expect(onChange).toHaveBeenCalledWith("first");

    onChange.mockClear();
    mockUsePreviousValue.mockReturnValue("first");
    rerender({ value: "second" });

    expect(onChange).toHaveBeenCalledWith("second");
  });

  it("should handle null and undefined transitions", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue(null);
    renderHook(() => useOnChange(undefined, onChange));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("should handle numeric value changes", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue(0);
    renderHook(() => useOnChange(1, onChange));

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("should handle boolean value changes", () => {
    const onChange = vi.fn();

    mockUsePreviousValue.mockReturnValue(false);
    renderHook(() => useOnChange(true, onChange));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("should use the latest callback via useGetLatest", () => {
    const onChange1 = vi.fn();
    const onChange2 = vi.fn();

    mockUsePreviousValue.mockReturnValue("old");
    const { rerender } = renderHook(({ cb }) => useOnChange("new", cb), {
      initialProps: { cb: onChange1 },
    });

    expect(onChange1).toHaveBeenCalledWith("new");

    // Change callback but keep same value
    onChange1.mockClear();
    mockUsePreviousValue.mockReturnValue("new");
    rerender({ cb: onChange2 });

    expect(onChange2).not.toHaveBeenCalled();
  });
});
