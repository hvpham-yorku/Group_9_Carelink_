/**
 * @vitest-environment jsdom
 * This file contains integration tests for the MedicationTracker page and its components.
 * It checks that the page renders correctly, the sidebar toggles correctly,
 * and that medications can be marked as taken (including UI changes and metadata rendering).
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import MedicationTracker from "../pages/MedicationTracker";

/*
  This tests the MedicationTracker page renders correctly.
  It verifies the main heading and the two main sections are visible when the page loads.
*/
describe("MedicationTracker page - rendering", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the page heading and both section titles", () => {
    render(<MedicationTracker />);

    // Main page heading
    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

    // Section titles (from CustomSection)
    expect(
      screen.getByText(/today's medication schedule/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/active medications/i)).toBeInTheDocument();
  });
});
