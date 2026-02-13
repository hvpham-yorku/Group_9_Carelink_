/*
    run npm install --save-dev @testing-library/react @testing-library/jest-dom jest
    then run npm i --save-dev @types/jest
*/
import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import LoginText from "../components/login/LoginText";
import LoginTextBox from "../components/login/LoginTextBox";

import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";

import { beforeEach, describe, expect, it, vi } from "vitest";

/*
    Tests whether the LoginText component exists and renders correctly.
    Checks whether the text appears correctly.
*/
describe("LoginText", () => {
  it("renders the correct heading text", () => {
    render(<LoginText />);

    const heading = screen.getByRole("heading", {
      name: /login to carelink!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

/*

    This tests the LoginTextBox component. It tests whether the component renders, the props were passed correctly,
    and that the attributes were applied correctly.
    
*/

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
    expect(input).toHaveAttribute("name", "username");
    expect(input).toHaveAttribute("id", "username");
    expect(input).toHaveAttribute("type", "text");
  });
});

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
