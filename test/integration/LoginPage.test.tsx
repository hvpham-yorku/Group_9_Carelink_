import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import Login from "../../src/pages/Login";
import { authService } from "../../src/services/authService";

// ✅ FIX 1: mock hook properly
vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(() => ({ user: null })),
}));

// ✅ FIX 2: mock service properly
vi.mock("../../src/services/authService", () => ({
  authService: {
    signIn: vi.fn(),
  },
}));

const mockedSignIn = authService.signIn as any;

const renderApp = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teams" element={<div>Teams Page</div>} />
        <Route path="/forgot-password" element={<div>Forgot Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders login form", () => {
    renderApp();

    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  test("calls authService on submit", async () => {
    mockedSignIn.mockResolvedValue({});

    renderApp();

    fireEvent.change(screen.getByPlaceholderText(/name@company.com/i), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalled();
    });
  });

  test("shows error when login fails", async () => {
  mockedSignIn.mockRejectedValue(new Error("Invalid credentials"));

  renderApp();

  // 🔥 REQUIRED: fill inputs
  fireEvent.change(screen.getByPlaceholderText(/name@company.com/i), {
    target: { value: "bad@test.com" },
  });

  fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
    target: { value: "wrongpass" },
  });

  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    renderApp();

    const input = screen.getByPlaceholderText(/••••••••/i);
    const toggle = screen.getByRole("button", { name: /show/i });

    fireEvent.click(toggle);

    expect(input).toHaveAttribute("type", "text");
  });

  test("shows caps lock warning", async () => {
  renderApp();

  const input = screen.getByPlaceholderText(/••••••••/i);

  // 🔥 Create a real event and override method
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
  });

  // force CapsLock ON
  Object.defineProperty(event, "getModifierState", {
    value: (key: string) => key === "CapsLock",
  });

  input.dispatchEvent(event);

  expect(await screen.findByText(/caps lock is on/i)).toBeInTheDocument();
  });

  test("navigates to forgot password page", async () => {
  renderApp();

  fireEvent.click(screen.getByText(/forgot\?/i));

  expect(await screen.findByText(/forgot page/i)).toBeInTheDocument();
  });
});