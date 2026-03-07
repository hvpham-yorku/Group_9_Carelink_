import { useEffect, useMemo, useRef, useState } from "react";
import NotesHeader from "../components/note/NotesHeader";
import CareTimelineContainer from "../components/note/CareTimelineContainer";
import NewNoteContainer from "../components/note/NewNoteContainer";
import type { Note, NoteCategory } from "../components/note/types";
import {
  dayKey,
  formatDateTime,
  formatDayLabel,
} from "../components/note/noteUtils";

import { noteService } from "../services/noteService";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";

export default function Notes() {
  const { user } = useAuth();
  const {
    selectedPatientId,
    careTeamId,
    loading: contextLoading,
  } = usePatient();

  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<NoteCategory[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.noteId === selectedId) ?? null,
    [notes, selectedId]
  );

  useEffect(() => {
    if (!careTeamId) return;

    noteService
      .getCategories(careTeamId)
      .then((data: NoteCategory[] | null) => {
        const loadedCategories = data ?? [];
        setCategories(loadedCategories);

        if (loadedCategories.length > 0) {
          setCategoryId(loadedCategories[0].categoryId);
        }
      })
      .catch((err: unknown) => console.error("Failed to load categories:", err));
  }, [careTeamId]);

  useEffect(() => {
    if (!selectedPatientId) {
      setNotes([]);
      setSelectedId(null);
      return;
    }

    setLoadingNotes(true);

    noteService
      .getNotesByPatient(selectedPatientId)
      .then((data: Note[] | null) => setNotes(data ?? []))
      .catch((err: unknown) => console.error("Failed to load notes:", err))
      .finally(() => setLoadingNotes(false));
  }, [selectedPatientId]);

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

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const timelineGroups = useMemo(() => {
    const map = new Map<string, Note[]>();

    for (const note of notes) {
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
  }, [notes]);

  function flashSaved() {
    setSavedFlash(true);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      setSavedFlash(false);
    }, 3000);
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
          prev.map((note) =>
            note.noteId === selectedNote.noteId ? (updated as Note) : note
          )
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
      setNotes((prev) => prev.filter((note) => note.noteId !== noteId));

      if (selectedId === noteId) {
        handleNew();
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  const isLoading = contextLoading || loadingNotes;

  return (
    <div className="container py-3">
      <NotesHeader savedFlash={savedFlash} onNew={handleNew} />

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <CareTimelineContainer
              notes={notes}
              timelineGroups={timelineGroups}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              handleDelete={handleDelete}
              formatDateTime={formatDateTime}
              formatDayLabel={formatDayLabel}
              isLoading={isLoading}
            />
          </div>

          <div className="col-12 col-lg-7">
            <NewNoteContainer
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
          </div>
        </div>
      )}
    </div>
  );
}