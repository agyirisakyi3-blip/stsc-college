import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistFn } from "../hooks/usePersistFn";

describe("usePersistFn", () => {
  it("returns the same function reference across renders", () => {
    const fn = () => 42;
    const { result, rerender } = renderHook(() => usePersistFn(fn));

    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("always calls the latest function", () => {
    const fn1 = vi.fn();
    const { result, rerender } = renderHook(
      ({ fn }) => usePersistFn(fn),
      { initialProps: { fn: fn1 } }
    );

    result.current();
    expect(fn1).toHaveBeenCalledTimes(1);

    const fn2 = vi.fn();
    rerender({ fn: fn2 });

    result.current();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn1).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the wrapped function", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => usePersistFn(fn));

    result.current("a", 1, true);
    expect(fn).toHaveBeenCalledWith("a", 1, true);
  });

  it("preserves the return value", () => {
    const fn = (x: number) => x * 2;
    const { result } = renderHook(() => usePersistFn(fn));

    expect(result.current(5)).toBe(10);
  });

  it("preserves `this` context", () => {
    const { result } = renderHook(() =>
      usePersistFn(function (this: any) {
        return this.value;
      })
    );

    const obj = { value: 42, fn: result.current };
    expect(obj.fn()).toBe(42);
  });
});
