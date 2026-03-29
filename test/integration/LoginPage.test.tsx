import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as useAuthHook from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/hooks/useAuth.ts";
import Login from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/pages/Login.tsx";
import { AuthCredentials } from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/hooks/useAuth.ts";

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("Login Page Integration (useAuth only)", () => {
  const setup = () => render(<Login />, { wrapper: MemoryRouter });

  const mockLogin = vi.fn(async (creds: AuthCredentials) => {
    if (creds.email === "test@example.com" && creds.password === "password123") {
      return { token: "fake-token" };
    } else {
      throw new Error("Invalid credentials");
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      logout: vi.fn(),
    });
  });

  it("renders all form elements", () => {
    setup();
    expect(screen.getByText(/login to carelink!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
  });

  it("shows/hides password when toggle clicked", async () => {
    setup();
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const toggleButton = screen.getByRole("button", { name: /show/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays Caps Lock warning when active", async () => {
    setup();
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);

    await user.click(passwordInput);
    await user.keyboard("{CapsLock}");

    expect(await screen.findByText(/caps lock is on/i)).toBeInTheDocument();
  });

  it("redirects if user is already logged in", () => {
    vi.spyOn(useAuthHook, "useAuth").mockReturnValue({
      user: { id: "1", name: "Test User" },
      loading: false,
      login: mockLogin,
      logout: vi.fn(),
    });
    setup();
    expect(mockNavigate).toHaveBeenCalledWith("/teams");
  });
});