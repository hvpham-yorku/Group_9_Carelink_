import { useEffect, useMemo, useRef, useState } from "react";
import CustomSection from "../components/ui/CustomSection";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import Button from "../components/ui/Button";

import { noteService } from "../services/noteService";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import {
  formatToDateTimeLocal,
  formatDayKey,
  formatDayLabel,
} from "../utils/formatters";
import type { Note } from "../types/Types";

export default function Notes() {
  const { user } = useAuth();
  const {
    selectedPatientId,
    careTeamId,
    loading: contextLoading,
  } = usePatient();

  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<
    { categoryId: string; name: string }[]
  >([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // editor fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // UI feedback
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const selectedNote = useMemo(
    () => notes.find((n) => n.noteId === selectedId) ?? null,
    [notes, selectedId],
  );

  // Fetch categories when team is known
  useEffect(() => {
    if (!careTeamId) return;
    noteService
      .getCategories(careTeamId)
      .then((data) => {
        setCategories(data ?? []);
        if (data && data.length > 0) setCategoryId(data[0].categoryId);
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, [careTeamId]);

  // Load notes when patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setNotes([]);
      return;
    }

    setLoadingNotes(true);
    noteService
      .getNotesByPatient(selectedPatientId)
      .then((data) => setNotes((data as Note[]) ?? []))
      .catch((err) => console.error("Failed to load notes:", err))
      .finally(() => setLoadingNotes(false));
  }, [selectedPatientId]);

  // Load selected note into editor
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

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const timelineGroups = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of notes) {
      const k = formatDayKey(n.createdAt);
      const arr = map.get(k) ?? [];
      arr.push(n);
      map.set(k, arr);
    }
    const keys = Array.from(map.keys()).sort((a, b) => (a > b ? -1 : 1));
    return keys.map((k) => ({ day: k, items: map.get(k) ?? [] }));
  }, [notes]);

  function flashSaved() {
    setSavedFlash(true);
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setSavedFlash(false), 3000);
  }

  function handleNew() {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setCategoryId(categories[0]?.categoryId ?? "");
  }

  async function handleSave() {
    if (!description.trim() || !selectedPatientId || !user) return;

    try {
      if (selectedNote) {
        const updated = await noteService.updateNote(selectedNote.noteId, {
          title: title.trim(),
          description: description.trim(),
          categoryId,
        });
        setNotes((prev) =>
          prev.map((n) =>
            n.noteId === selectedNote.noteId ? (updated as Note) : n,
          ),
        );
      } else {
        const created = await noteService.addNote({
          patientId: selectedPatientId,
          caregiverId: user.id,
          careTeamId: careTeamId ?? "",
          title: title.trim(),
          description: description.trim(),
          categoryId,
        });
        setNotes((prev) => [created as Note, ...prev]);
        setSelectedId((created as Note).noteId);
      }
      flashSaved();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  }

  async function handleDelete(noteId: string) {
    try {
      await noteService.deleteNote(noteId);
      setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
      if (selectedId === noteId) handleNew();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  const isLoading = contextLoading || loadingNotes;

  return (
    <div className="container py-3">
      <div className="">
        <CustomTitleBanner
          title="Notes"
          subheader="Create and manage notes for patient care"
        >
          <div className="d-flex align-items-center gap-2 mt-2">
            {savedFlash && (
              <span className="badge text-bg-success px-3 py-2">Saved</span>
            )}
            <Button color="outline-secondary" onClick={handleNew}>
              + New
            </Button>
          </div>
        </CustomTitleBanner>
      </div>

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <div className="row g-3">
          {/* Left: Timeline */}
          <div className="col-12 col-lg-5">
            <CustomSection
              title="Care Timeline"
              subheader={`Showing ${notes.length} note(s)`}
            >
              {isLoading ? (
                <div className="text-muted">Loading notes…</div>
              ) : notes.length === 0 ? (
                <div className="text-muted">
                  No notes yet. Click <strong>+ New</strong> and write
                  something.
                </div>
              ) : (
                timelineGroups.map((group) => (
                  <div key={group.day} className="mb-3">
                    <div className="text-muted small fw-semibold mb-2">
                      {formatDayLabel(group.day)}
                    </div>
                    <div className="list-group">
                      {group.items.map((n) => {
                        const active = n.noteId === selectedId;
                        return (
                          <div
                            key={n.noteId}
                            role="button"
                            tabIndex={0}
                            className={
                              "list-group-item list-group-item-action d-flex justify-content-between align-items-start " +
                              (active ? "active" : "")
                            }
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedId(n.noteId)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                setSelectedId(n.noteId);
                            }}
                          >
                            <div className="me-2">
                              <div className="fw-semibold">
                                {n.title || "(Untitled)"}
                              </div>
                              <div
                                className={
                                  active
                                    ? "text-white-50 small"
                                    : "text-muted small"
                                }
                              >
                                {n.categories?.name}
                                {n.caregivers && (
                                  <>
                                    {" "}
                                    &middot; {n.caregivers.firstName}{" "}
                                    {n.caregivers.lastName}
                                  </>
                                )}
                              </div>
                              <div
                                className={
                                  active
                                    ? "text-white-50 small mt-1"
                                    : "text-muted small mt-1"
                                }
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "220px",
                                }}
                              >
                                {n.description}
                              </div>
                              <div
                                className={
                                  active
                                    ? "text-white-50 small"
                                    : "text-muted small"
                                }
                              >
                                {formatToDateTimeLocal(n.createdAt)}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={
                                "btn btn-sm " +
                                (active ? "btn-light" : "btn-outline-danger")
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(n.noteId);
                              }}
                              aria-label={`Delete note ${n.title || ""}`}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </CustomSection>
          </div>

          {/* Right: Editor */}
          <div className="col-12 col-lg-7">
            <CustomSection
              title={selectedNote ? "Edit Note" : "New Note"}
              subheader={
                selectedNote
                  ? `Created: ${formatToDateTimeLocal(selectedNote.createdAt)}`
                  : "Not saved yet"
              }
            >
              <div className="mb-3">
                <label htmlFor="noteTitle" className="form-label">
                  Title
                </label>
                <input
                  id="noteTitle"
                  name="noteTitle"
                  className="form-control"
                  placeholder="e.g., Doctor visit summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="noteCategory" className="form-label">
                  Category
                </label>
                <select
                  id="noteCategory"
                  name="noteCategory"
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.length === 0 && (
                    <option value="">No categories available</option>
                  )}
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="noteDescription" className="form-label">
                  Content
                </label>
                <textarea
                  id="noteDescription"
                  name="noteDescription"
                  className="form-control"
                  rows={10}
                  placeholder="Write your note here…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end align-items-center gap-2">
                {selectedNote && (
                  <Button
                    color="outline-danger"
                    onClick={() => handleDelete(selectedNote.noteId)}
                  >
                    Delete
                  </Button>
                )}
                <Button color="primary" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </CustomSection>
          </div>
        </div>
      )}
    </div>
  );
}
