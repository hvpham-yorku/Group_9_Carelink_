import Button from "../ui/Button";
import type { Note, NoteCategory } from "./types";

type Props = {
  selectedNote: Note | null;

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

export default function NoteForm({
  selectedNote,
  title,
  description,
  categoryId,
  setTitle,
  setDescription,
  setCategoryId,
  handleSave,
  handleDelete,
  categories,
}: Props) {
  return (
    <>
      {/* Title */}
      <div className="mb-3">
        <label htmlFor="noteTitle" className="form-label">
          Title
        </label>

        <input
          id="noteTitle"
          name="noteTitle"
          className="form-control"
          placeholder="e.g., Doctor visit summary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label htmlFor="noteCategory" className="form-label">
          Category
        </label>

        <select
          id="noteCategory"
          name="noteCategory"
          className="form-select"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.length === 0 && (
            <option value="">No categories available</option>
          )}

          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="noteDescription" className="form-label">
          Content
        </label>

        <textarea
          id="noteDescription"
          name="noteDescription"
          className="form-control"
          rows={10}
          placeholder="Write your note here…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-end align-items-center gap-2">
        {selectedNote && (
          <Button
            color="outline-danger"
            onClick={() => handleDelete(selectedNote.noteId)}
          >
            Delete
          </Button>
        )}

        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  );
}