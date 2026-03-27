import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AccountSettings from "../../src/pages/AccountSettings";

const renderComponent = () =>
  render(
    <BrowserRouter>
      <AccountSettings />
    </BrowserRouter>
  );

describe("AccountSettings UI Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("synchronizes input changes across the UI state", async () => {
    const user = userEvent.setup();
    renderComponent();

    const firstNameInput = screen.getByDisplayValue("John");
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Jane");

    expect(firstNameInput).toHaveValue("Jane");
  });

  /** FIX 1: Use Placeholder or Name instead of Label if IDs are missing **/
  it("interacts with the password visibility toggle and input type", async () => {
    const user = userEvent.setup();
    const { container } = renderComponent();
    const passwordInput = screen.getByDisplayValue("password123") as HTMLInputElement; 
    const toggleBtn = container.querySelector('button[onClick*="setShowPassword"]') || 
                      screen.getAllByRole("button").find(btn => btn.querySelector('.lucide-eye, .lucide-eye-off'));
   if (!toggleBtn) throw new Error("Could not find the password toggle button");

    expect(passwordInput.type).toBe("password");

    await user.click(toggleBtn);
    expect(passwordInput.type).toBe("text");

    await user.click(toggleBtn);
    expect(passwordInput.type).toBe("password");
  });
  it("displays the immutable username correctly in the profile card header", () => {
    renderComponent();
    const profileHandle = screen.getByText(/johndoe_care/i);
    expect(profileHandle).toBeInTheDocument();
  });

  it("shows the 'Changes Saved' alert when the header action is triggered", async () => {
    const user = userEvent.setup();
    renderComponent();

    const saveBtn = screen.getByRole("button", { name: /Save Changes/i });
    await user.click(saveBtn);
    expect(window.alert).toHaveBeenCalledWith("Changes Saved!");
  });

  /** FIX 2: Check classes on the element itself, not the parent **/
  it("ensures certain fields remain consistent with initial UI state", () => {
    renderComponent();
    
    const badge = screen.getByText(/Verified Caregiver ID/i);
    expect(badge).toBeInTheDocument();
    
    // In your code: <div class="d-flex ... text-success small fw-medium">
    expect(badge).toHaveClass("text-success");
    expect(badge).toHaveClass("small");
  });
});