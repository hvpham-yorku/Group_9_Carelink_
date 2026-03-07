/**
 * ITR2-Test
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
  categories: { categoryId: "cat-1", name: "General" },
  caregivers: { firstName: "Tara", lastName: "Mivehchi" },
};

const secondNote = {
  noteId: "n2",
  title: "Medication note",
  description: "Administered aspirin",
  categoryId: "cat-2",
  createdAt: "2026-03-06T10:00:00.000Z",
  categories: { categoryId: "cat-2", name: "Medical" },
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
      />
    );

    expect(screen.getByText("Care Timeline")).toBeInTheDocument();
    expect(screen.getByText("Showing 0 note(s)")).toBeInTheDocument();
    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();
  });

  it("renders empty state when there are no notes", () => {
    render(
      <CareTimelineContainer
        notes={[]}
        timelineGroups={[]}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDayLabel={vi.fn()}
        formatDateTime={vi.fn()}
        isLoading={false}
      />
    );

    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    expect(screen.getByText("Showing 0 note(s)")).toBeInTheDocument();
  });

  it("renders timeline groups when notes exist", () => {
    render(
      <CareTimelineContainer
        notes={[mockNote, secondNote]}
        timelineGroups={[mockGroup]}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDayLabel={() => "Friday, March 6, 2026"}
        formatDateTime={() => "formatted date"}
        isLoading={false}
      />
    );

    expect(screen.getByText("Showing 2 note(s)")).toBeInTheDocument();
    expect(screen.getByText("Friday, March 6, 2026")).toBeInTheDocument();
    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Medication note")).toBeInTheDocument();
  });
});

/* ---------------- NewNoteContainer ---------------- */

describe("NewNoteContainer", () => {
  it("renders New Note state when no note is selected", () => {
    render(
      <NewNoteContainer
        selectedNote={null}
        formatDateTime={vi.fn()}
        title=""
        description=""
        categoryId="cat-1"
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("New Note")).toBeInTheDocument();
    expect(screen.getByText("Not saved yet")).toBeInTheDocument();
  });

  it("renders Edit Note state when a note is selected", () => {
    render(
      <NewNoteContainer
        selectedNote={mockNote}
        formatDateTime={() => "March 6 at 9:00 AM"}
        title={mockNote.title}
        description={mockNote.description}
        categoryId={mockNote.categoryId}
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />
    );

    expect(screen.getByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByText("Created: March 6 at 9:00 AM")).toBeInTheDocument();
  });
});

/* ---------------- NoteForm ---------------- */

describe("NoteForm", () => {
  it("renders fields and calls handlers on change/save", () => {
    const setTitle = vi.fn();
    const setDescription = vi.fn();
    const setCategoryId = vi.fn();
    const handleSave = vi.fn();

    render(
      <NoteForm
        selectedNote={null}
        title=""
        description=""
        categoryId="cat-1"
        setTitle={setTitle}
        setDescription={setDescription}
        setCategoryId={setCategoryId}
        handleSave={handleSave}
        handleDelete={vi.fn()}
        categories={mockCategories}
      />
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
    fireEvent.click(screen.getByText("Save"));

    expect(setTitle).toHaveBeenCalledWith("Doctor visit summary");
    expect(setDescription).toHaveBeenCalledWith("Patient doing well.");
    expect(setCategoryId).toHaveBeenCalledWith("cat-2");
    expect(handleSave).toHaveBeenCalled();
  });

  it("shows delete button only when a note is selected and calls delete", () => {
    const handleDelete = vi.fn();

    render(
      <NoteForm
        selectedNote={mockNote}
        title={mockNote.title}
        description={mockNote.description}
        categoryId={mockNote.categoryId}
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={handleDelete}
        categories={mockCategories}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledWith("n1");
  });

  it("shows fallback category option when no categories exist", () => {
    render(
      <NoteForm
        selectedNote={null}
        title=""
        description=""
        categoryId=""
        setTitle={vi.fn()}
        setDescription={vi.fn()}
        setCategoryId={vi.fn()}
        handleSave={vi.fn()}
        handleDelete={vi.fn()}
        categories={[]}
      />
    );

    expect(screen.getByText("No categories available")).toBeInTheDocument();
  });
});

/* ---------------- NoteItem ---------------- */

describe("NoteItem", () => {
  it("renders note details and formatted date", () => {
    render(
      <NoteItem
        note={mockNote}
        active={false}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
        formatDateTime={() => "March 6, 2026 9:00 AM"}
      />
    );

    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Patient ate breakfast")).toBeInTheDocument();
    expect(screen.getByText(/General/)).toBeInTheDocument();
    expect(screen.getByText(/Tara Mivehchi/)).toBeInTheDocument();
    expect(screen.getByText("March 6, 2026 9:00 AM")).toBeInTheDocument();
  });

  it("shows untitled fallback and calls onSelect", () => {
    const onSelect = vi.fn();

    render(
      <NoteItem
        note={{ ...mockNote, title: "" }}
        active={false}
        onSelect={onSelect}
        onDelete={vi.fn()}
        formatDateTime={() => "formatted"}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete note/i }).parentElement!);

    expect(screen.getByText("(Untitled)")).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalled();
  });

  it("calls onDelete without triggering onSelect", () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();

    render(
      <NoteItem
        note={mockNote}
        active={false}
        onSelect={onSelect}
        onDelete={onDelete}
        formatDateTime={() => "formatted"}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /delete note morning update/i }));

    expect(onDelete).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});

