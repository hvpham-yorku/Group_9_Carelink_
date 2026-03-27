// ===== IMPORTS =====
import { useEffect, useMemo, useRef, useState } from "react";
import NotesHeader from "../components/note/NotesHeader";
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

  // ===== STATE: UI =====
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // ===== DERIVED STATE =====
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
      return;
    }

    setTitle(selectedNote.title ?? "");
    setDescription(selectedNote.description ?? "");
    setCategoryId(selectedNote.categoryId ?? categories[0]?.categoryId ?? "");
  }, [selectedNote, categories]);

  // ===== CLEANUP =====
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // ===== FILTER LOGIC =====
  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const now = new Date();

    return notes.filter((note) => {
      if (!note.createdAt) return false;
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
  }, [notes, searchTerm, timeFilter]);

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

  // ===== ACTIONS =====
  function handleNew() {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setCategoryId(categories[0]?.categoryId ?? "");
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
            {/* ===== STATS CARD: TODAY ===== */}
            <div className="col-12">
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <div
                    className="card shadow-sm border-0 h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => setTimeFilter("today")}
                  >
                    <div className="card-body">
                      <div className="text-muted small">Today's Notes</div>
                      <div className="fs-4 fw-bold">
                        {
                          notes.filter(
                            (n) =>
                              !!n.createdAt &&
                              new Date(n.createdAt).toDateString() ===
                                new Date().toDateString(),
                          ).length
                        }
                      </div>
                      <div className="text-muted small">Current day</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SEARCH + FILTER ===== */}
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
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

            {/* ===== TIMELINE ===== */}
            <div className="col-12">
              <CareTimelineContainer
                notes={filteredNotes}
                timelineGroups={timelineGroups}
                selectedId={selectedId}
                setSelectedId={handleSelectNote}
                handleDelete={handleDelete}
                formatDateTime={formatDateTime}
                formatDayLabel={formatDayLabel}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* ===== MODAL EDITOR ===== */}
          <NewNoteContainer
            isOpen={isEditorOpen}
            onClose={handleCloseEditor}
            selectedNote={selectedNote}
            formatDateTime={formatDateTime}
            title={title}
            description={description}
            categoryId={categoryId}
            setTitle={setTitle}
            setDescription={setDescription}
            setCategoryId={setCategoryId}
            handleSave={handleSave}
            handleDelete={handleDelete}
            categories={categories}
          />
        </>
      )}
    </div>
  );
}
