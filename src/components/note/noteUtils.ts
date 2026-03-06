import type { Note, Tag } from "./types";
import { TAGS } from "./types";

const STORAGE_KEY = "carelink_notes_v2";

export function tagBadgeClass(tag: Tag) {
  if (tag === "Medical" || tag === "Vitals") return "bg-danger";
  if (tag === "Nutrition" || tag === "Activity") return "bg-success";
  return "bg-primary";
}

export function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString();
}

export function dayKey(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDayLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toTag(value: unknown): Tag {
  return TAGS.includes(value as Tag) ? (value as Tag) : "General";
}

export function loadNotes(): Note[] {
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

export function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}