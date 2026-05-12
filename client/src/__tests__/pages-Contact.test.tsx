import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Contact from "../pages/Contact";

vi.mock("../hooks/useSEO", () => ({
  useSEO: vi.fn(),
  SEO: { contact: { title: "Contact" } },
}));

vi.mock("../components/Navigation", () => ({
  default: () => <nav data-testid="navigation" />,
}));

vi.mock("../components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe("Contact Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the contact page", () => {
    render(<Contact />);
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    expect(screen.getByText("Send us a Message")).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<Contact />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Subject is required")).toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("validates email regex correctly", () => {
    expect(VALID_EMAIL_RE.test("john@example.com")).toBe(true);
    expect(VALID_EMAIL_RE.test("not-an-email")).toBe(false);
    expect(VALID_EMAIL_RE.test("missing@dotcom")).toBe(false);
    expect(VALID_EMAIL_RE.test("@domain.com")).toBe(false);
    expect(VALID_EMAIL_RE.test("")).toBe(false);
  });

  it("validates message minimum length", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Subject"), "Test Subject");
    await user.type(screen.getByLabelText("Message"), "Short");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText("Message must be at least 10 characters")).toBeInTheDocument();
  });

  it("clears field error on input change", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Full Name"), "John");
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Subject"), "Test Subject");
    await user.type(screen.getByLabelText("Message"), "This is a test message that is long enough to pass");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
      expect(messages).toHaveLength(1);
      expect(messages[0].name).toBe("John Doe");
      expect(messages[0].email).toBe("john@example.com");
    });
  });

  it("renders contact information cards", () => {
    render(<Contact />);
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Office Hours")).toBeInTheDocument();
  });

  it("shows phone number", () => {
    render(<Contact />);
    expect(screen.getByText("+233 257 077 972")).toBeInTheDocument();
  });
});
