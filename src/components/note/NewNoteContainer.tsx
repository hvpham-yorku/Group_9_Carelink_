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

  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setCategoryId: (value: string) => void;

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
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content border-0 shadow"
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "2px",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, #b7f0c2 0%, #d7f8df 45%, #eefcf1 100%)",
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
                  className="modal-header border-0"
                  style={{
                    background: "linear-gradient(135deg, #dff7e6 0%, #edfdf2 100%)",
                    paddingTop: "1rem",
                    paddingBottom: "0.75rem",
                  }}
                >
                  <div>
                    <h5 className="modal-title fw-bold mb-1">
                      {selectedNote ? "Edit Note" : "New Note"}
                    </h5>
                    <div className="text-muted small">
                      {selectedNote
                        ? `Created: ${formatDateTime(selectedNote.createdAt)}`
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

                <div className="modal-body pt-4">
                  <NoteForm
                    selectedNote={selectedNote}
                    onCancel={onClose}
                    {...formProps}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}