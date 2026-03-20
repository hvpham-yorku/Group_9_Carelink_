import Button from "../ui/Button";
import CustomTitleBanner from "../ui/CustomTitleBanner";
import { StickyNoteIcon } from "lucide-react";

type Props = {
  savedFlash: boolean;
  onNew: () => void;
};

export default function NotesHeader({ savedFlash, onNew }: Props) {
  return (
    <CustomTitleBanner
      title="Notes"
      subheader="Create and manage notes for patient care"
    >
      <div className="d-flex align-items-center gap-2 mt-2">
        {savedFlash && (
          <span className="badge text-bg-success px-3 py-2">Saved</span>
        )}

        <Button color="primary" onClick={onNew}>
          <span className="d-inline-flex align-items-center gap-2">
            <StickyNoteIcon size={18} />
            New
          </span>
        </Button>
      </div>
    </CustomTitleBanner>
  );
}