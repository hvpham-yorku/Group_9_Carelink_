import CustomSection from "../ui/CustomSection";
import NoteList from "./NoteList";

type Props = {
  notes: any[];
  timelineGroups: any[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  handleDelete: (id: string) => void;
  tagBadgeClass: (tag: any) => string;
  formatDateTime: (ts: number) => string;
  formatDayLabel: (key: string) => string;
};

export default function CareTimelineContainer({
  notes,
  timelineGroups,
  selectedId,
  setSelectedId,
  handleDelete,
  tagBadgeClass,
  formatDateTime,
  formatDayLabel,
}: Props) {
  return (
    <CustomSection
      title="Care Timeline"
      subheader={`Showing ${notes.length} note(s)`}
    >
      {timelineGroups.map((group) => (
        <NoteList
          key={group.day}
          group={group}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          handleDelete={handleDelete}
          tagBadgeClass={tagBadgeClass}
          formatDateTime={formatDateTime}
          formatDayLabel={formatDayLabel}
        />
      ))}
    </CustomSection>
  );
}