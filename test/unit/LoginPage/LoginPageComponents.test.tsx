import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// ✅ Your type
import type { AuthCredentials } from "../../../src/types/Types";

// ✅ Inline mock data (no data.ts needed)
const mockLoginData: {
  validUser: AuthCredentials;
  invalidUser: AuthCredentials;
} = {
  validUser: {
    email: "user@carelink.com",
    password: "Password123",
  },
  invalidUser: {
    email: "wrong@carelink.com",
    password: "wrongpass",
  },
};

// ✅ Helper
const isValidLogin = (credentials: AuthCredentials) =>
  credentials.email === mockLoginData.validUser.email &&
  credentials.password === mockLoginData.validUser.password;

// ✅ Mock useAuth (data-driven)
vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    signIn: vi.fn((credentials: AuthCredentials) => {
      return isValidLogin(credentials)
        ? Promise.resolve({ success: true })
        : Promise.reject(new Error("Invalid credentials"));
    }),
  }),
}));

import LoginText from "../../../src/components/login/LoginText";
import LoginTextBox from "../../../src/components/login/LoginTextBox";
import Login from "../../../src/pages/Login";

describe("LoginText", () => {
  it("renders the correct heading text", () => {
    render(<LoginText />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});

describe("LoginTextBox", () => {
  it("renders an input with correct attributes", () => {
    render(
      <LoginTextBox
        name="username"
        id="username"
        placeholder="Enter username"
      />
    );

    const input = screen.getByPlaceholderText(/enter username/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });
});

describe("Login Component - Data Driven", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it("navigates to forgot-password when link is clicked", () => {
    renderComponent();

    const link = screen.getByText(/forgot\?/i);
    expect(link.getAttribute("href")).toBe("/forgot-password");
  });

  it("toggles password visibility correctly", () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;

    const toggleBtn =
      screen.queryByTestId("toggle-password") ||
      screen.getByRole("button", { name: /show/i });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleBtn!);

    expect(passwordInput.type).toBe("text");
  });

  it("shows warning when Caps Lock is active", () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText("••••••••");

    const event = new KeyboardEvent("keyup", { bubbles: true });

    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "CapsLock",
    });

    fireEvent(passwordInput, event);

    expect(screen.getByText(/caps lock is on/i)).toBeInTheDocument();
  });

  it("renders loading state when valid credentials are submitted", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/name@company.com/i);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, {
      target: { value: mockLoginData.validUser.email },
    });

    fireEvent.change(passwordInput, {
      target: { value: mockLoginData.validUser.password },
    });

    fireEvent.click(submitBtn);

    const progressBar = document.querySelector(".progress-bar");

    expect(progressBar).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it("shows error on invalid credentials", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/name@company.com/i);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, {
      target: { value: mockLoginData.invalidUser.email },
    });

    fireEvent.change(passwordInput, {
      target: { value: mockLoginData.invalidUser.password },
    });

    fireEvent.click(submitBtn);

    const error = await screen.findByText(/invalid/i);
    expect(error).toBeInTheDocument();
  });
});