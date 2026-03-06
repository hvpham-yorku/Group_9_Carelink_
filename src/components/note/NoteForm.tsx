import Button from "../ui/Button";

type Props = {
  selectedNote: any;

  title: string;
  content: string;
  tag: string;

  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setTag: (v: any) => void;

  handleSave: () => void;
  handleDelete: (id: string) => void;

  TAGS: string[];
  tagBadgeClass: (tag: any) => string;
};

export default function NoteForm({
  selectedNote,
  title,
  content,
  tag,
  setTitle,
  setContent,
  setTag,
  handleSave,
  handleDelete,
  TAGS,
  tagBadgeClass,
}: Props) {
  return (
    <>
      <div className="row g-3">
        <div className="col-12 col-md-8">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            placeholder="e.g., Doctor appointment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Tag</label>

          <select
            className="form-select"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="mt-2">
            <span className={`badge ${tagBadgeClass(tag)}`}>{tag}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label">Content</label>

        <textarea
          className="form-control"
          rows={10}
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
        {selectedNote && (
          <Button
            color="outline-danger"
            onClick={() => handleDelete(selectedNote.id)}
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