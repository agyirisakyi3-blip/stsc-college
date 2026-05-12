import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Courses from "../pages/Courses";

vi.mock("../hooks/useSEO", () => ({
  useSEO: vi.fn(),
  SEO: { courses: { title: "Courses" } },
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

vi.mock("../data/courses.json", () => {
  const courses = [
    {
      id: "theo-01",
      title: "Executive certificate in theology",
      summary: "Foundational theology course",
      fullDescription: "A comprehensive introduction to theology.",
      level: "Department of theology",
      duration: "6 months",
      prerequisites: "None",
      thumbnail: "/images/Theologgy.jpeg",
      instructor: "Faculty Board",
      capacity: 50,
      startDate: "2026-09-01",
      schedule: "Full-time",
      outcomes: ["Understand core theology", "Apply biblical principles"],
    },
    {
      id: "bib-01",
      title: "Executive certificate in biblical studies",
      summary: "Introduction to biblical studies",
      fullDescription: "A comprehensive introduction to biblical studies.",
      level: "Department of biblical studies",
      duration: "6 months",
      prerequisites: "None",
      thumbnail: "/images/Biblical Studies.jpeg",
      instructor: "Faculty Board",
      capacity: 50,
      startDate: "2026-09-01",
      schedule: "Full-time",
      outcomes: ["Understand biblical foundation", "Interpret scripture"],
    },
    {
      id: "mus-01",
      title: "Executive certificate in music",
      summary: "Introduction to music ministry",
      fullDescription: "A comprehensive introduction to music ministry.",
      level: "Department of music (DAVIDIC COLLEGE OF MUSIC)",
      duration: "6 months",
      prerequisites: "None",
      thumbnail: "/images/Music.jpeg",
      instructor: "Music Faculty",
      capacity: 40,
      startDate: "2026-09-01",
      schedule: "Weekends",
      outcomes: ["Develop music skills", "Lead worship"],
    },
  ];
  return { default: courses };
});

describe("Courses Page", () => {
  it("renders the courses page", () => {
    render(<Courses />);
    expect(screen.getByText("Our Courses")).toBeInTheDocument();
  });

  it("renders all course filter buttons", () => {
    render(<Courses />);
    expect(screen.getByText("All")).toBeInTheDocument();
    const filterButtons = screen.getAllByRole("button");
    const departmentFilterButtons = filterButtons.filter(b => b.textContent?.startsWith("Department"));
    expect(departmentFilterButtons.length).toBe(7);
  });

  it("shows all courses by default", () => {
    render(<Courses />);
    expect(screen.getByText("Executive certificate in theology")).toBeInTheDocument();
    expect(screen.getByText("Executive certificate in biblical studies")).toBeInTheDocument();
    expect(screen.getByText("Executive certificate in music")).toBeInTheDocument();
  });

  it("filters courses by level", async () => {
    const user = userEvent.setup();
    render(<Courses />);

    await user.click(screen.getAllByText("Department of theology")[0]);

    expect(screen.getByText("Executive certificate in theology")).toBeInTheDocument();
    expect(screen.queryByText("Executive certificate in biblical studies")).not.toBeInTheDocument();
    expect(screen.queryByText("Executive certificate in music")).not.toBeInTheDocument();
  });

  it('shows empty state when no courses match filter', async () => {
    const user = userEvent.setup();
    render(<Courses />);

    await user.click(screen.getByText("Department of apostles"));

    expect(screen.getByText("No courses found for the selected level.")).toBeInTheDocument();
  });

  it('shows "All" filter as active by default', () => {
    render(<Courses />);
    const allButton = screen.getByText("All");
    expect(allButton.className).toContain("bg-accent");
  });

  it("opens course detail dialog on view details", async () => {
    const user = userEvent.setup();
    render(<Courses />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    expect(screen.getByText("Course Description")).toBeInTheDocument();
    expect(screen.getByText("Learning Outcomes")).toBeInTheDocument();
  });

  it("shows learning outcomes in detail dialog", async () => {
    const user = userEvent.setup();
    render(<Courses />);

    const viewDetailsButtons = screen.getAllByText("View Details");
    await user.click(viewDetailsButtons[0]);

    expect(screen.getByText("Understand core theology")).toBeInTheDocument();
  });

  it("shows apply link in course cards", () => {
    render(<Courses />);
    const applyLinks = screen.getAllByText("Apply");
    expect(applyLinks.length).toBe(3);
  });
});
