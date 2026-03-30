// ITRR3
// Tara Mivehchi
// Notes Page
// ===== IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, NotebookPen } from "lucide-react";
import NotesHeader from "../components/note/NotesHeader";
import NotesStatCard from "../components/note/NotesStatCard";
import CareTimelineContainer from "../components/note/CareTimelineContainer";
import NewNoteContainer from "../components/note/NewNoteContainer";
import type { Note } from "../types/note";
import type { Category } from "../types/teams";
import {
  dayKey,
  formatDateTime,
  formatDayLabel,
} from "../components/note/noteUtils";

import { repositories } from "../data";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";

// ===== TYPES =====
type TimeFilter = "all" | "today" | "week" | "month" | "year";
type SortMode = "default" | "urgent";
type NoteWithDate = Note & {
  createdAtDate: Date;
};

// ==== CONSTANTS =====
const SAVE_FLASH_DURATION_MS = 3000;

const TIME_FILTER_DAYS: Record<"week" | "month" | "year", number> = {
  week: 7,
  month: 30,
  year: 365,
};

function toSafeDate(value: string | null | undefined): Date {
  return value ? new Date(value) : new Date(0);
}

// ===== COMPONENT =====
export default function Notes() {
  // ===== CONTEXT =====
  const { user } = useAuth();
  const {
    selectedPatientId,
    careTeamId,
    loading: contextLoading,
  } = usePatient();

  // ===== STATE: DATA =====
  const [notes, setNotes] = useState<NoteWithDate[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ===== STATE: FORM =====
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ===== STATE: UI =====
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // ===== DERIVED STATE: SELECTED NOTE =====
  const selectedNote = useMemo(
    () => notes.find((note) => note.noteId === selectedId) ?? null,
    [notes, selectedId],
  );

  // ===== FETCH: CATEGORIES =====
  useEffect(() => {
    if (!careTeamId) return;

    repositories.note
      .getCategories(careTeamId)
      .then((data: Category[]) => {
        setCategories(data);

        if (data.length > 0) {
          setCategoryId(data[0].categoryId);
        }
      })
      .catch((err: unknown) =>
        console.error("Failed to load categories:", err),
      );
  }, [careTeamId]);

  // ===== FETCH: NOTES =====
  useEffect(() => {
    if (!selectedPatientId) {
      setNotes([]);
      setSelectedId(null);
      setIsEditorOpen(false);
      return;
    }

    setLoadingNotes(true);

    repositories.note
      .getNotesByPatient(selectedPatientId)
      .then((data: Note[]) => {
        const normalized: NoteWithDate[] = data.map((note) => ({
          ...note,
          createdAtDate: toSafeDate(note.createdAt),
        }));
        setNotes(normalized);
      })
      .catch((err: unknown) => console.error("Failed to load notes:", err))
      .finally(() => setLoadingNotes(false));
  }, [selectedPatientId]);

  // ===== SYNC FORM WITH SELECTED NOTE =====
  useEffect(() => {
    if (!selectedNote) {
      setTitle("");
      setDescription("");
      setCategoryId(categories[0]?.categoryId ?? "");
      setIsUrgent(false);
      return;
    }

    setTitle(selectedNote.title ?? "");
    setDescription(selectedNote.description ?? "");
    setCategoryId(selectedNote.categoryId ?? categories[0]?.categoryId ?? "");
    setIsUrgent(selectedNote.isUrgent ?? false);
  }, [selectedNote, categories]);

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // ===== COUNTS: STATS CARDS =====
  const todaysNotesCount = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.createdAtDate.toDateString() === new Date().toDateString(),
      ).length,
    [notes],
  );

  const urgentNotesCount = useMemo(
    () => notes.filter((note) => note.isUrgent).length,
    [notes],
  );

  // ===== FILTER LOGIC =====
  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const now = new Date();

    const results = notes.filter((note) => {
      const created = note.createdAtDate;

      const matchesTime = (() => {
        if (timeFilter === "all") return true;

        if (timeFilter === "today") {
          return created.toDateString() === now.toDateString();
        }

        const diffMs = now.getTime() - created.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (timeFilter in TIME_FILTER_DAYS) {
          return (
            diffDays <=
            TIME_FILTER_DAYS[timeFilter as "week" | "month" | "year"]
          );
        }

        return true;
      })();

      if (!matchesTime) return false;

      if (!normalizedSearch) return true;

      const caregiverFullName = note.caregivers
        ? `${note.caregivers.firstName} ${note.caregivers.lastName}`.toLowerCase()
        : "";

      const searchableText = [
        note.title ?? "",
        note.description ?? "",
        note.categories?.name ?? "",
        note.caregivers?.firstName ?? "",
        note.caregivers?.lastName ?? "",
        caregiverFullName,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });

    if (sortMode === "urgent") {
      return [...results].sort((a, b) => {
        const urgentA = a.isUrgent ? 1 : 0;
        const urgentB = b.isUrgent ? 1 : 0;

        if (urgentA !== urgentB) return urgentB - urgentA;

        return b.createdAtDate.getTime() - a.createdAtDate.getTime();
      });
    }

    return results;
  }, [notes, searchTerm, timeFilter, sortMode]);

  // ===== TIMELINE GROUPING =====
  const timelineGroups = useMemo(() => {
    const map = new Map<string, NoteWithDate[]>();

    for (const note of filteredNotes) {
      const key = dayKey(note.createdAtDate.toISOString());
      const group = map.get(key) ?? [];
      group.push(note);
      map.set(key, group);
    }

    const keys = Array.from(map.keys()).sort((a, b) => (a > b ? -1 : 1));

    return keys.map((key) => ({
      day: key,
      items: map.get(key) ?? [],
    }));
  }, [filteredNotes]);

  // ===== HELPERS =====
  function flashSaved() {
    setSavedFlash(true);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      setSavedFlash(false);
    }, SAVE_FLASH_DURATION_MS);
  }

  function validateForm() {
    if (!user) return "You must be logged in.";
    if (!selectedPatientId) return "No patient selected.";
    if (!title.trim()) return "Title is required.";
    if (!description.trim()) return "Description is required.";
    if (!categoryId) return "Please select a category.";
    return null;
  }

  // ===== ACTIONS: EDITOR =====
  function handleNew() {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setCategoryId(categories[0]?.categoryId ?? "");
    setIsUrgent(false);
    setIsEditorOpen(true);
  }

  function handleSelectNote(noteId: string) {
    setSelectedId(noteId);
    setIsEditorOpen(true);
  }

  function handleCloseEditor() {
    setIsEditorOpen(false);
    setSelectedId(null);
  }

  // ===== ACTIONS: STATS CARDS =====
  function handleTodayCardClick() {
    setTimeFilter("today");
    setSortMode("default");
  }

  function handleUrgentCardClick() {
    setSortMode((prev) => (prev === "urgent" ? "default" : "urgent"));
  }

  // ===== ACTIONS: SAVE =====
  async function handleSave() {
    const error = validateForm();

    if (error) {
      setFormError(error);
      return;
    }

    if (!user || !selectedPatientId) return;

    setFormError(null);

    try {
      if (selectedNote) {
        const updated = await repositories.note.updateNote(selectedNote.noteId, {
          title: title.trim(),
          description: description.trim(),
          categoryId,
          isUrgent,
        });

        setNotes((prev) =>
          prev.map((note) =>
            note.noteId === selectedNote.noteId
              ? { ...updated, createdAtDate: toSafeDate(updated.createdAt) }
              : note,
          ),
        );
      } else {
        const created = await repositories.note.addNote({
          patientId: selectedPatientId,
          caregiverId: user.id,
          careTeamId: careTeamId ?? "",
          title: title.trim(),
          description: description.trim(),
          categoryId,
          isUrgent,
        });

        setNotes((prev) => [
          { ...created, createdAtDate: toSafeDate(created.createdAt) },
          ...prev,
        ]);
        setSelectedId(created.noteId);
      }

      flashSaved();
      setIsEditorOpen(false);
      setSelectedId(null);
    } catch (err) {
      setFormError("Failed to save note. Please try again.");
      console.error("Failed to save note:", err);
    }
  }

  // ===== ACTIONS: DELETE =====
  async function handleDelete(noteId: string) {
    try {
      await repositories.note.deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.noteId !== noteId));

      if (selectedId === noteId) {
        setSelectedId(null);
        setIsEditorOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  // ===== UI STATE =====
  const isLoading = contextLoading || loadingNotes;

  return (
    <div className="container py-3">
      <NotesHeader savedFlash={savedFlash} onNew={handleNew} />

      {formError && <div className="alert alert-danger">{formError}</div>}

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <>
          <div className="row g-3 mb-3">
            <div className="col-12">
              <div className="row g-3 align-items-stretch">
                <div className="col-12 col-xl-5">
                  <div className="row g-3 h-100">
                    <div className="col-12 col-md-6">
                      <NotesStatCard
                        title="Today's Notes"
                        value={todaysNotesCount}
                        subtitle="Current day"
                        icon={
                          <NotebookPen size={18} className="text-primary" />
                        }
                        onClick={handleTodayCardClick}
                        accentClassName="bg-info-subtle"
                        isActive={timeFilter === "today"}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <NotesStatCard
                        title="Urgent Notes"
                        value={urgentNotesCount}
                        subtitle="Needs review"
                        icon={
                          <AlertCircle
                            size={18}
                            className="text-warning-emphasis"
                          />
                        }
                        onClick={handleUrgentCardClick}
                        accentClassName="bg-warning-subtle"
                        isActive={sortMode === "urgent"}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-7">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <div className="row g-3">
                        <div className="col-12 col-lg-8">
                          <label
                            htmlFor="noteSearch"
                            className="form-label fw-semibold"
                          >
                            Search
                          </label>
                          <input
                            id="noteSearch"
                            type="text"
                            className="form-control"
                            style={{
                              backgroundColor: "#e6f4ea",
                              borderColor: "#7aa58b",
                              color: "#234031",
                              boxShadow: "none",
                            }}
                            placeholder="Search notes by content or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>

                        <div className="col-12 col-lg-4">
                          <label
                            htmlFor="noteTimeFilter"
                            className="form-label fw-semibold"
                          >
                            Filter
                          </label>
                          <select
                            id="noteTimeFilter"
                            className="form-select"
                            style={{
                              backgroundColor: "#e6f4ea",
                              borderColor: "#7aa58b",
                              color: "#234031",
                              boxShadow: "none",
                            }}
                            value={timeFilter}
                            onChange={(e) =>
                              setTimeFilter(e.target.value as TimeFilter)
                            }
                          >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                            <option value="year">Past Year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row g-3 align-items-start">
                <div className={isEditorOpen ? "col-12 col-xl-6" : "col-12"}>
                  <CareTimelineContainer
                    notes={filteredNotes}
                    timelineGroups={timelineGroups}
                    selectedId={selectedId}
                    setSelectedId={handleSelectNote}
                    handleDelete={handleDelete}
                    formatDateTime={formatDateTime}
                    formatDayLabel={formatDayLabel}
                    isLoading={isLoading}
                    isUrgentMode={sortMode === "urgent"}
                  />
                </div>

                {isEditorOpen && (
                  <div className="col-12 col-xl-6">
                    <NewNoteContainer
                      isOpen={isEditorOpen}
                      onClose={handleCloseEditor}
                      selectedNote={selectedNote}
                      formatDateTime={formatDateTime}
                      title={title}
                      description={description}
                      categoryId={categoryId}
                      isUrgent={isUrgent}
                      setTitle={setTitle}
                      setDescription={setDescription}
                      setCategoryId={setCategoryId}
                      setIsUrgent={setIsUrgent}
                      handleSave={handleSave}
                      handleDelete={handleDelete}
                      categories={categories}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}