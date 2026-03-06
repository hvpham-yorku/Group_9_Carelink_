import NoteItem from "./NoteItem";

type Props = {
  group: any;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  handleDelete: (id: string) => void;
  tagBadgeClass: (tag: any) => string;
  formatDateTime: (ts: number) => string;
  formatDayLabel: (key: string) => string;
};

export default function NoteList({
  group,
  selectedId,
  setSelectedId,
  handleDelete,
  tagBadgeClass,
  formatDateTime,
  formatDayLabel,
}: Props) {
  return (
    <div className="mb-3">
      <div className="text-muted small fw-semibold mb-2">
        {formatDayLabel(group.day)}
      </div>

      <div className="list-group">
        {group.items.map((n: any) => {
          const active = n.id === selectedId;

          return (
            <NoteItem
              key={n.id}
              note={n}
              active={active}
              onSelect={() => setSelectedId(n.id)}
              onDelete={() => handleDelete(n.id)}
              tagBadgeClass={tagBadgeClass}
              formatDateTime={formatDateTime}
            />
          );
        })}
      </div>
    </div>
  );
}