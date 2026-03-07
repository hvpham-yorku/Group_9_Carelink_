/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../../src/components/landingpage/Footer";
import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Header from "../../src/components/landingpage/Header";
import Hero from "../../src/components/landingpage/Hero";
import Section2 from "../../src/components/landingpage/Section2";
import Section3 from "../../src/components/landingpage/Section3";
import Section4 from "../../src/components/landingpage/Section4";
import Section5 from "../../src/components/landingpage/Section5";
import Section6 from "../../src/components/landingpage/Section6";
import LandingPage from "../../src/pages/LandingPage";

/* Tests for the Footer. */
describe("Footer Component", () => {
  it("renders the copyright text with the correct year", () => {
    render(<Footer />);
    const copyrightElement = screen.getByText(
      /© 2026 CareLink. All rights reserved./i,
    );
    expect(copyrightElement).toBeInTheDocument();
  });

  it("contains the correct Bootstrap styling classes for the copyright section", () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© 2026 CareLink/i);
    expect(copyrightText).toHaveClass("small");
    expect(copyrightText).toHaveClass("text-secondary");
  });

  it("does NOT render the product links (since they are commented out)", () => {
    render(<Footer />);
    const featuresLink = screen.queryByText(/Features/i);
    const pricingLink = screen.queryByText(/Pricing/i);

    expect(featuresLink).not.toBeInTheDocument();
    expect(pricingLink).not.toBeInTheDocument();
  });

  it("renders the top border line container", () => {
    const { container } = render(<Footer />);
    const borderDiv = container.querySelector(".border-top");
    expect(borderDiv).toBeInTheDocument();
    expect(borderDiv).toHaveClass("border-secondary");
  });
});

/* Tests for the Header */

// 1. Mock the useNavigate hook so we can track if it's called
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Header Component", () => {
  it("renders the logo and brand name", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByText(/CareLink/i)).toBeInTheDocument();
    // Check if the heart icon (SVG) is rendered by searching for its class
    const heartIcon = document.querySelector(".text-primary");
    expect(heartIcon).toBeInTheDocument();
  });

  it("contains the correct anchor links for page sections", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const featuresLink = screen.getByRole("link", { name: /features/i });
    const whoLink = screen.getByRole("link", { name: /who it's for/i });

    expect(featuresLink).toHaveAttribute("href", "#features");
    expect(whoLink).toHaveAttribute("href", "#who-its-for");
  });

  it("navigates to /login when the Sign in button is clicked", () => {
    const mockNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("has the correct Bootstrap classes for the sign-in button", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    const btn = screen.getByRole("button", { name: /sign in/i });
    expect(btn).toHaveClass("btn-primary", "px-5");
  });
});

/* Tests for the Hero Section */

describe("Hero Component", () => {
  it("renders both parts of the main heading", () => {
    render(<Hero />);
    // Checking for the two-part heading
    expect(screen.getByText(/Home Care Coordination,/i)).toBeInTheDocument();
    expect(screen.getByText(/Simplified/i)).toBeInTheDocument();
  });

  it("renders the supportive sub-headline", () => {
    render(<Hero />);
    const subHeadline = screen.getByText(
      /CareLink centralizes daily care tasks/i,
    );
    expect(subHeadline).toBeInTheDocument();
    expect(subHeadline).toHaveClass("text-secondary", "fw-light");
  });

  it('contains a functional "Learn More" anchor link pointing to #about', () => {
    render(<Hero />);
    const learnMoreLink = screen.getByRole("link", { name: /learn more/i });
    expect(learnMoreLink).toHaveAttribute("href", "#about");
    // Verify it has the bold border classes you added
    expect(learnMoreLink).toHaveClass("border-2", "border-primary");
  });

  it("renders the primary CTA button", () => {
    render(<Hero />);
    const getStartedBtn = screen.getByRole("button", { name: /get started!/i });
    expect(getStartedBtn).toBeInTheDocument();
    expect(getStartedBtn).toHaveClass("btn-primary");
  });

  it("renders the hero image with correct accessibility alt text (or exists)", () => {
    render(<Hero />);
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
    // Check for your Bootstrap sizing classes
    expect(image).toHaveClass("w-75", "shadow");
  });

  it("applies the correct background gradient style", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector(".Hero");
    // Verify the custom linear gradient is applied
    expect(section).toHaveStyle({
      background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
    });
  });
});

