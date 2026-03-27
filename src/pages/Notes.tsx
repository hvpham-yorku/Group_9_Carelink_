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
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ===== STATE: FORM =====
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

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
      .then((data: Note[]) => setNotes(data))
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
          new Date(note.createdAt).toDateString() === new Date().toDateString(),
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
      const created = new Date(note.createdAt);

      const matchesTime = (() => {
        if (timeFilter === "all") return true;

        if (timeFilter === "today") {
          return created.toDateString() === now.toDateString();
        }

        const diffMs = now.getTime() - created.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (timeFilter === "week") return diffDays <= 7;
        if (timeFilter === "month") return diffDays <= 30;
        if (timeFilter === "year") return diffDays <= 365;

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

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }

    return results;
  }, [notes, searchTerm, timeFilter, sortMode]);

  // ===== TIMELINE GROUPING =====
  const timelineGroups = useMemo(() => {
    const map = new Map<string, Note[]>();

    for (const note of filteredNotes) {
      if (!note.createdAt) continue;
      const key = dayKey(note.createdAt);
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
    }, 3000);
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
    if (!description.trim() || !selectedPatientId || !user) return;

    try {
      if (selectedNote) {
        const updated = await repositories.note.updateNote(
          selectedNote.noteId,
          {
            title: title.trim(),
            description: description.trim(),
            categoryId,
            isUrgent,
          },
        );

        setNotes((prev) =>
          prev.map((note) =>
            note.noteId === selectedNote.noteId ? updated : note,
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

        setNotes((prev) => [created, ...prev]);
        setSelectedId(created.noteId);
      }

      flashSaved();
      setIsEditorOpen(false);
      setSelectedId(null);
    } catch (err) {
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
      {/* ===== HEADER ===== */}
      <NotesHeader savedFlash={savedFlash} onNew={handleNew} />

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <>
          <div className="row g-3 mb-3">
            {/* ===== TOP DASHBOARD ROW: STATS + SEARCH/FILTER ===== */}
            <div className="col-12">
              <div className="row g-3 align-items-stretch">
                {/* ===== STATS CARDS ===== */}
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

                {/* ===== SEARCH + FILTER ===== */}
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

            {/* ===== TIMELINE + SIDE EDITOR LAYOUT ===== */}
            <div className="col-12">
              <div className="row g-3 align-items-start">
                {/* ===== TIMELINE ===== */}
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

                {/* ===== SIDE EDITOR ===== */}
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
