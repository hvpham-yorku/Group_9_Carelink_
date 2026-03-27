import "@testing-library/jest-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({ 
    user: null,
  }),
}));

vi.mock("../../../src/services/authService", () => ({
  authService: {
    signIn: vi.fn(() => Promise.resolve()), 
  },
}));

import LoginText from "../../../src/components/login/LoginText";
import LoginTextBox from "../../../src/components/login/LoginTextBox";
import Login from "../../../src/pages/Login";

describe("LoginText", () => {
  it("renders the correct heading text", () => {
    render(<LoginText />);
    const heading = screen.getByText(/login/i); 
    expect(heading).toBeInTheDocument();
  });
});

describe("LoginTextBox", () => {
  it("renders an input with correct attributes", () => {
    render(
      <LoginTextBox
        name="username"
        id="username"
        placeholder="Enter username"
      />,
    );
    const input = screen.getByPlaceholderText(/enter username/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });
});

describe("Login Component - Passing Tests", () => {
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

  /** Test: Forgot Password **/
  it("navigates to forgot-password when link is clicked", () => {
    renderComponent();
    const link = screen.getByText(/forgot\?/i);
    expect(link.getAttribute("href")).toBe("/forgot-password");
  });

  /** Test: Show Password Toggle **/
  it("toggles password visibility correctly", () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    const toggleBtn = screen.getByRole("button", { name: /show/i });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe("text");
  });

  /** Test: Caps Lock Detection **/
  it("shows warning when Caps Lock is active", () => {
  renderComponent();
  const passwordInput = screen.getByPlaceholderText("••••••••");

  const capsLockEvent = new KeyboardEvent('keyup', {
    bubbles: true,
    cancelable: true,
  });
  
  Object.defineProperty(capsLockEvent, 'getModifierState', {
    value: (key: string) => key === 'CapsLock',
  });

  fireEvent(passwordInput, capsLockEvent);

  const warning = screen.getByText(/caps lock is on/i);
  expect(warning).toBeInTheDocument();
});

  /** Test: Loading Bar **/
  it("renders the loading bar during submission", async () => {
    renderComponent();
    
    const emailInput = screen.getByPlaceholderText(/name@company.com/i);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "user@carelink.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123" } });

    fireEvent.click(submitBtn);

    const progressBar = document.querySelector(".progress-bar");
    expect(progressBar).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });
});