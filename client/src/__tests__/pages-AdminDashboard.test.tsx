import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminDashboard from "../pages/AdminDashboard";

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

const mockApplications = [
  {
    id: "APP-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    courseTitle: "Theology 101",
    bio: "Passionate about theology.",
    education: "Bachelor degree",
    aiAnalysis: {
      summary: "Good fit",
      score: 85,
      suggestedReply: "Dear John, welcome!",
      concerns: [],
    },
    submittedAt: "2026-01-15T10:00:00.000Z",
    status: "Approved",
  },
  {
    id: "APP-2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    courseTitle: "Biblical Studies 201",
    bio: "Experienced minister.",
    education: "Masters in Divinity",
    aiAnalysis: {
      summary: "Strong candidate",
      score: 65,
      suggestedReply: "Dear Jane, thank you for applying.",
      concerns: ["May benefit from foundational course first"],
    },
    submittedAt: "2026-02-20T14:30:00.000Z",
    status: "Under Review",
  },
];

describe("AdminDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows login screen when not authenticated", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter admin password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows demo password hint", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Demo password: admin123")).toBeInTheDocument();
  });

  it("authenticates with correct password", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    expect(screen.getByText("Manage applications and AI insights")).toBeInTheDocument();
  });

  it("shows error with wrong password", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "wrong");
    await user.click(screen.getByText("Login"));

    const { toast } = await import("sonner");
    expect(toast.error).toHaveBeenCalledWith("Invalid password");
  });

  it("shows admin panel after login with applications in localStorage", async () => {
    localStorage.setItem("applications", JSON.stringify(mockApplications));
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays application statistics", async () => {
    localStorage.setItem("applications", JSON.stringify(mockApplications));
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    expect(screen.getByText("Total Applications")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByText("1")).toHaveLength(2); // one for approved count, one for under review
  });

  it("filters applications by status", async () => {
    localStorage.setItem("applications", JSON.stringify(mockApplications));
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    await user.click(screen.getByRole("button", { name: "Approved" }));

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("shows empty state when no applications", async () => {
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    expect(screen.getByText("No applications found")).toBeInTheDocument();
  });

  it("supports logout", async () => {
    localStorage.setItem("applications", JSON.stringify(mockApplications));
    const user = userEvent.setup();
    render(<AdminDashboard />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "admin123");
    await user.click(screen.getByText("Login"));

    expect(screen.getByText("Logout")).toBeInTheDocument();

    await user.click(screen.getByText("Logout"));

    expect(screen.getByPlaceholderText("Enter admin password")).toBeInTheDocument();
  });
});
