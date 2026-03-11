/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/
import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../src/pages/Login";
import { BrowserRouter } from "react-router-dom";

import { beforeEach, describe, expect, it, vi } from "vitest";


/*
    This tests the Login Page. It checks whethers the navigation on button click works correctly.
*/

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Page", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders login heading", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /login to carelink!/i }),
    ).toBeInTheDocument();
  });

  it("renders username and password inputs", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
  });

  it("navigates to dashboard when login button is clicked", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const button = screen.getByRole("button", { name: /login/i });

    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
