import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

vi.mock("../pages/Home", () => ({ default: () => <div data-testid="page-home">Home</div> }));
vi.mock("../pages/About", () => ({ default: () => <div data-testid="page-about">About</div> }));
vi.mock("../pages/Courses", () => ({ default: () => <div data-testid="page-courses">Courses</div> }));
vi.mock("../pages/Contact", () => ({ default: () => <div data-testid="page-contact">Contact</div> }));
vi.mock("../pages/Apply", () => ({ default: () => <div data-testid="page-apply">Apply</div> }));
vi.mock("../pages/AdminRouter", () => ({ default: () => <div data-testid="page-admin">Admin</div> }));
vi.mock("../pages/NotFound", () => ({ default: () => <div data-testid="page-notfound">404</div> }));

vi.mock("../components/Navigation", () => ({ default: () => <nav data-testid="navigation" /> }));
vi.mock("../components/Footer", () => ({ default: () => <footer data-testid="footer" /> }));
vi.mock("../components/FloatingWhatsApp", () => ({ default: () => <div data-testid="floating-whatsapp" /> }));

vi.mock("../hooks/useSEO", () => ({ useSEO: vi.fn(), SEO: {} }));

vi.mock("../components/ui/sonner", () => ({ Toaster: () => <div data-testid="toaster" /> }));

function renderAtRoute(route: string) {
  window.history.pushState(null, "", route);
  return render(<App />);
}

describe("App", () => {
  it("renders Home page on /", () => {
    renderAtRoute("/");
    expect(screen.getByTestId("page-home")).toBeInTheDocument();
  });

  it("renders About page on /about", () => {
    renderAtRoute("/about");
    expect(screen.getByTestId("page-about")).toBeInTheDocument();
  });

  it("renders Courses page on /courses", () => {
    renderAtRoute("/courses");
    expect(screen.getByTestId("page-courses")).toBeInTheDocument();
  });

  it("renders Contact page on /contact", () => {
    renderAtRoute("/contact");
    expect(screen.getByTestId("page-contact")).toBeInTheDocument();
  });

  it("renders Apply page on /apply", () => {
    renderAtRoute("/apply");
    expect(screen.getByTestId("page-apply")).toBeInTheDocument();
  });

  it("renders Admin Dashboard on /admin", () => {
    renderAtRoute("/admin");
    expect(screen.getByTestId("page-admin")).toBeInTheDocument();
  });

  it("renders NotFound for unknown routes", () => {
    renderAtRoute("/this-does-not-exist");
    expect(screen.getByTestId("page-notfound")).toBeInTheDocument();
  });

  it("renders toaster component", () => {
    renderAtRoute("/");
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });
});
