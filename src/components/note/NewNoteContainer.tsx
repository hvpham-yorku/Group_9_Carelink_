import NoteForm from "./NoteForm";
import type { Note, NoteCategory } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  selectedNote: Note | null;
  formatDateTime: (ts: string) => string;

  title: string;
  description: string;
  categoryId: string;
  isUrgent: boolean;

  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setCategoryId: (value: string) => void;
  setIsUrgent: (value: boolean) => void;

  handleSave: () => void;
  handleDelete: (id: string) => void;

  categories: NoteCategory[];
};

export default function NewNoteContainer({
  isOpen,
  onClose,
  selectedNote,
  formatDateTime,
  ...formProps
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="card shadow-sm border-0 h-100">
      <div
        style={{
          padding: "2px",
          borderRadius: "1rem",
          background:
            "linear-gradient(135deg, #b8d8ff 0%, #dcecff 45%, #f4f9ff 100%)",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "0.9rem",
            overflow: "hidden",
          }}
        >
          <div
            className="d-flex justify-content-between align-items-start border-0"
            style={{
              background: "linear-gradient(135deg, #e7f1ff 0%, #f4f8ff 100%)",
              padding: "1rem 1rem 0.75rem 1rem",
            }}
          >
            <div>
              <h5 className="fw-bold mb-1">
                {selectedNote ? "Edit Note" : "New Note"}
              </h5>
              <div className="text-muted small">
                {selectedNote
                  ? `Created: ${selectedNote.createdAt ? formatDateTime(selectedNote.createdAt) : "Unknown"}`
                  : "Not saved yet"}
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="p-4">
            <NoteForm
              selectedNote={selectedNote}
              onCancel={onClose}
              {...formProps}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
