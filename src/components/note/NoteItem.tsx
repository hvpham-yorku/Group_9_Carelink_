import type { Note } from "./types";

type Props = {
  note: Note;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  formatDateTime: (ts: string) => string;
  isUrgentMode: boolean;
};

export default function NoteItem({
  note,
  active,
  onSelect,
  onDelete,
  formatDateTime,
  isUrgentMode,
}: Props) {
  const isUrgentHighlighted = isUrgentMode && note.isUrgent;

  return (
    <div
      role="button"
      tabIndex={0}
      className={
        "list-group-item list-group-item-action d-flex justify-content-between align-items-start " +
        (active ? "active" : "")
      }
      style={{
        cursor: "pointer",

        // ===== URGENT STYLE =====
        backgroundColor: isUrgentHighlighted ? "#fff4e6" : undefined,
        border: isUrgentHighlighted ? "1px solid #ffd8a8" : undefined,
      }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className="me-2">
        <div className="fw-semibold d-flex align-items-center gap-2">
          {note.title || "(Untitled)"}

          {/* ===== URGENT BADGE ===== */}
          {isUrgentHighlighted && (
            <span
              className="badge"
              style={{
                backgroundColor: "#ffa94d",
                color: "#fff",
                fontSize: "0.65rem",
                padding: "0.25rem 0.4rem",
              }}
            >
              urgent
            </span>
          )}
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
          className={
            active ? "text-white-50 small mt-1" : "text-muted small mt-1"
          }
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
          {note.createdAt ? formatDateTime(note.createdAt) : ""}
        </div>
      </div>

      <button
        type="button"
        className={
          "btn btn-sm " + (active ? "btn-light" : "btn-outline-danger")
        }
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
