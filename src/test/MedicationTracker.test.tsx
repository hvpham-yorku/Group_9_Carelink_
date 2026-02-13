/**
 * ITR 1 TEST
 * @vitest-environment jsdom
 * This file contains integration tests for the MedicationTracker page and its components.
 * It checks that the page renders correctly, the sidebar toggles correctly,
 * and that medications can be marked as taken (including UI changes and metadata rendering).
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

    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

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

    expect(screen.getByText(/metformin \(500mg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/lisinopril \(10mg\)/i)).toBeInTheDocument();
    expect(screen.getByText(/aspirin \(81mg\)/i)).toBeInTheDocument();

    expect(screen.getByText(/3 scheduled items/i)).toBeInTheDocument();
  });
});

/*
  These tests cover sidebar behavior.
  The sidebar should collapse using the main toggle button,
  show again when clicked again,
  and hide when the internal "Hide" button is clicked.
*/
describe("MedicationTracker page - sidebar toggling", () => {
  beforeEach(() => {
    cleanup();
  });

  it("collapses the sidebar when 'Collapse Sidebar' is clicked and shows it again", () => {
    render(<MedicationTracker />);

    expect(screen.getByText(/active medications/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    );

    expect(screen.queryByText(/active medications/i)).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /show sidebar/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /show sidebar/i }));

    expect(screen.getByText(/active medications/i)).toBeInTheDocument();
  });

  /*
    This test checks the secondary hide control inside the sidebar.
    Clicking "Hide" should close the sidebar
    and the main toggle should switch to "Show Sidebar".
  */
  it("hides the sidebar when the sidebar 'Hide' button is clicked", () => {
    render(<MedicationTracker />);

    expect(screen.getByText(/active medications/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^hide$/i }));

    expect(screen.queryByText(/active medications/i)).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /show sidebar/i }),
    ).toBeInTheDocument();
  });
});

/*
  These tests cover medication "taken" toggling.
  The medication should update visually and display metadata when checked.
*/
describe("MedicationTracker page - medication taken toggle", () => {
  beforeEach(() => {
    cleanup();
  });

  /*
    This test checks:
    - clicking the checkbox marks the medication as taken
    - the medication title becomes line-through
    - the medication card background changes
    - taken metadata appears ("Taken at:" and "By:")
  */
  it("marks a medication as taken and shows taken metadata + styling", () => {
    render(<MedicationTracker />);

    const medTitle = screen.getByRole("heading", {
      name: /metformin - 500mg/i,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    const itemContainer = medTitle.parentElement?.parentElement?.parentElement;

    expect(screen.queryByText(/taken at:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^by:/i)).not.toBeInTheDocument();

    fireEvent.click(checkboxes[0]);

    expect(screen.getByText(/taken at:/i)).toBeInTheDocument();
    expect(screen.getByText(/^by:/i)).toBeInTheDocument();
    expect(screen.getByText(/caregiver \(mock\)/i)).toBeInTheDocument();

    expect(medTitle).toHaveStyle({ textDecoration: "line-through" });
    expect(itemContainer).toHaveStyle({ background: "#dcebde" });
  });

  /*
    This test checks that unchecking a taken medication reverts the UI:
    - taken metadata is removed
    - line-through is removed
    - background returns to normal
  */
  it("unchecks a taken medication and removes taken metadata + styling", () => {
    render(<MedicationTracker />);

    const medTitle = screen.getByRole("heading", {
      name: /metformin - 500mg/i,
    });

    const checkboxes = screen.getAllByRole("checkbox");
    const itemContainer = medTitle.parentElement?.parentElement?.parentElement;

    fireEvent.click(checkboxes[0]);

    expect(screen.getByText(/taken at:/i)).toBeInTheDocument();
    expect(screen.getByText(/^by:/i)).toBeInTheDocument();
    expect(medTitle).toHaveStyle({ textDecoration: "line-through" });
    expect(itemContainer).toHaveStyle({ background: "#dcebde" });

    fireEvent.click(checkboxes[0]);

    expect(screen.queryByText(/taken at:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^by:/i)).not.toBeInTheDocument();
    expect(medTitle).toHaveStyle({ textDecoration: "none" });
    expect(itemContainer).toHaveStyle({ background: "white" });
  });
});
