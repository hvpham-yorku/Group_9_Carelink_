import { useEffect, useMemo, useRef, useState } from "react";
import NotesHeader from "../components/note/NotesHeader";
import CareTimelineContainer from "../components/note/CareTimelineContainer";
import NewNoteContainer from "../components/note/NewNoteContainer";
import type { Note, Tag } from "../components/note/types";
import { TAGS } from "../components/note/types";
import {
  dayKey,
  formatDateTime,
  formatDayLabel,
  loadNotes,
  makeId,
  saveNotes,
  tagBadgeClass,
} from "../components/note/noteUtils";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() =>
    loadNotes().sort((a, b) => b.updatedAt - a.updatedAt)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("General");

  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) ?? null,
    [notes, selectedId]
  );

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (!selectedNote) {
      setTitle("");
      setContent("");
      setTag("General");
      return;
    }

    setTitle(selectedNote.title);
    setContent(selectedNote.content);
    setTag(selectedNote.tag);
  }, [selectedNote]);

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
      const key = dayKey(note.updatedAt);
      const group = map.get(key) ?? [];
      group.push(note);
      map.set(key, group);
    }

    const keys = Array.from(map.keys()).sort((a, b) => (a > b ? -1 : 1));

    return keys.map((key) => ({
      day: key,
      items: (map.get(key) ?? []).sort((a, b) => b.updatedAt - a.updatedAt),
    }));
  }, [notes]);

  function flashSaved() {
    setSavedFlash(true);

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      setSavedFlash(false);
    }, 5000);
  }

  function handleNew() {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setTag("General");
  }

  function handleSave() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) return;

    if (selectedNote) {
      const updatedNote: Note = {
        ...selectedNote,
        title: trimmedTitle || "(Untitled)",
        content: trimmedContent,
        tag,
        updatedAt: Date.now(),
      };

      setNotes((prev) =>
        prev
          .map((note) => (note.id === selectedNote.id ? updatedNote : note))
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );

      flashSaved();
      return;
    }

    const newNote: Note = {
      id: makeId(),
      title: trimmedTitle || "(Untitled)",
      content: trimmedContent,
      tag,
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev].sort((a, b) => b.updatedAt - a.updatedAt));
    setSelectedId(newNote.id);
    flashSaved();
  }

  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((note) => note.id !== id));

    if (selectedId === id) {
      handleNew();
    }
  }

  return (
    <div className="py-3">
      <NotesHeader savedFlash={savedFlash} onNew={handleNew} />

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <CareTimelineContainer
            notes={notes}
            timelineGroups={timelineGroups}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            tagBadgeClass={tagBadgeClass}
            formatDateTime={formatDateTime}
            formatDayLabel={formatDayLabel}
          />
        </div>

        <div className="col-12 col-lg-7">
          <NewNoteContainer
            selectedNote={selectedNote}
            formatDateTime={formatDateTime}
            title={title}
            content={content}
            tag={tag}
            setTitle={setTitle}
            setContent={setContent}
            setTag={setTag}
            handleSave={handleSave}
            handleDelete={handleDelete}
            TAGS={TAGS}
            tagBadgeClass={tagBadgeClass}
          />
        </div>
      </div>
    </div>
  );
}