/**
 * ITR1-Test
 * 
 * @vitest-environment jsdom
 * tests for the Notes page:
 * - empty state + render
 * - create/save note
 * - localStorage persistence + load on mount
 * - select note loads editor
 * - update existing note
 * - delete note
 * - + New clears editor
 */

import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Notes from "../pages/Notes";

const STORAGE_KEY = "carelink_notes_v2";

describe("Notes page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders header and empty state when no notes exist", () => {
    render(<Notes />);
    expect(screen.getByRole("heading", { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("creates a note on Save and shows it in the timeline", () => {
    // Make ID/time deterministic so the test is stable
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
    vi.spyOn(Math, "random").mockReturnValue(0.123456);

    render(<Notes />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Doctor appointment" },
    });
    fireEvent.change(screen.getByLabelText("Tag"), {
      target: { value: "Medical" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Follow-up needed." },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Doctor appointment")).toBeInTheDocument();
    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });

  it("persists notes to localStorage after saving", () => {
    render(<Notes />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Nutrition update" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Patient finished meal." },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe("Nutrition update");
  });

  it("loads notes from localStorage on mount", () => {
    // Verifies loadNotes() parsing + initial render timeline
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "n1",
          title: "Preloaded Note",
          content: "Loaded from storage",
          tag: "General",
          updatedAt: 1700000000000,
        },
      ]),
    );

    render(<Notes />);
    expect(screen.getByText("Preloaded Note")).toBeInTheDocument();
  });

  it("selects a note and loads it into the editor fields", () => {
    // Ensures selecting a timeline item populates editor state
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "n1",
          title: "Selectable",
          content: "Editable content",
          tag: "General",
          updatedAt: 1700000000000,
        },
      ]),
    );

    render(<Notes />);

    fireEvent.click(screen.getByText("Selectable"));

    expect(screen.getByLabelText("Title")).toHaveValue("Selectable");
    expect(screen.getByLabelText("Content")).toHaveValue("Editable content");
    expect(screen.getByLabelText("Tag")).toHaveValue("General");
  });

  it("updates an existing note on Save (edit mode)", () => {
    // Verifies update path: selectedNote exists -> overwrite fields -> persist
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "n1",
          title: "Old Title",
          content: "Old content",
          tag: "General",
          updatedAt: 1600000000000,
        },
      ]),
    );

    vi.spyOn(Date, "now").mockReturnValue(1700000000000);

    render(<Notes />);

    fireEvent.click(screen.getByText("Old Title"));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Title" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText("Updated Title")).toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored[0].title).toBe("Updated Title");
    expect(stored[0].updatedAt).toBe(1700000000000);
  });

  it("deletes a selected note using the editor Delete button", () => {
    // Confirms delete removes from UI + localStorage
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "n1",
          title: "Delete Me",
          content: "bye",
          tag: "General",
          updatedAt: 1700000000000,
        },
      ]),
    );

    render(<Notes />);

    fireEvent.click(screen.getByText("Delete Me"));
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    expect(stored).toHaveLength(0);
  });

  it("+ New clears the editor (creates a fresh draft)", () => {
    // Ensures New resets selected note + editor fields
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: "n1",
          title: "Existing",
          content: "Existing content",
          tag: "General",
          updatedAt: 1700000000000,
        },
      ]),
    );

    render(<Notes />);

    fireEvent.click(screen.getByText("Existing"));
    fireEvent.click(screen.getByRole("button", { name: /\+ new/i }));

    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Content")).toHaveValue("");
    expect(screen.getByLabelText("Tag")).toHaveValue("General");
  });
});