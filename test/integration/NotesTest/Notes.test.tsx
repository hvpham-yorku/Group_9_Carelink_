/**
 * ITR2-Test
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Notes from "../../../src/pages/Notes";
import { noteService } from "../../../src/services/noteService";
import { useAuth } from "../../../src/hooks/useAuth";
import { usePatient } from "../../../src/contexts/patient/usePatient";

/* ---------------- mocks ---------------- */

vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../src/contexts/patient/usePatient", () => ({
  usePatient: vi.fn(),
}));

vi.mock("../../../src/services/noteService", () => ({
  noteService: {
    getCategories: vi.fn(),
    getNotesByPatient: vi.fn(),
    addNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  },
}));

vi.mock("../../../src/components/note/noteUtils", () => ({
  dayKey: (date: string) => date.slice(0, 10),
  formatDateTime: (date: string) => `formatted:${date}`,
  formatDayLabel: (day: string) => `day:${day}`,
}));

vi.mock("../../../src/components/note/NotesHeader", () => ({
  default: ({
    savedFlash,
    onNew,
  }: {
    savedFlash: boolean;
    onNew: () => void;
  }) => (
    <div>
      <h1>Notes</h1>
      {savedFlash && <span>saved</span>}
      <button onClick={onNew}>+ New</button>
    </div>
  ),
}));

