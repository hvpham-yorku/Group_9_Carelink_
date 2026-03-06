type Props = {
  note: any;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  tagBadgeClass: (tag: any) => string;
  formatDateTime: (ts: number) => string;
};

export default function NoteItem({
  note,
  active,
  onSelect,
  onDelete,
  tagBadgeClass,
  formatDateTime,
}: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={
        "list-group-item list-group-item-action d-flex justify-content-between align-items-start " +
        (active ? "active" : "")
      }
      style={{ cursor: "pointer" }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className="me-2">
        <div className="fw-semibold d-flex align-items-center gap-2">
          {note.title}
          <span className={`badge ${tagBadgeClass(note.tag)}`}>
            {note.tag}
          </span>
        </div>

        <div className={active ? "text-white-50 small" : "text-muted small"}>
          {formatDateTime(note.updatedAt)}
        </div>
      </div>

      <button
        type="button"
        className={"btn btn-sm " + (active ? "btn-light" : "btn-outline-danger")}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Delete
      </button>
    </div>
  );
}