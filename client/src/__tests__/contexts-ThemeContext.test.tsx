import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("light");
    expect(result.current.switchable).toBe(false);
  });

  it("does not provide toggleTheme when not switchable", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      ),
    });

    expect(result.current.toggleTheme).toBeUndefined();
  });

  it("provides toggleTheme when switchable is true", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    expect(result.current.toggleTheme).toBeDefined();
  });

  it("toggles theme when switchable", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("light");
    act(() => {
      result.current.toggleTheme!();
    });
    expect(result.current.theme).toBe("dark");
    act(() => {
      result.current.toggleTheme!();
    });
    expect(result.current.theme).toBe("light");
  });

  it("adds dark class to html element when dark", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    act(() => {
      result.current.toggleTheme!();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("removes dark class when toggling back to light", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    act(() => {
      result.current.toggleTheme!();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      result.current.toggleTheme!();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists theme to localStorage when switchable", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    act(() => {
      result.current.toggleTheme!();
    });
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("reads theme from localStorage on mount when switchable", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider switchable>{children}</ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("dark");
  });

  it("respects defaultTheme prop", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      ),
    });

    expect(result.current.theme).toBe("dark");
  });

  it("throws when useTheme is used outside ThemeProvider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within ThemeProvider");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });
});
