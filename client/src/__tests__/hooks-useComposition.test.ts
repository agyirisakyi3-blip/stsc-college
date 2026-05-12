import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useComposition } from "../hooks/useComposition";

describe("useComposition", () => {
  it("returns the expected handlers", () => {
    const { result } = renderHook(() => useComposition());

    expect(result.current).toHaveProperty("onCompositionStart");
    expect(result.current).toHaveProperty("onCompositionEnd");
    expect(result.current).toHaveProperty("onKeyDown");
    expect(result.current).toHaveProperty("isComposing");
  });

  it("isComposing returns false initially", () => {
    const { result } = renderHook(() => useComposition());
    expect(result.current.isComposing()).toBe(false);
  });

  it("sets composing state on composition start", () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    expect(result.current.isComposing()).toBe(true);
  });

  it("clears composing state after composition end (async)", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });
    expect(result.current.isComposing()).toBe(true);

    act(() => {
      result.current.onCompositionEnd(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.isComposing()).toBe(false);
    vi.useRealTimers();
  });

  it("calls original onCompositionStart callback", () => {
    const original = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onCompositionStart: original })
    );

    const event = {} as React.CompositionEvent<HTMLInputElement>;
    act(() => {
      result.current.onCompositionStart(event);
    });

    expect(original).toHaveBeenCalledWith(event);
  });

  it("calls original onCompositionEnd callback", () => {
    vi.useFakeTimers();
    const original = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onCompositionEnd: original })
    );

    const event = {} as React.CompositionEvent<HTMLInputElement>;
    act(() => {
      result.current.onCompositionEnd(event);
    });

    expect(original).toHaveBeenCalledWith(event);
    vi.useRealTimers();
  });

  it("stops propagation for Escape key during composition", () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    const keyEvent = {
      key: "Escape",
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(keyEvent.stopPropagation).toHaveBeenCalled();
  });

  it("stops propagation for Enter key during composition (without shift)", () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    const keyEvent = {
      key: "Enter",
      shiftKey: false,
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(keyEvent.stopPropagation).toHaveBeenCalled();
  });

  it("does NOT stop propagation for Shift+Enter during composition", () => {
    const { result } = renderHook(() => useComposition());

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    const keyEvent = {
      key: "Enter",
      shiftKey: true,
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(keyEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it("does not stop propagation for keys when not composing", () => {
    const { result } = renderHook(() => useComposition());

    const keyEvent = {
      key: "Escape",
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(keyEvent.stopPropagation).not.toHaveBeenCalled();
  });

  it("calls original onKeyDown callback", () => {
    const original = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onKeyDown: original })
    );

    const keyEvent = {
      key: "a",
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(original).toHaveBeenCalledWith(keyEvent);
  });

  it("does not call original onKeyDown when Escape is blocked during composition", () => {
    const original = vi.fn();
    const { result } = renderHook(() =>
      useComposition({ onKeyDown: original })
    );

    act(() => {
      result.current.onCompositionStart(
        {} as React.CompositionEvent<HTMLInputElement>
      );
    });

    const keyEvent = {
      key: "Escape",
      stopPropagation: vi.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.onKeyDown(keyEvent);
    });

    expect(original).not.toHaveBeenCalled();
  });
});