/* Tests for Section 2 */

describe("Section2 Component", () => {
  it("renders the main heading correctly", () => {
    render(<Section2 />);
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /Home Care Needs Better Tools/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('contains the "about" ID for anchor navigation', () => {
    const { container } = render(<Section2 />);
    const section = container.querySelector("#about");
    expect(section).toBeInTheDocument();
  });

  it("renders the paragraph with correct typography and spacing classes", () => {
    render(<Section2 />);
    // Since h5 is used as a paragraph here
    const textBlock = screen.getByRole("heading", { level: 5 });

    expect(textBlock).toHaveClass(
      "text-secondary",
      "fw-light",
      "fs-5",
      "lh-base",
    );
    expect(textBlock.textContent).toContain("Large hospital EHR systems");
  });

  it("uses the correct Bootstrap grid column classes for centering", () => {
    const { container } = render(<Section2 />);
    const column = container.querySelector(".col-11");

    // Verifying the responsive column widths you set
    expect(column).toHaveClass("col-md-8");
    expect(column).toHaveClass("col-lg-5");
  });

  it("applies the light background color to the section", () => {
    const { container } = render(<Section2 />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-light");
  });
});

/* Tests for Section 3 */

describe("Section3 - Features Component", () => {
  it("renders the main section heading and sub-headline", () => {
    render(<Section3 />);
    expect(screen.getByText(/Built for Home Care Teams/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Features designed with real nurses/i),
    ).toBeInTheDocument();
  });

  it("renders exactly 6 feature cards", () => {
    const { container } = render(<Section3 />);
    // We look for the 'col' class inside the features row
    const columns = container.querySelectorAll(".col");
    expect(columns.length).toBe(6);
  });

  it("renders specific feature titles correctly", () => {
    render(<Section3 />);
    const features = [
      "Patient-Centric Workspace",
      "Shift Handoff Notes",
      "Tasks & Medications",
      "Role-Based Access",
      "Multiple Patients & Locations",
      "Low Learning Curve",
    ];

    features.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("applies the correct shadow and border classes to cards", () => {
    const { container } = render(<Section3 />);
    const firstCard = container.querySelector(".card");

    // Verifying your design choices
    expect(firstCard).toHaveClass("shadow-sm");
    expect(firstCard).toHaveClass("border-0");
    expect(firstCard).toHaveClass("h-100"); // Ensures cards are same height
  });

  it('contains the "features" ID for navbar scrolling', () => {
    const { container } = render(<Section3 />);
    const section = container.querySelector("#features");
    expect(section).toBeInTheDocument();
  });

  it("renders icons within the colored background containers", () => {
    const { container } = render(<Section3 />);
    // Check for the bg-opacity-10 class you used for the icon circles
    const iconContainers = container.querySelectorAll(".bg-opacity-10");
    expect(iconContainers.length).toBe(6);
  });
});

/* Tests for Section 4 */

describe("Section4 - Benefits Component", () => {
  it("renders the section with the correct background and ID", () => {
    const { container } = render(<Section4 />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("id")).toBe("benefits");
    expect(section).toHaveClass("bg-primary");
  });

  it("renders the benefit heading in white text", () => {
    render(<Section4 />);
    const heading = screen.getByText(/The CareLink Difference/i);
    expect(heading).toBeInTheDocument();
    expect(heading.parentElement).toHaveClass("text-white");
  });

  it("renders all three benefit items with icons", () => {
    const { container } = render(<Section4 />);

    const benefitTitles = [
      "Reduce Missed Care Actions",
      "Improve Shift Continuity",
      "Single Source of Truth",
    ];

    benefitTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check that we have 3 CheckCircle2 icons (rendered as SVGs)
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBe(3);
  });

  it("renders the benefit descriptions with low opacity for visual hierarchy", () => {
    render(<Section4 />);
    const description = screen.getByText(
      /Visual indicators and shared task lists/i,
    );
    expect(description).toHaveClass("opacity-75", "fw-light");
  });

  it("renders the featured image with shadow and rounded corners", () => {
    render(<Section4 />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass("shadow-lg", "rounded", "img-fluid");
    expect(img).toHaveStyle({ objectFit: "cover" });
  });

  it("uses Bootstrap grid for side-by-side layout on medium screens+", () => {
    const { container } = render(<Section4 />);
    const columns = container.querySelectorAll(".col-md-6");
    expect(columns.length).toBe(2);
  });
});

/* Tests for Section 5 */

describe("Section5 - Target Audience Component", () => {
  it("renders the section with the correct anchor ID", () => {
    const { container } = render(<Section5 />);
    const section = container.querySelector("section");
    // Using standard .id check to avoid "Property does not exist" errors
    expect(section?.id).toBe("who-its-for");
  });

  it("renders the main heading and lead text", () => {
    render(<Section5 />);
    expect(screen.getByText(/Who CareLink Is For/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Designed for everyone involved/i),
    ).toBeInTheDocument();
  });

  it("renders exactly 6 audience cards", () => {
    const { container } = render(<Section5 />);
    // Check for the column divs that hold the cards
    const columns = container.querySelectorAll(".col");
    expect(columns.length).toBe(6);
  });

  it("verifies all specific audience titles exist", () => {
    render(<Section5 />);
    const audiences = [
      "Home-Care Nurses",
      "Personal Support Workers (PSWs)",
      "Professional Caregiving Agencies",
      "Family Caregivers",
      "Care Supervisors & Nurse Managers",
      "Small to Mid-Sized Organizations",
    ];

    audiences.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("applies the correct Bootstrap styling to the cards", () => {
    const { container } = render(<Section5 />);
    const firstCard = container.querySelector(".card");

    // Verifying your specific styling choices: bg-light and shadow-sm
    expect(firstCard?.classList.contains("bg-light")).toBe(true);
    expect(firstCard?.classList.contains("shadow-sm")).toBe(true);
    expect(firstCard?.classList.contains("h-100")).toBe(true);
  });

  it("uses a responsive grid layout", () => {
    const { container } = render(<Section5 />);
    const gridRow = container.querySelector(".row-cols-lg-3");
    // This confirms the 3-column layout is set for large screens
    expect(gridRow).not.toBeNull();
  });
});

/* Tests for Section 6 */

// 1. Mock the useNavigate hook
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("Section6 - Final CTA Component", () => {
  it("renders the call-to-action heading and subtitle", () => {
    render(
      <MemoryRouter>
        <Section6 />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Ready to Improve Your Care Coordination/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Join home care teams who trust CareLink/i),
    ).toBeInTheDocument();
  });

  it("applies the correct branded linear gradient background", () => {
    const { container } = render(
      <MemoryRouter>
        <Section6 />
      </MemoryRouter>,
    );
    const section = container.querySelector("section");
    // Verifying the specific CSS gradient matches your Hero section
    expect(section).toHaveStyle({
      background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
    });
  });

  it("navigates to /dashboard when the Get Started button is clicked", () => {
    const mockNavigate = vi.fn();
    (useNavigate as any).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <Section6 />
      </MemoryRouter>,
    );

    const ctaButton = screen.getByRole("button", { name: /get started!/i });
    fireEvent.click(ctaButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("uses the correct Bootstrap sizing for a large CTA button", () => {
    render(
      <MemoryRouter>
        <Section6 />
      </MemoryRouter>,
    );
    const btn = screen.getByRole("button", { name: /get started!/i });
    expect(btn).toHaveClass("btn-primary", "btn-lg", "px-5");
  });
});

/* Test LandingPage.tsx */

describe("LandingPage Integration", () => {
  it("contains the smooth scroll behavior in the document structure", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    // Check if the IDs targeted by the Navbar all exist on one page
    const ids = ["about", "features", "benefits", "who-its-for"];
    ids.forEach((id) => {
      const element = document.getElementById(id);
      expect(element).not.toBeNull();
    });
  });
});
