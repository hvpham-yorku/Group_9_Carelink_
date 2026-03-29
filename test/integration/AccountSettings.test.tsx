import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, vi, beforeEach, expect } from "vitest";
import AccountSettings from "../../src/pages/AccountSettings";
import { useAuth } from "../../src/hooks/useAuth";
import { repositories } from "../../src/data";

// Mock useAuth
vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Mock profile repository
const mockProfile = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phoneNumber: "555-1234",
  jobTitle: "Nurse",
};

repositories.profile.getProfile = vi.fn().mockResolvedValue(mockProfile);
repositories.profile.updateFirstName = vi.fn().mockResolvedValue(undefined);
repositories.profile.updateLastName = vi.fn().mockResolvedValue(undefined);

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("AccountSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: { id: "user123" },
    });
  });

  it("renders form with fetched profile data", async () => {
    render(
      <BrowserRouter>
        <AccountSettings />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    });
  });

  it("updates input values and saves changes", async () => {
    render(
      <BrowserRouter>
        <AccountSettings />
      </BrowserRouter>
    );

    // 1. Wait for data to load
    await waitFor(() => screen.getByDisplayValue("Jane"));

    /** * FIX: The error showed that <label> is not linked to <input>.
     * Instead of getByLabelText, we target by the 'name' attribute 
     * or use getByText + navigating to the input.
     */
    const firstNameInput = screen.getByDisplayValue("Jane");
    const lastNameInput = screen.getByDisplayValue("Doe");

    fireEvent.change(firstNameInput, { target: { value: "Janet" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });

    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(repositories.profile.updateFirstName).toHaveBeenCalledWith("user123", "Janet");
      expect(repositories.profile.updateLastName).toHaveBeenCalledWith("user123", "Smith");
    });
  });

  it("navigates back when arrow button clicked", async () => {
    render(
      <BrowserRouter>
        <AccountSettings />
      </BrowserRouter>
    );

    // 2. CRITICAL: Wait for loading spinner to disappear before clicking
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());

    // The back button is the only button with an SVG inside it in the header
    const backButton = screen.getByRole("button", { name: "" }); 
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});