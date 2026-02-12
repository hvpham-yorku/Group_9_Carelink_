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

const STORAGE_KEY = "carelink_notes_v2"; // keep v2 since tag exists

const TAGS: Tag[] = ["Medical", "Vitals", "Mood", "Nutrition", "Activity", "General"];

function isUrgent(tag: Tag) {
  return tag === "Medical" || tag === "Vitals";
}

function tagBadgeClass(tag: Tag) {
  // red: urgent, green: nutrition/activity, blue: mood/general
  if (tag === "Medical" || tag === "Vitals") return "bg-danger";
  if (tag === "Nutrition" || tag === "Activity") return "bg-success";
  return "bg-primary";
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    if (!Array.isArray(parsed)) return [];

    // defensive: if older notes exist without tag, default them to General
    return parsed.map((n: any) => ({
      id: String(n.id),
      title: String(n.title ?? "(Untitled)"),
      content: String(n.content ?? ""),
      tag: (n.tag as Tag) ?? "General",
      updatedAt: Number(n.updatedAt ?? Date.now()),
    }));
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString();
}

function dayKey(ts: number) {
  // YYYY-MM-DD local
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(key: string) {
  // key: YYYY-MM-DD
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

  // UI states
  const [savedFlash, setSavedFlash] = useState(false);
  const [showUrgentPanel, setShowUrgentPanel] = useState(false);

  const saveTimerRef = useRef<number | null>(null);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  // persist notes on any change
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // load selected note into editor
  useEffect(() => {
    if (!selectedNote) {
      setTitle("");
      setContent("");
      setTag("General");
      return;
    }
    setTitle(selectedNote.title);
    setContent(selectedNote.content);
    setTag(selectedNote.tag ?? "General");
  }, [selectedNote]);

  // cleanup timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  // summary cards
  const todayKey = dayKey(Date.now());
  const totalNotes = notes.length;
  const todaysNotes = useMemo(
    () => notes.filter((n) => dayKey(n.updatedAt) === todayKey).length,
    [notes, todayKey]
  );
  const urgentNotes = useMemo(() => notes.filter((n) => isUrgent(n.tag)).length, [notes]);

  // timeline groups (ALL notes, no filters)
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

  const urgentList = useMemo(() => {
    return notes
      .filter((n) => isUrgent(n.tag))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  function flashSaved() {
    setSavedFlash(true);
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => setSavedFlash(false), 1800);
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
    } else {
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
  }

  function handleDelete(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) handleNew();
  }

  function handleSelectUrgent(id: string) {
    setSelectedId(id);
    setShowUrgentPanel(false);
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
          {savedFlash && <span className="badge text-bg-success px-3 py-2">Saved ✅</span>}

          <Button color="outline-secondary" onClick={handleNew}>
            + New
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Total Notes</div>
              <div className="fs-3 fw-semibold">{totalNotes}</div>
              <div className="text-muted small">All time</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="text-muted small">Today’s Notes</div>
              <div className="fs-3 fw-semibold">{todaysNotes}</div>
              <div className="text-muted small">Current day</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm border-warning">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Urgent Notes</div>
                <div className="fs-3 fw-semibold">{urgentNotes}</div>
                <button
                  type="button"
                  className="btn btn-link p-0 text-warning fw-semibold"
                  onClick={() => setShowUrgentPanel((v) => !v)}
                >
                  Needs review
                </button>
              </div>
              <span className="badge text-bg-warning px-3 py-2">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="row g-3">
        {/* Left: Timeline */}
        <div className="col-12 col-lg-5">
          <CustomSection title="Care Timeline" subheader={`Showing ${notes.length} note(s)`}>
            {showUrgentPanel && (
              <div className="card border-warning mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="fw-semibold text-warning">Urgent notes (Needs review)</div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setShowUrgentPanel(false)}
                  >
                    Close
                  </button>
                </div>

                <div className="card-body p-2" style={{ maxHeight: 260, overflowY: "auto" }}>
                  {urgentList.length === 0 ? (
                    <div className="text-muted p-2">No urgent notes right now.</div>
                  ) : (
                    <div className="list-group">
                      {urgentList.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => handleSelectUrgent(n.id)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="me-2">
                              <div className="fw-semibold">{n.title}</div>
                              <div className="text-muted small">{formatDateTime(n.updatedAt)}</div>
                            </div>
                            <span className={`badge ${tagBadgeClass(n.tag)}`}>{n.tag}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <div className="text-muted">
                No notes yet. Click <strong>New</strong> and write something.
              </div>
            ) : (
              <div>
                {timelineGroups.map((group) => (
                  <div key={group.day} className="mb-3">
                    <div className="text-muted small fw-semibold mb-2">{formatDayLabel(group.day)}</div>

                    <div className="list-group">
                      {group.items.map((n) => {
                        const active = n.id === selectedId;
                        return (
                          <button
                            key={n.id}
                            type="button"
                            className={
                              "list-group-item list-group-item-action d-flex justify-content-between align-items-start " +
                              (active ? "active" : "")
                            }
                            onClick={() => setSelectedId(n.id)}
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
                            >
                              Delete
                            </button>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
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
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  placeholder="e.g., Doctor appointment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Tag</label>
                <select className="form-select" value={tag} onChange={(e) => setTag(e.target.value as Tag)}>
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div className="mt-2">
                  <span className={`badge ${tagBadgeClass(tag)}`}>
                    {tag} {isUrgent(tag) ? "• Urgent" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows={10}
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted small">Notes are stored locally in your browser (localStorage).</div>

              <div className="d-flex gap-2">
                {selectedNote && (
                  <Button color="outline-danger" onClick={() => handleDelete(selectedNote.id)}>
                    Delete
                  </Button>
                )}
                <Button color="primary" onClick={handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </CustomSection>
        </div>
      </div>
    </div>
  );
}