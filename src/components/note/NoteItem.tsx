import type { Note } from "./types";

type Props = {
  note: Note;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  formatDateTime: (ts: string) => string;
};

export default function NoteItem({
  note,
  active,
  onSelect,
  onDelete,
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
        <div className="fw-semibold">
          {note.title || "(Untitled)"}
        </div>

        <div className={active ? "text-white-50 small" : "text-muted small"}>
          {note.categories?.name}
          {note.caregivers && (
            <>
              {" "}
              &middot; {note.caregivers.firstName} {note.caregivers.lastName}
            </>
          )}
        </div>

        <div
          className={active ? "text-white-50 small mt-1" : "text-muted small mt-1"}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "220px",
          }}
        >
          {note.description}
        </div>

        <div className={active ? "text-white-50 small" : "text-muted small"}>
          {formatDateTime(note.createdAt)}
        </div>
      </div>

      <button
        type="button"
        className={"btn btn-sm " + (active ? "btn-light" : "btn-outline-danger")}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label={`Delete note ${note.title || ""}`}
      >
        Delete
      </button>
    </div>
  );
}