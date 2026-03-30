/**
 * ITR3-Test
 * Tara Mivehchi
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notes from "../../src/pages/Notes";

// ---------- hoisted mocks ----------
const {
  getCategoriesMock,
  getNotesByPatientMock,
  addNoteMock,
  updateNoteMock,
  deleteNoteMock,
  useAuthMock,
  usePatientMock,
} = vi.hoisted(() => ({
  getCategoriesMock: vi.fn(),
  getNotesByPatientMock: vi.fn(),
  addNoteMock: vi.fn(),
  updateNoteMock: vi.fn(),
  deleteNoteMock: vi.fn(),
  useAuthMock: vi.fn(),
  usePatientMock: vi.fn(),
}));

// ---------- mock data ----------
const mockCategories = [
  {
    categoryId: "cat-1",
    name: "Medication",
    color: "text-bg-primary",
  },
  {
    categoryId: "cat-2",
    name: "Appointments",
    color: "text-bg-success",
  },
];

const todayIso = new Date().toISOString();
const oldIso = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

const mockNotes = [
  {
    noteId: "note-1",
    patientId: "patient-1",
    caregiverId: "caregiver-1",
    careTeamId: "team-1",
    categoryId: "cat-1",
    title: "Medication Reminder",
    description: "Reminder to take morning medication.",
    createdAt: todayIso,
    updatedAt: todayIso,
    isUrgent: false,
    categories: { name: "Medication", color: "text-bg-primary" },
    caregivers: { firstName: "Alice", lastName: "Johnson" },
  },
  {
    noteId: "note-2",
    patientId: "patient-1",
    caregiverId: "caregiver-2",
    careTeamId: "team-1",
    categoryId: "cat-2",
    title: "Urgent Appointment",
    description: "Reminder for urgent appointment review.",
    createdAt: oldIso,
    updatedAt: oldIso,
    isUrgent: true,
    categories: { name: "Appointments", color: "text-bg-success" },
    caregivers: { firstName: "Bob", lastName: "Williams" },
  },
];

// ---------- mocks ----------
vi.mock("../../src/data", () => ({
  repositories: {
    note: {
      getCategories: getCategoriesMock,
      getNotesByPatient: getNotesByPatientMock,
      addNote: addNoteMock,
      updateNote: updateNoteMock,
      deleteNote: deleteNoteMock,
    },
  },
}));

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("../../src/contexts/patient/usePatient", () => ({
  usePatient: () => usePatientMock(),
}));

vi.mock("../../src/components/note/NotesHeader", () => ({
  default: ({
    savedFlash,
    onNew,
  }: {
    savedFlash: boolean;
    onNew: () => void;
  }) => (
    <div>
      <h1>Notes</h1>
      {savedFlash && <span>Saved</span>}
      <button onClick={onNew}>New</button>
    </div>
  ),
}));

vi.mock("../../src/components/note/NotesStatCard", () => ({
  default: ({
    title,
    value,
    onClick,
    isActive,
  }: {
    title: string;
    value: number;
    onClick?: () => void;
    isActive?: boolean;
  }) => (
    <button onClick={onClick}>
      {title}: {value} {isActive ? "(active)" : ""}
    </button>
  ),
}));

vi.mock("../../src/components/note/CareTimelineContainer", () => ({
  default: ({
    notes,
    isLoading,
    setSelectedId,
    handleDelete,
  }: {
    notes: Array<{
      noteId: string;
      title: string | null;
      description: string | null;
    }>;
    isLoading: boolean;
    setSelectedId: (id: string) => void;
    handleDelete: (id: string) => void;
  }) => (
    <div>
      <div>Timeline</div>
      {isLoading && <div>Loading notes…</div>}
      {notes.map((note) => (
        <div key={note.noteId}>
          <span>{note.title}</span>
          <span>{note.description}</span>
          <button onClick={() => setSelectedId(note.noteId)}>
            Select {note.noteId}
          </button>
          <button onClick={() => handleDelete(note.noteId)}>
            Delete {note.noteId}
          </button>
        </div>
      ))}
      {notes.length === 0 && !isLoading && <div>No notes rendered</div>}
    </div>
  ),
}));

vi.mock("../../src/components/note/NewNoteContainer", () => ({
  default: ({
    isOpen,
    selectedNote,
    title,
    description,
    categoryId,
    isUrgent,
    setTitle,
    setDescription,
    setCategoryId,
    setIsUrgent,
    handleSave,
    onClose,
    categories,
  }: {
    isOpen: boolean;
    selectedNote: { noteId: string } | null;
    title: string;
    description: string;
    categoryId: string;
    isUrgent: boolean;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setCategoryId: (value: string) => void;
    setIsUrgent: (value: boolean) => void;
    handleSave: () => void;
    onClose: () => void;
    categories: Array<{ categoryId: string; name: string }>;
  }) =>
    isOpen ? (
      <div>
        <div>{selectedNote ? "Edit Note" : "New Note"}</div>

        <input
          aria-label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          aria-label="Content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          aria-label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          aria-label="Urgent"
          type="checkbox"
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
        />

        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe("Notes page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthMock.mockReturnValue({
      user: { id: "caregiver-1" },
    });

    usePatientMock.mockReturnValue({
      selectedPatientId: "patient-1",
      careTeamId: "team-1",
      loading: false,
    });

    getCategoriesMock.mockResolvedValue(mockCategories);
    getNotesByPatientMock.mockResolvedValue(mockNotes);
    addNoteMock.mockImplementation(async (payload) => ({
      noteId: "note-new",
      caregiverId: payload.caregiverId,
      careTeamId: payload.careTeamId,
      patientId: payload.patientId,
      categoryId: payload.categoryId,
      title: payload.title,
      description: payload.description,
      createdAt: todayIso,
      updatedAt: todayIso,
      isUrgent: payload.isUrgent,
      categories: { name: "Medication", color: "text-bg-primary" },
      caregivers: { firstName: "Alice", lastName: "Johnson" },
    }));
    updateNoteMock.mockImplementation(async (id, payload) => ({
      ...mockNotes.find((n) => n.noteId === id)!,
      ...payload,
      noteId: id,
      updatedAt: todayIso,
    }));
    deleteNoteMock.mockResolvedValue(undefined);
  });

  it("shows no patient selected message when no patient is selected", () => {
    usePatientMock.mockReturnValue({
      selectedPatientId: null,
      careTeamId: "team-1",
      loading: false,
    });

    render(<Notes />);

    expect(
      screen.getByText(
        /no patient selected\. please select a patient from the sidebar\./i,
      ),
    ).toBeInTheDocument();
  });

  it("loads categories and notes on render", async () => {
    render(<Notes />);

    await waitFor(() => {
      expect(getCategoriesMock).toHaveBeenCalledWith("team-1");
      expect(getNotesByPatientMock).toHaveBeenCalledWith("patient-1");
    });

    expect(screen.getByText("Medication Reminder")).toBeInTheDocument();
    expect(screen.getByText("Urgent Appointment")).toBeInTheDocument();
  });

  it("shows correct stat card counts", async () => {
    render(<Notes />);

    expect(await screen.findByText(/Today's Notes: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Urgent Notes: 1/i)).toBeInTheDocument();
  });

  it("opens the new note editor when clicking New", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: "New" }));

    expect(screen.getByText("New Note")).toBeInTheDocument();
  });

  it("filters to today's notes when clicking Today's Notes card", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: /Today's Notes: 1/i }));

    expect(screen.getByText("Medication Reminder")).toBeInTheDocument();
    expect(screen.queryByText("Urgent Appointment")).not.toBeInTheDocument();
  });

  it("toggles urgent mode and shows urgent note", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: /Urgent Notes: 1/i }));

    expect(screen.getByText("Urgent Appointment")).toBeInTheDocument();
  });

  it("filters notes by search term", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");

    const searchInput = screen.getByLabelText(/search/i);
    await user.clear(searchInput);
    await user.type(searchInput, "alice");

    expect(screen.getByText("Medication Reminder")).toBeInTheDocument();
    expect(screen.queryByText("Urgent Appointment")).not.toBeInTheDocument();
  });

  it("creates a new note when saving from the new note editor", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: "New" }));

    await user.type(screen.getByLabelText("Title"), "New Follow-up");
    await user.type(
      screen.getByLabelText("Content"),
      "Patient needs follow-up care.",
    );
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "cat-1" },
    });
    await user.click(screen.getByLabelText("Urgent"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(addNoteMock).toHaveBeenCalledWith({
        patientId: "patient-1",
        caregiverId: "caregiver-1",
        careTeamId: "team-1",
        title: "New Follow-up",
        description: "Patient needs follow-up care.",
        categoryId: "cat-1",
        isUrgent: true,
      });
    });

    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("New Follow-up")).toBeInTheDocument();
  });

  it("opens existing note in edit mode when selected", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: "Select note-1" }));

    expect(await screen.findByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Medication Reminder")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Reminder to take morning medication."),
    ).toBeInTheDocument();
  });

  it("updates an existing note", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: "Select note-1" }));

    const titleInput = await screen.findByLabelText("Title");
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Note Title");

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateNoteMock).toHaveBeenCalledWith("note-1", {
        title: "Updated Note Title",
        description: "Reminder to take morning medication.",
        categoryId: "cat-1",
        isUrgent: false,
      });
    });

    expect(await screen.findByText("Updated Note Title")).toBeInTheDocument();
  });

  it("deletes a note", async () => {
    const user = userEvent.setup();
    render(<Notes />);

    await screen.findByText("Medication Reminder");
    await user.click(screen.getByRole("button", { name: "Delete note-1" }));

    await waitFor(() => {
      expect(deleteNoteMock).toHaveBeenCalledWith("note-1");
    });

    expect(screen.queryByText("Medication Reminder")).not.toBeInTheDocument();
  });
});