import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AccountSettings from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/pages/AccountSettings.tsx";

import {
  mockTasks,
  medicationTasks,
  notes,
  teamMembers,
  teamPatients,
} from "/Users/aa/Desktop/Git Repos/CareLink_Adeena/src/services/mockData.ts";

// Mock react-router-dom
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock browser APIs
vi.stubGlobal("alert", vi.fn());
vi.stubGlobal("confirm", vi.fn());

describe("AccountSettings (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders main UI elements", () => {
    render(<AccountSettings />);

    expect(screen.getByText(/Account Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
    expect(
        screen.getByRole("button", { name: /^Delete$/i })
      ).toBeInTheDocument();
  });

  it("renders default form values", () => {
    render(<AccountSettings />);

    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com")
    ).toBeInTheDocument();
  });

  it("updates input fields when user types", () => {
    render(<AccountSettings />);

    const firstNameInput = screen.getByDisplayValue("John");

    fireEvent.change(firstNameInput, {
      target: { name: "firstName", value: "UpdatedName" },
    });

    expect(firstNameInput).toHaveValue("UpdatedName");
  });

  it("toggles password visibility", () => {
    render(<AccountSettings />);

    const passwordInput = screen.getByDisplayValue("password123");

    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByTestId("toggle-password");

    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
});

  it("navigates back when clicking arrow button", () => {
    render(<AccountSettings />);

    const buttons = screen.getAllByRole("button");
    const backButton = buttons[0];

    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("triggers alert on save", () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByText(/Save Changes/i));

    expect(globalThis.alert).toHaveBeenCalledWith("Changes Saved!");
  });

  it("triggers confirm on delete", () => {
    render(<AccountSettings />);

    fireEvent.click(
      screen.getByRole("button", { name: /^Delete$/i })
    );

    expect(globalThis.confirm).toHaveBeenCalledWith("Delete account?");
  });

  it("mock data file is valid and usable", () => {
    expect(mockTasks.length).toBeGreaterThan(0);
    expect(medicationTasks[0]).toHaveProperty("name");
    expect(notes[0]).toHaveProperty("title");
    expect(teamMembers[0]).toHaveProperty("email");
    expect(teamPatients[0]).toHaveProperty("firstName");
  });
});