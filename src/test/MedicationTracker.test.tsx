/**
 * @vitest-environment jsdom
 * This file contains integration tests for the MedicationTracker page and its components.
 * It checks that the page renders correctly and that the sidebar toggles correctly.
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
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

/*
  These tests cover sidebar behavior.
  The sidebar should collapse using the main toggle button
  and show again when clicked again.
*/
describe("MedicationTracker page - sidebar toggling", () => {
  beforeEach(() => {
    cleanup();
  });

  it("collapses the sidebar when 'Collapse Sidebar' is clicked and shows it again", () => {
    render(<MedicationTracker />);

    // Sidebar starts open
    expect(screen.getByText(/active medications/i)).toBeInTheDocument();

    // Collapse using main toggle button
    fireEvent.click(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    );

    // Sidebar content should disappear
    expect(screen.queryByText(/active medications/i)).not.toBeInTheDocument();

    // Button text changes when sidebar is closed
    expect(
      screen.getByRole("button", { name: /show sidebar/i }),
    ).toBeInTheDocument();

    // Show sidebar again
    fireEvent.click(screen.getByRole("button", { name: /show sidebar/i }));

    expect(screen.getByText(/active medications/i)).toBeInTheDocument();
  });
});
