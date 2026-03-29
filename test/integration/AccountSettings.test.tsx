// test/integration/AccountSettings.test.tsx
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import AccountSettings from "../../src/pages/AccountSettings";
import { CaregiverInfo } from "../../src/types/Types";

// --- Mock Auth Module ---
const mockUser: CaregiverInfo & { password: string } = {
  caregiverId: "cg-123",
  firstName: "John",
  lastName: "Doe",
  phone: "123-456-7890",
  email: "johndoe@example.com",
  jobTitle: "Caregiver",
  password: "password123",
};

const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("../../src/hooks/auth", () => ({
  useAuth: () => ({
    user: mockUser,
    login: mockLogin,
    logout: mockLogout,
    updateUser: mockUpdateUser,
  }),
}));

// --- Render Helper ---
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

  it("interacts with the password visibility toggle and input type", async () => {
  const user = userEvent.setup();
  renderComponent();

  // Get password input by its current value
  const passwordInput = screen.getByDisplayValue("password123") as HTMLInputElement;

  // Get toggle button by test id
  const toggleBtn = screen.getByTestId("toggle-password");

  // Initially, the input type should be 'password'
  expect(passwordInput.type).toBe("password");

  // Click to show password
  await user.click(toggleBtn);
  expect(passwordInput.type).toBe("text");

  // Click again to hide password
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

  it("ensures certain fields remain consistent with initial UI state", () => {
    renderComponent();

    const badge = screen.getByText(/Verified Caregiver ID/i);
    expect(badge).toBeInTheDocument();

    // Check for classes
    expect(badge).toHaveClass("text-success");
    expect(badge).toHaveClass("small");
  });
});