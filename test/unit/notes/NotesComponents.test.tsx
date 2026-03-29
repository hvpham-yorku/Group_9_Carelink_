/**
 * ITR3-Test
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CareTimelineContainer from "../../../src/components/note/CareTimelineContainer";
import NewNoteContainer from "../../../src/components/note/NewNoteContainer";
import NoteForm from "../../../src/components/note/NoteForm";
import NoteItem from "../../../src/components/note/NoteItem";
import NoteList from "../../../src/components/note/NoteList";
import NotesHeader from "../../../src/components/note/NotesHeader";
import NotesStatCard from "../../../src/components/note/NotesStatCard";
import {
  dayKey,
  formatDateTime,
  formatDayLabel,
} from "../../../src/components/note/noteUtils";

/* ---------------- UI mocks ---------------- */

vi.mock("../../../src/components/ui/Button", () => ({
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock("../../../src/components/ui/CustomSection", () => ({
  default: ({
    title,
    subheader,
    children,
  }: {
    title: string;
    subheader: string;
    children: React.ReactNode;
  }) => (
    <section>
      <h2>{title}</h2>
      <p>{subheader}</p>
      <div>{children}</div>
    </section>
  ),
}));

vi.mock("../../../src/components/ui/CustomTitleBanner", () => ({
  default: ({
    title,
    subheader,
    children,
  }: {
    title: string;
    subheader: string;
    children: React.ReactNode;
  }) => (
    <header>
      <h1>{title}</h1>
      <p>{subheader}</p>
      <div>{children}</div>
    </header>
  ),
}));

/* ---------------- fixtures ---------------- */

const mockCategories = [
  { categoryId: "cat-1", name: "General" },
  { categoryId: "cat-2", name: "Medical" },
];

const mockNote = {
  noteId: "n1",
  title: "Morning update",
  description: "Patient ate breakfast",
  categoryId: "cat-1",
  createdAt: "2026-03-06T09:00:00.000Z",
  updatedAt: "2026-03-06T09:00:00.000Z",
  isUrgent: false,
  categories: { name: "General", color: "text-bg-secondary" },
  caregivers: { firstName: "Tara", lastName: "Mivehchi" },
};

const secondNote = {
  noteId: "n2",
  title: "Medication note",
  description: "Administered aspirin",
  categoryId: "cat-2",
  createdAt: "2026-03-06T10:00:00.000Z",
  updatedAt: "2026-03-06T10:00:00.000Z",
  isUrgent: true,
  categories: { name: "Medical", color: "text-bg-danger" },
  caregivers: { firstName: "Hooman", lastName: "Abedi" },
};

const mockGroup = {
  day: "2026-03-06",
  items: [mockNote, secondNote],
};

/* ---------------- CareTimelineContainer ---------------- */

describe("CareTimelineContainer", () => {
  it("renders loading state", () => {
    render(
      <CareTimelineContainer
        notes={[]}
        timelineGroups={[]}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDayLabel={vi.fn()}
        formatDateTime={vi.fn()}
        isLoading={true}
        isUrgentMode={false}
      />,
    );

    expect(screen.getByText("Care Timeline")).toBeInTheDocument();
    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();
  });

  it("renders grouped notes", () => {
    render(
      <CareTimelineContainer
        notes={[mockNote, secondNote]}
        timelineGroups={[mockGroup]}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDayLabel={() => "Friday, March 6, 2026"}
        formatDateTime={() => "formatted"}
        isLoading={false}
        isUrgentMode={false}
      />,
    );

    expect(screen.getByText("Showing 2 note(s)")).toBeInTheDocument();
    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Medication note")).toBeInTheDocument();
  });
});

/* ---------------- NewNoteContainer ---------------- */

describe("NewNoteContainer", () => {
  it("renders new note state", () => {
    render(
      <NewNoteContainer
        isOpen={true}
        onClose={vi.fn()}
        selectedNote={null}
        formatDateTime={vi.fn()}
        title=""
        description=""
        categoryId="cat-1"
        isUrgent={false}
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        setIsUrgent={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />,
    );

    expect(screen.getByText("New Note")).toBeInTheDocument();
    expect(screen.getByText("Not saved yet")).toBeInTheDocument();
  });

  it("renders edit note state", () => {
    render(
      <NewNoteContainer
        isOpen={true}
        onClose={vi.fn()}
        selectedNote={mockNote}
        formatDateTime={() => "March 6 at 9:00 AM"}
        title={mockNote.title}
        description={mockNote.description}
        categoryId={mockNote.categoryId}
        isUrgent={false}
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        setIsUrgent={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />,
    );

    expect(screen.getByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByText("Created: March 6 at 9:00 AM")).toBeInTheDocument();
  });
});

/* ---------------- NoteForm ---------------- */

describe("NoteForm", () => {
  it("calls form handlers and save", () => {
    const setTitle = vi.fn();
    const setDescription = vi.fn();
    const setCategoryId = vi.fn();
    const setIsUrgent = vi.fn();
    const handleSave = vi.fn();

    render(
      <NoteForm
        selectedNote={null}
        title=""
        description=""
        categoryId="cat-1"
        isUrgent={false}
        setTitle={setTitle}
        setDescription={setDescription}
        setCategoryId={setCategoryId}
        setIsUrgent={setIsUrgent}
        handleSave={handleSave}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />,
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Doctor visit summary" },
    });
    fireEvent.change(screen.getByLabelText("Content"), {
      target: { value: "Patient doing well." },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "cat-2" },
    });
    fireEvent.click(screen.getByLabelText(/mark as urgent/i));
    fireEvent.click(screen.getByText("Save"));

    expect(setTitle).toHaveBeenCalledWith("Doctor visit summary");
    expect(setDescription).toHaveBeenCalledWith("Patient doing well.");
    expect(setCategoryId).toHaveBeenCalledWith("cat-2");
    expect(setIsUrgent).toHaveBeenCalledWith(true);
    expect(handleSave).toHaveBeenCalled();
  });

  it("shows delete button for selected note", () => {
    const handleDelete = vi.fn();

    render(
      <NoteForm
        selectedNote={mockNote}
        title={mockNote.title}
        description={mockNote.description}
        categoryId={mockNote.categoryId}
        isUrgent={false}
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        setIsUrgent={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={handleDelete}
        categories={mockCategories}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledWith("n1");
  });
});

/* ---------------- NoteItem ---------------- */

describe("NoteItem", () => {
  it("renders note content", () => {
    render(
      <NoteItem
        note={mockNote}
        active={false}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
        formatDateTime={() => "March 6, 2026 9:00 AM"}
        isUrgentMode={false}
      />,
    );

    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Patient ate breakfast")).toBeInTheDocument();
    expect(screen.getByText(/Tara Mivehchi/)).toBeInTheDocument();
  });

  it("calls delete without selecting", () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();

    render(
      <NoteItem
        note={mockNote}
        active={false}
        onSelect={onSelect}
        onDelete={onDelete}
        formatDateTime={() => "formatted"}
        isUrgentMode={false}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete note/i }));

    expect(onDelete).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});

/* ---------------- NoteList ---------------- */

describe("NoteList", () => {
  it("renders day label and notes", () => {
    render(
      <NoteList
        group={mockGroup}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDateTime={() => "formatted"}
        formatDayLabel={() => "Friday, March 6, 2026"}
        isUrgentMode={false}
      />,
    );

    expect(screen.getByText("Friday, March 6, 2026")).toBeInTheDocument();
    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Medication note")).toBeInTheDocument();
  });
});

/* ---------------- NotesHeader ---------------- */

describe("NotesHeader", () => {
  it("renders title and new button", () => {
    render(<NotesHeader savedFlash={false} onNew={vi.fn()} />);

    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      screen.getByText("Create and manage notes for patient care"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(/new/i);
  });

  it("shows saved badge and calls onNew", () => {
    const onNew = vi.fn();

    render(<NotesHeader savedFlash={true} onNew={onNew} />);

    expect(screen.getByText("Saved")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onNew).toHaveBeenCalled();
  });
});

/* ---------------- NotesStatCard ---------------- */

describe("NotesStatCard", () => {
  it("renders stat content", () => {
    render(
      <NotesStatCard
        title="Today's Notes"
        value={3}
        subtitle="Current day"
        icon={<span>Icon</span>}
      />,
    );

    expect(screen.getByText("Today's Notes")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Current day")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();

    render(
      <NotesStatCard
        title="Urgent Notes"
        value={2}
        subtitle="Needs review"
        icon={<span>Icon</span>}
        onClick={onClick}
        isActive={true}
      />,
    );

    fireEvent.click(screen.getByText("Urgent Notes"));
    expect(onClick).toHaveBeenCalled();
  });
});

/* ---------------- noteUtils ---------------- */

describe("noteUtils", () => {
  it("dayKey returns yyyy-mm-dd", () => {
    expect(dayKey("2026-03-06T09:00:00.000Z")).toBe("2026-03-06");
  });

  it("format helpers return strings", () => {
    expect(typeof formatDateTime("2026-03-06T09:00:00.000Z")).toBe("string");
    expect(typeof formatDayLabel("2026-03-06")).toBe("string");
  });
});