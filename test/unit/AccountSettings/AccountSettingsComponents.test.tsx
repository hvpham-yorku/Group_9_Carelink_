import "@testing-library/jest-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AccountSettings from "../../../src/pages/AccountSettings";

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AccountSettings />
    </BrowserRouter>
  );

describe("AccountSettings UI Structure", () => {
  beforeEach(() => {
    cleanup();
  });

  /** 1. Layout & Containers **/
  it("renders the main container with correct Bootstrap background and padding", () => {
    const { container } = renderComponent();
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass("bg-light", "min-vh-100", "py-5");
  });

  it("renders the account card with rounded corners and shadow", () => {
    renderComponent();
    // Look for the card container
    const card = screen.getByText(/Personal Details/i).closest(".card");
    
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("border-0", "shadow-sm", "overflow-hidden");
    expect(card).toHaveStyle({ borderRadius: '16px' });
  });

  /** 2. Typography & Content **/
  it("renders the correct heading and sub-headline text", () => {
    renderComponent();
    
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText(/Update your information and security/i)).toBeInTheDocument();
  });

  it("renders the 'Permanent' username warning with specific small styling", () => {
    renderComponent();
    const warning = screen.getByText(/Username is permanent and cannot be changed/i);
    
    expect(warning).toBeInTheDocument();
    expect(warning).toHaveStyle({ fontSize: '11px' });
    expect(warning).toHaveClass("text-muted");
  });

  /** 3. Input Group UI **/
  it("renders decorative icons (Mail, Phone, Lock) inside input groups", () => {
    const { container } = renderComponent();
    
    // Check for the presence of the input-group-text spans
    const icons = container.querySelectorAll(".input-group-text");
    
    // We expect 3 icons (Mail, Phone, Lock)
    expect(icons.length).toBe(3);
    expect(icons[0]).toHaveClass("bg-white", "border-end-0");
  });

  /** 4. Form Fields Initial State **/
  it("renders all form fields with the correct initial placeholder values", () => {
    renderComponent();
    
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1 (555) 000-0000")).toBeInTheDocument();
  });

  /** 5. Danger Zone UI **/
  it("renders the Delete Account section with danger styling", () => {
    renderComponent();
    
    const deleteTitle = screen.getByText("Delete Account");
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    
    expect(deleteTitle).toHaveClass("text-danger", "fw-bold");
    expect(deleteBtn).toHaveClass("btn-outline-danger", "btn-sm");
    
    // Check for the light red background on the section
    const dangerSection = deleteTitle.closest(".p-4");
    expect(dangerSection).toHaveClass("bg-light");
  });

  /** 6. Footer UI - Fixed for actual DOM structure **/
  it("renders the platform branding footer with correct styling", () => {
    renderComponent();
    
    // 1. Find the text element
    const footerText = screen.getByText(/CareLink Platform • Professional Caregiver Suite/i);
    
    // 2. Verify classes on the text itself (from your code: "text-muted small opacity-50")
    expect(footerText).toHaveClass("text-muted");
    expect(footerText).toHaveClass("small");
    expect(footerText).toHaveClass("opacity-50");

    // 3. Verify alignment/spacing on the parent wrapper
    const footerContainer = footerText.parentElement;
    expect(footerContainer).toHaveClass("text-center");
    expect(footerContainer).toHaveClass("mt-4");
  });
});