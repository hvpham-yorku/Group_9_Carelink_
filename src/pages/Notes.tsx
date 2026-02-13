/**
 * Notes Page (ITR1)
 * - Local only notes (localStorage).
 * - Timeline grouping by day.
 * - Tag on each note & colored badge.
 * - Editor does create/update/delete.
 * - Accessibility: labels linked to fields (htmlFor + id), fields have name, issues page while inspect :(
 * - all of the bugs fixed.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import CustomSection from "../components/ui/CustomSection";
import Button from "../components/ui/Button";

type Tag = "Medical" | "Vitals" | "Mood" | "Nutrition" | "Activity" | "General";

type Note = {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  updatedAt: number;
};

const STORAGE_KEY = "carelink_notes_v2";
const TAGS: Tag[] = ["Medical", "Vitals", "Mood", "Nutrition", "Activity", "General"];

function tagBadgeClass(tag: Tag) {
  if (tag === "Medical" || tag === "Vitals") return "bg-danger";
  if (tag === "Nutrition" || tag === "Activity") return "bg-success";
  return "bg-primary";
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString();
}

function dayKey(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Narrow-ish parsing (no `any`)
function toTag(value: unknown): Tag {
  return TAGS.includes(value as Tag) ? (value as Tag) : "General";
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): Note | null => {
        if (typeof item !== "object" || item === null) return null;
        const obj = item as Record<string, unknown>;

        const id = typeof obj.id === "string" ? obj.id : "";
        if (!id) return null;

        const title = typeof obj.title === "string" ? obj.title : "(Untitled)";
        const content = typeof obj.content === "string" ? obj.content : "";
        const tag = toTag(obj.tag);
        const updatedAt =
          typeof obj.updatedAt === "number" && Number.isFinite(obj.updatedAt)
            ? obj.updatedAt
            : Date.now();

        return { id, title, content, tag, updatedAt };
      })
      .filter((n): n is Note => n !== null);
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() =>
    loadNotes().sort((a, b) => b.updatedAt - a.updatedAt)
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // editor fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("General");

  // UI
  const [savedFlash, setSavedFlash] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  // Persist on change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Load selected note into editor
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

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const timelineGroups = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of notes) {
      const k = dayKey(n.updatedAt);
      const arr = map.get(k) ?? [];
      arr.push(n);
      map.set(k, arr);
    }

    const keys = Array.from(map.keys()).sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));

    return keys.map((k) => ({
      day: k,
      items: (map.get(k) ?? []).sort((a, b) => b.updatedAt - a.updatedAt),
    }));
  }, [notes]);

  function flashSaved() {
    setSavedFlash(true);
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    // show for 5 seconds
    saveTimerRef.current = window.setTimeout(() => setSavedFlash(false), 5000);
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
      const updated: Note = {
        ...selectedNote,
        title: trimmedTitle || "(Untitled)",
        content: trimmedContent,
        tag,
        updatedAt: Date.now(),
      };

      setNotes((prev) =>
        prev
          .map((n) => (n.id === selectedNote.id ? updated : n))
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
      flashSaved();
      return;
    }

    const created: Note = {
      id: makeId(),
      title: trimmedTitle || "(Untitled)",
      content: trimmedContent,
      tag,
      updatedAt: Date.now(),
    };

    setNotes((prev) => [created, ...prev].sort((a, b) => b.updatedAt - a.updatedAt));
    setSelectedId(created.id);
    flashSaved();
  }

  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) handleNew();
  }

  return (
    <div className="py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 className="m-0">Notes</h2>
          <p className="text-muted m-0">Create and manage quick notes for patient care.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {savedFlash && <span className="badge text-bg-success px-3 py-2">Saved</span>}
          <Button color="outline-secondary" onClick={handleNew}>
            + New
          </Button>
        </div>
      </div>

      <div className="row g-3">
        {/* Left: Timeline */}
        <div className="col-12 col-lg-5">
          <CustomSection title="Care Timeline" subheader={`Showing ${notes.length} note(s)`}>
            {notes.length === 0 ? (
              <div className="text-muted">
                No notes yet. Click <strong>New</strong> and write something.
              </div>
            ) : (
              timelineGroups.map((group) => (
                <div key={group.day} className="mb-3">
                  <div className="text-muted small fw-semibold mb-2">{formatDayLabel(group.day)}</div>

                  <div className="list-group">
                    {group.items.map((n) => {
                      const active = n.id === selectedId;

                      return (
                        <div
                          key={n.id}
                          role="button"
                          tabIndex={0}
                          className={
                            "list-group-item list-group-item-action d-flex justify-content-between align-items-start " +
                            (active ? "active" : "")
                          }
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedId(n.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedId(n.id);
                          }}
                        >
                          <div className="me-2">
                            <div className="fw-semibold d-flex align-items-center gap-2">
                              {n.title}
                              <span className={`badge ${tagBadgeClass(n.tag)}`}>{n.tag}</span>
                            </div>
                            <div className={active ? "text-white-50 small" : "text-muted small"}>
                              {formatDateTime(n.updatedAt)}
                            </div>
                          </div>

                          <button
                            type="button"
                            className={"btn btn-sm " + (active ? "btn-light" : "btn-outline-danger")}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(n.id);
                            }}
                            aria-label={`Delete note ${n.title}`}
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
            subheader={selectedNote ? `Last updated: ${formatDateTime(selectedNote.updatedAt)}` : "Not saved yet"}
          >
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label htmlFor="noteTitle" className="form-label">
                  Title
                </label>
                <input
                  id="noteTitle"
                  name="noteTitle"
                  className="form-control"
                  placeholder="e.g., Doctor appointment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="noteTag" className="form-label">
                  Tag
                </label>
                <select
                  id="noteTag"
                  name="noteTag"
                  className="form-select"
                  value={tag}
                  onChange={(e) => setTag(e.target.value as Tag)}
                >
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div className="mt-2">
                  <span className={`badge ${tagBadgeClass(tag)}`}>{tag}</span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="noteContent" className="form-label">
                Content
              </label>
              <textarea
                id="noteContent"
                name="noteContent"
                className="form-control"
                rows={10}
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
              {selectedNote && (
                <Button color="outline-danger" onClick={() => handleDelete(selectedNote.id)}>
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
    </div>
  );
}