/* ---------------- NoteList ---------------- */

describe("NoteList", () => {
  it("renders formatted day label and note items", () => {
    render(
      <NoteList
        group={mockGroup}
        selectedId={null}
        setSelectedId={vi.fn()}
        handleDelete={vi.fn()}
        formatDateTime={() => "formatted"}
        formatDayLabel={() => "Friday, March 6, 2026"}
      />
    );

    expect(screen.getByText("Friday, March 6, 2026")).toBeInTheDocument();
    expect(screen.getByText("Morning update")).toBeInTheDocument();
    expect(screen.getByText("Medication note")).toBeInTheDocument();
  });

  it("calls setSelectedId and handleDelete for the correct note", () => {
    const setSelectedId = vi.fn();
    const handleDelete = vi.fn();

    render(
      <NoteList
        group={mockGroup}
        selectedId={null}
        setSelectedId={setSelectedId}
        handleDelete={handleDelete}
        formatDateTime={() => "formatted"}
        formatDayLabel={() => "Friday"}
      />
    );

    fireEvent.click(screen.getByText("Morning update"));
    expect(setSelectedId).toHaveBeenCalledWith("n1");

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[1]);
    expect(handleDelete).toHaveBeenCalledWith("n2");
  });
});

/* ---------------- NotesHeader ---------------- */

describe("NotesHeader", () => {
  it("renders title, subheader, and new button", () => {
    render(<NotesHeader savedFlash={false} onNew={vi.fn()} />);

    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(
      screen.getByText("Create and manage notes for patient care")
    ).toBeInTheDocument();
    expect(screen.getByText("+ New")).toBeInTheDocument();
    expect(screen.queryByText("Saved")).not.toBeInTheDocument();
  });

  it("shows saved badge and calls onNew", () => {
    const onNew = vi.fn();

    render(<NotesHeader savedFlash={true} onNew={onNew} />);

    expect(screen.getByText("Saved")).toBeInTheDocument();

    fireEvent.click(screen.getByText("+ New"));
    expect(onNew).toHaveBeenCalled();
  });
});

/* ---------------- noteUtils ---------------- */

describe("noteUtils", () => {
  it("dayKey returns yyyy-mm-dd", () => {
    expect(dayKey("2026-03-06T09:00:00.000Z")).toBe("2026-03-06");
  });

  it("formatDateTime returns a non-empty localized string", () => {
    const result = formatDateTime("2026-03-06T09:00:00.000Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("formatDayLabel returns a non-empty formatted day string", () => {
    const result = formatDayLabel("2026-03-06");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});