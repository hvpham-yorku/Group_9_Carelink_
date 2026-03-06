import Button from "../ui/Button";

type Props = {
  savedFlash: boolean;
  onNew: () => void;
};

export default function NotesHeader({ savedFlash, onNew }: Props) {
  return (
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h2 className="m-0">Notes</h2>
        <p className="text-muted m-0">
          Create and manage quick notes for patient care.
        </p>
      </div>

      <div className="d-flex align-items-center gap-2">
        {savedFlash && (
          <span className="badge text-bg-success px-3 py-2">Saved</span>
        )}
        <Button color="outline-secondary" onClick={onNew}>
          + New
        </Button>
      </div>
    </div>
  );
}