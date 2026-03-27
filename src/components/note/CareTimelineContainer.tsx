import CustomSection from "../ui/CustomSection";
import NoteList from "./NoteList";
import type { Note } from "./types";

type TimelineGroup = {
  day: string;
  items: Note[];
};

type Props = {
  notes: Note[];
  timelineGroups: TimelineGroup[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  handleDelete: (id: string) => void;
  formatDayLabel: (key: string) => string;
  formatDateTime: (ts: string) => string;
  isLoading: boolean;
  isUrgentMode: boolean;
};

export default function CareTimelineContainer({
  notes,
  timelineGroups,
  selectedId,
  setSelectedId,
  handleDelete,
  formatDayLabel,
  formatDateTime,
  isLoading,
  isUrgentMode,
}: Props) {
  return (
    <CustomSection
      title="Care Timeline"
      subheader={`Showing ${notes.length} note(s)`}
    >
      {isLoading ? (
        <div className="text-muted">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="text-muted">
          No notes yet. Click <strong>+ New</strong> and write something.
        </div>
      ) : (
        timelineGroups.map((group) => (
          <NoteList
            key={group.day}
            group={group}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            handleDelete={handleDelete}
            formatDayLabel={formatDayLabel}
            formatDateTime={formatDateTime}
            isUrgentMode={isUrgentMode}
          />
        ))
      )}
    </CustomSection>
  );
}