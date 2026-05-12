import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Apply from "../pages/Apply";

vi.mock("../hooks/useSEO", () => ({
  useSEO: vi.fn(),
  SEO: { apply: { title: "Apply" } },
}));

vi.mock("../components/Navigation", () => ({
  default: () => <nav data-testid="navigation" />,
}));

vi.mock("../components/Footer", () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock("wouter", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("../lib/manus", () => ({
  analyzeApplication: vi.fn().mockResolvedValue({
    summary: "Test summary of applicant background and fit.",
    score: 85,
    concerns: [],
    suggestedReply: "Dear Applicant, welcome!",
  }),
}));

describe("Apply Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the apply page with step 1", () => {
    render(<Apply />);
    expect(screen.getByText("Apply for Admission")).toBeInTheDocument();
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("shows progress indicator on step 1", () => {
    render(<Apply />);
    expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
  });

  it("validates step 1 fields", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Phone is required")).toBeInTheDocument();
  });

  it("validates email format on step 1", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "invalid");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "1234567890");

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("validates phone format on step 1", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "abc!!!");

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
  });

  it("advances to step 2 with valid step 1 data", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "123-456-7890");

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Course Selection & Background")).toBeInTheDocument();
  });

  it("validates step 2 fields", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "123-456-7890");
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Please select a course")).toBeInTheDocument();
    expect(screen.getByText("Bio is required")).toBeInTheDocument();
    expect(screen.getByText("Education is required")).toBeInTheDocument();
  });

  it("validates bio minimum length on step 2", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "123-456-7890");
    await user.click(screen.getByText("Next"));

    await user.type(screen.getByPlaceholderText(/share your background/i), "Short");
    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Bio must be at least 20 characters")).toBeInTheDocument();
  });

  it("validates agreement checkbox on step 3", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "123-456-7890");
    await user.click(screen.getByText("Next"));

    await user.selectOptions(
      screen.getByRole("combobox"),
      screen.getByText("Executive certificate in theology (Department of theology)").getAttribute("value") || ""
    );
    const bioField = screen.getByPlaceholderText(/share your background/i);
    await user.type(bioField, "I am a passionate student of theology with a deep interest in biblical studies and ministry work.");
    await user.type(screen.getByPlaceholderText(/describe your educational background/i), "Bachelor degree");

    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Submit Application"));

    expect(screen.getByText("You must agree to the terms")).toBeInTheDocument();
  });

  it("can go back from step 2 to step 1", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    await user.type(screen.getByPlaceholderText("Your full name"), "John Doe");
    await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
    await user.type(screen.getByPlaceholderText("(555) 123-4567"), "123-456-7890");
    await user.click(screen.getByText("Next"));

    expect(screen.getByText("Course Selection & Background")).toBeInTheDocument();

    await user.click(screen.getByText("Back"));

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("does not go back from step 1", async () => {
    const user = userEvent.setup();
    render(<Apply />);

    expect(screen.getByText("Personal Information")).toBeInTheDocument();

    await user.click(screen.getByText("Next"));
    expect(screen.getByText("Personal Information")).toBeInTheDocument(); // still on step 1 due to validation
  });
});
