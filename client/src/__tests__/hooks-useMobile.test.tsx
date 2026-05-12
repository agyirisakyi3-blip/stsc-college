import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../hooks/useMobile";

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;
  let listeners: Array<() => void> = [];
  const originalAddEventListener = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    window.matchMedia = ((query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      addEventListener: (_: string, listener: () => void) => {
        listeners.push(listener);
      },
      removeEventListener: () => {
        listeners = [];
      },
    })) as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalAddEventListener;
  });

  it("returns false on desktop width", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true on mobile width", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 375,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false exactly at boundary (768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 768,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("updates when window is resized", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    Object.defineProperty(window, "innerWidth", {
      value: 375,
      writable: true,
    });

    act(() => {
      listeners.forEach((l) => l());
    });

    expect(result.current).toBe(true);
  });
});
