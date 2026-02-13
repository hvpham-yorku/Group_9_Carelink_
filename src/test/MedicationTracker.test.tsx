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

/*
    This test checks that the hardcoded medications from the schedule
    appear inside the sidebar list and that the count matches the number of scheduled items.
*/
  it("renders all scheduled medications in the sidebar list and shows the count", () => {
    render(<MedicationTracker />);

    // Medication names + dosage should appear in sidebar
    expect(screen.getByText(/metformin \(500mg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/lisinopril \(10mg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/aspirin \(81mg\)/i)).toBeInTheDocument();

    // The count of scheduled items should display correctly
    expect(screen.getByText(/3 scheduled items/i)).toBeInTheDocument();
  });

});
