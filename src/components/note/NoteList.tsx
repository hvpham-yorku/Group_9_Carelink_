import NoteItem from "./NoteItem";
import type { Note } from "./types";

type TimelineGroup = {
  day: string;
  items: Note[];
};

type Props = {
  group: TimelineGroup;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  handleDelete: (id: string) => void;
  formatDateTime: (ts: string) => string;
  formatDayLabel: (key: string) => string;
  isUrgentMode: boolean;
};

export default function NoteList({
  group,
  selectedId,
  setSelectedId,
  handleDelete,
  formatDateTime,
  formatDayLabel,
  isUrgentMode,
}: Props) {
  return (
    <div className="mb-3">
      <div className="text-muted small fw-semibold mb-2">
        {formatDayLabel(group.day)}
      </div>

      <div className="list-group">
        {group.items.map((note) => {
          const active = note.noteId === selectedId;

          return (
            <NoteItem
              key={note.noteId}
              note={note}
              active={active}
              onSelect={() => setSelectedId(note.noteId)}
              onDelete={() => handleDelete(note.noteId)}
              formatDateTime={formatDateTime}
              isUrgentMode={isUrgentMode}
            />
          );
        })}
      </div>
    </div>
  );
}