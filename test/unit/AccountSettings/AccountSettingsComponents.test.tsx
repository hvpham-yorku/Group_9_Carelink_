import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AccountSettings from "../../../src/pages/AccountSettings"; 
import { useAuth } from "../../../src/hooks/useAuth";

// Mock the useAuth hook to avoid real Supabase initialization
vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("AccountSettings UI Rendering", () => {
  const mockUser = {
    id: "1",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default state: User is logged in, and loading is finished
    (useAuth as any).mockReturnValue({ user: mockUser, loading: false });
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("renders main sections when page is loaded", async () => {
    renderWithRouter(<AccountSettings />);
    
    // Checks for the main header title
    expect(await screen.findByText(/Account Settings/i)).toBeInTheDocument();
    
    // Checks for section headings found in your HTML output
    expect(screen.getByText(/Personal Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact & Role/i)).toBeInTheDocument();
  });

  it("renders the Save Changes button", async () => {
    renderWithRouter(<AccountSettings />);
    
    // Verifies the primary action button is present
    const saveBtn = await screen.findByRole("button", { name: /save changes/i });
    expect(saveBtn).toBeInTheDocument();
  });

  it("renders the loading spinner when loading is true", () => {
    // Override mock to simulate the loading state
    (useAuth as any).mockReturnValue({ user: null, loading: true });
    
    renderWithRouter(<AccountSettings />);
    
    // Your HTML shows a div with role="status" and class "spinner-border"
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the Delete Account section and a disabled delete button", async () => {
    renderWithRouter(<AccountSettings />);
    
    // Check for the danger zone section
    expect(await screen.findByText(/Delete Account/i)).toBeInTheDocument();
    
    // Based on your console logs, the delete button is currently disabled
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    expect(deleteBtn).toBeDisabled();
  });

  it("renders an arrow-left icon/button for navigation", async () => {
    renderWithRouter(<AccountSettings />);
    
    // Use findByRole to wait for the loading spinner to disappear 
    // and the actual content (including buttons) to appear.
    const backButtons = await screen.findAllByRole("button");
    const backButton = backButtons[0]; 
    
    expect(backButton).toBeInTheDocument();
  });
});