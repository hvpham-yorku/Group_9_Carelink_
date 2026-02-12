/**
 * CareLink - Notes Page (ITR1)
 * - Create/Edit/Delete & save notes
 * - Notes stay in localStorage
 * - Tagging (for categorizing notes)
 * - Timeline grouping by day
 * - "Saved" badge shows for 5 seconds after saving
 * UI: Bootstrap + existing CustomSection + Button components.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import CustomSection from "../components/ui/CustomSection";
import Button from "../components/ui/Button";

type Tag = "Medical" | "Vitals" | "Mood" | "Nutrition" | "Activity" | "General";
type Note = { id: string; title: string; content: string; tag: Tag; updatedAt: number };

const STORAGE_KEY = "carelink_notes_v2";
const TAGS: Tag[] = ["Medical", "Vitals", "Mood", "Nutrition", "Activity", "General"];

const utils = {
  id: () => `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  badge: (t: Tag) =>
    t === "Medical" || t === "Vitals"
      ? "bg-danger"
      : t === "Nutrition" || t === "Activity"
      ? "bg-success"
      : "bg-primary",
  dayKey: (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },
  dayLabel: (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
  dt: (ts: number) => new Date(ts).toLocaleString(),
};

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map((n: any) => ({
      id: String(n.id),
      title: String(n.title ?? "(Untitled)"),
      content: String(n.content ?? ""),
      tag: (n.tag as Tag) ?? "General",
      updatedAt: Number(n.updatedAt ?? Date.now()),
    })) as Note[];
  } catch {
    return [];
  }
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes().sort((a, b) => b.updatedAt - a.updatedAt));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // editor
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<Tag>("General");

  // UI
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<number | null>(null);

  const selected = useMemo(() => notes.find((n) => n.id === selectedId) ?? null, [notes, selectedId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (!selected) {
      setTitle("");
      setContent("");
      setTag("General");
      return;
    }
    setTitle(selected.title);
    setContent(selected.content);
    setTag(selected.tag);
  }, [selected]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const timeline = useMemo(() => {
    const map = new Map<string, Note[]>();
    for (const n of notes) {
      const k = utils.dayKey(n.updatedAt);
      (map.get(k) ?? map.set(k, []).get(k)!).push(n);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0))
      .map(([day, items]) => ({ day, items: items.sort((a, b) => b.updatedAt - a.updatedAt) }));
  }, [notes]);

  const flashSaved = () => {
    setSaved(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSaved(false), 5000);
  };

  const handleNew = () => {
    setSelectedId(null);
    setTitle("");
    setContent("");
    setTag("General");
  };

  const handleSave = () => {
    const t = title.trim();
    const c = content.trim();
    if (!t && !c) return;

    const now = Date.now();

    setNotes((prev) => {
      const sorted = (arr: Note[]) => arr.sort((a, b) => b.updatedAt - a.updatedAt);

      if (selected) {
        const updated: Note = { ...selected, title: t || "(Untitled)", content: c, tag, updatedAt: now };
        return sorted(prev.map((n) => (n.id === selected.id ? updated : n)));
      }

      const created: Note = { id: utils.id(), title: t || "(Untitled)", content: c, tag, updatedAt: now };
      setSelectedId(created.id);
      return sorted([created, ...prev]);
    });

    flashSaved();
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) handleNew();
  };

  return (
    <div className="py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h2 className="m-0">Notes</h2>
          <p className="text-muted m-0">Create and manage quick notes for patient care.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {saved && <span className="badge text-bg-success px-3 py-2">Saved</span>}
          <Button color="outline-secondary" onClick={handleNew}>
            + New
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="row g-3">
        {/* Timeline */}
        <div className="col-12 col-lg-5">
          <CustomSection title="Care Timeline" subheader={`Showing ${notes.length} note(s)`}>
            {notes.length === 0 ? (
              <div className="text-muted">
                No notes yet. Click <strong>New</strong> and write something.
              </div>
            ) : (
              timeline.map((g) => (
                <div key={g.day} className="mb-3">
                  <div className="text-muted small fw-semibold mb-2">{utils.dayLabel(g.day)}</div>
                  <div className="list-group">
                    {g.items.map((n) => {
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
                              <span className={`badge ${utils.badge(n.tag)}`}>{n.tag}</span>
                            </div>
                            <div className={active ? "text-white-50 small" : "text-muted small"}>{utils.dt(n.updatedAt)}</div>
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
              ))
            )}
          </CustomSection>
        </div>

        {/* Editor */}
        <div className="col-12 col-lg-7">
          <CustomSection
            title={selected ? "Edit Note" : "New Note"}
            subheader={selected ? `Last updated: ${utils.dt(selected.updatedAt)}` : "Not saved yet"}
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
                  <span className={`badge ${utils.badge(tag)}`}>{tag}</span>
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

            <div className="d-flex justify-content-end align-items-center mt-3">
              <div className="d-flex gap-2">
                {selected && (
                  <Button color="outline-danger" onClick={() => handleDelete(selected.id)}>
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