vi.mock("../../../src/components/note/CareTimelineContainer", () => ({
  default: ({
    notes,
    selectedId,
    setSelectedId,
    handleDelete,
    isLoading,
    timelineGroups,
  }: {
    notes: Array<{ noteId: string; title?: string }>;
    selectedId: string | null;
    setSelectedId: (id: string) => void;
    handleDelete: (id: string) => void;
    isLoading: boolean;
    timelineGroups: Array<{ day: string; items: unknown[] }>;
  }) => (
    <div>
      <div data-testid="timeline-loading">{isLoading ? "loading" : "idle"}</div>
      <div data-testid="timeline-selected">{selectedId ?? "none"}</div>
      <div data-testid="timeline-group-count">{timelineGroups.length}</div>

      {notes.map((note) => (
        <div key={note.noteId}>
          <span>{note.title}</span>
          <button onClick={() => setSelectedId(note.noteId)}>
            select-{note.noteId}
          </button>
          <button onClick={() => handleDelete(note.noteId)}>
            delete-{note.noteId}
          </button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../src/components/note/NewNoteContainer", () => ({
  default: ({
    selectedNote,
    title,
    description,
    categoryId,
    setTitle,
    setDescription,
    setCategoryId,
    handleSave,
    handleDelete,
    categories,
  }: {
    selectedNote: { noteId: string; createdAt?: string } | null;
    title: string;
    description: string;
    categoryId: string;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setCategoryId: (value: string) => void;
    handleSave: () => void;
    handleDelete: (id: string) => void;
    categories: Array<{ categoryId: string; name: string }>;
  }) => (
    <div>
      <div data-testid="selected-note-id">{selectedNote?.noteId ?? "none"}</div>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">--select--</option>
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>

      <button onClick={handleSave}>Save</button>
      {selectedNote && (
        <button onClick={() => handleDelete(selectedNote.noteId)}>Delete</button>
      )}
    </div>
  ),
}));

/* ---------------- shared fixtures ---------------- */

const mockUseAuth = vi.mocked(useAuth);
const mockUsePatient = vi.mocked(usePatient);

const mockCategories = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medical" },
];

const mockNotes = [
  {
    noteId: "n1",
    title: "Morning update",
    description: "Patient ate breakfast",
    categoryId: "cat-1",
    createdAt: "2026-03-06T09:00:00.000Z",
  },
  {
    noteId: "n2",
    title: "Medication note",
    description: "Administered aspirin",
    categoryId: "cat-2",
    createdAt: "2026-03-06T10:00:00.000Z",
  },
];

/* ---------------- helpers ---------------- */

function arrangeDefaultContext() {
  mockUseAuth.mockReturnValue({
    user: { id: "caregiver-1" },
  } as never);

  mockUsePatient.mockReturnValue({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  } as never);

  vi.mocked(noteService.getCategories).mockResolvedValue(mockCategories as never);
  vi.mocked(noteService.getNotesByPatient).mockResolvedValue(mockNotes as never);
  vi.mocked(noteService.addNote).mockResolvedValue({
    noteId: "n3",
    title: "New note",
    description: "Fresh description",
    categoryId: "cat-2",
    createdAt: "2026-03-06T11:00:00.000Z",
  } as never);
  vi.mocked(noteService.updateNote).mockResolvedValue({
    noteId: "n1",
    title: "Updated title",
    description: "Patient ate breakfast",
    categoryId: "cat-1",
    createdAt: "2026-03-06T09:00:00.000Z",
  } as never);
  vi.mocked(noteService.deleteNote).mockResolvedValue(undefined as never);
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
  });
}

/* ---------------- tests ---------------- */

describe("Notes page", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    arrangeDefaultContext();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders info alert when no patient is selected", () => {
    mockUsePatient.mockReturnValue({
      selectedPatientId: null,
      careTeamId: "team-1",
      loading: false,
    } as never);

    render(<Notes />);

    expect(
      screen.getByText(/no patient selected\. please select a patient from the sidebar\./i)
    ).toBeInTheDocument();

    expect(noteService.getNotesByPatient).not.toHaveBeenCalled();
  });

  it("loads categories and notes on mount when context is ready", async () => {
    render(<Notes />);

    await flushPromises();

    expect(noteService.getCategories).toHaveBeenCalledWith("team-1");
    expect(noteService.getNotesByPatient).toHaveBeenCalledWith("patient-1");
    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Medication note")).toBeInTheDocument();
  });

  it("passes loading state to the timeline while notes are loading", async () => {
    let resolveNotes!: (value: typeof mockNotes) => void;

    vi.mocked(noteService.getNotesByPatient).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveNotes = resolve as (value: typeof mockNotes) => void;
        }) as never
    );

    render(<Notes />);

    expect(screen.getByTestId("timeline-loading")).toHaveTextContent("loading");

    await act(async () => {
      resolveNotes(mockNotes);
      await Promise.resolve();
    });

    expect(screen.getByTestId("timeline-loading")).toHaveTextContent("idle");
  });

  it("defaults category select to the first loaded category for a new note", async () => {
    render(<Notes />);

    await flushPromises();

    expect(noteService.getCategories).toHaveBeenCalled();
    expect(screen.getByLabelText("Category")).toHaveValue("cat-1");
  });

  it("selects a note and loads its fields into the editor", async () => {
    render(<Notes />);

    await flushPromises();

    fireEvent.click(screen.getByRole("button", { name: "select-n1" }));

    expect(screen.getByTestId("selected-note-id")).toHaveTextContent("n1");
    expect(screen.getByLabelText("Title")).toHaveValue("Morning update");
    expect(screen.getByLabelText("Description")).toHaveValue("Patient ate breakfast");
    expect(screen.getByLabelText("Category")).toHaveValue("cat-1");
  });

  it("creates a new note on Save and shows saved flash", async () => {
    vi.mocked(noteService.getNotesByPatient).mockResolvedValue([] as never);

    vi.mocked(noteService.addNote).mockResolvedValue({
      noteId: "n3",
      title: "Doctor appointment",
      description: "Follow-up needed",
      categoryId: "cat-2",
      createdAt: "2026-03-06T11:00:00.000Z",
    } as never);

    render(<Notes />);

    await flushPromises();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Doctor appointment" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Follow-up needed" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "cat-2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await flushPromises();

    expect(noteService.addNote).toHaveBeenCalledWith({
      patientId: "patient-1",
      caregiverId: "caregiver-1",
      careTeamId: "team-1",
      title: "Doctor appointment",
      description: "Follow-up needed",
      categoryId: "cat-2",
    });

    expect(screen.getByText("Doctor appointment")).toBeInTheDocument();
    expect(screen.getByText(/^saved$/i)).toBeInTheDocument();
  });

  it("does not save when description is empty", async () => {
    vi.mocked(noteService.getNotesByPatient).mockResolvedValue([] as never);

    render(<Notes />);

    await flushPromises();

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Title only" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(noteService.addNote).not.toHaveBeenCalled();
    expect(noteService.updateNote).not.toHaveBeenCalled();
  });

  it("updates an existing note on Save when a note is selected", async () => {
    vi.mocked(noteService.updateNote).mockResolvedValue({
      ...mockNotes[0],
      title: "Updated title",
      description: "Updated description",
      categoryId: "cat-2",
    } as never);

    render(<Notes />);

    await flushPromises();

    fireEvent.click(screen.getByRole("button", { name: "select-n1" }));

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated title" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated description" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "cat-2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await flushPromises();

    expect(noteService.updateNote).toHaveBeenCalledWith("n1", {
      title: "Updated title",
      description: "Updated description",
      categoryId: "cat-2",
    });

    expect(screen.getByText("Updated title")).toBeInTheDocument();
  });

  it("deletes a selected note and clears the editor", async () => {
    render(<Notes />);

    await flushPromises();

    fireEvent.click(screen.getByRole("button", { name: "select-n1" }));
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));

    await flushPromises();

    expect(noteService.deleteNote).toHaveBeenCalledWith("n1");
    expect(screen.queryByText("Morning update")).not.toBeInTheDocument();
    expect(screen.getByTestId("selected-note-id")).toHaveTextContent("none");
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("cat-1");
  });

  it("+ New clears the editor and resets category to first category", async () => {
    render(<Notes />);

    await flushPromises();

    fireEvent.click(screen.getByRole("button", { name: "select-n1" }));

    expect(screen.getByLabelText("Title")).toHaveValue("Morning update");

    fireEvent.click(screen.getByRole("button", { name: /\+ new/i }));

    expect(screen.getByTestId("selected-note-id")).toHaveTextContent("none");
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("cat-1");
  });

  it("clears the saved flash after 3 seconds", async () => {
    vi.useFakeTimers();

    vi.mocked(noteService.getNotesByPatient).mockResolvedValue([] as never);

    vi.mocked(noteService.addNote).mockResolvedValue({
      noteId: "n3",
      title: "Flash test",
      description: "Saved state test",
      categoryId: "cat-1",
      createdAt: "2026-03-06T11:00:00.000Z",
    } as never);

    render(<Notes />);

    await flushPromises();

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Saved state test" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await flushPromises();

    expect(screen.getByText(/^saved$/i)).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText(/^saved$/i)).not.toBeInTheDocument();
  });

  it("shows the no-patient alert when patient becomes null", async () => {
    const { rerender } = render(<Notes />);

    await flushPromises();

    expect(screen.getByText("Morning update")).toBeInTheDocument();

    mockUsePatient.mockReturnValue({
      selectedPatientId: null,
      careTeamId: "team-1",
      loading: false,
    } as never);

    rerender(<Notes />);

    expect(
      screen.getByText(/no patient selected\. please select a patient from the sidebar\./i)
    ).toBeInTheDocument();
  });
});