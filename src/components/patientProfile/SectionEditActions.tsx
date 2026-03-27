import Button from "../ui/Button";
import { Edit2, Save, X } from "lucide-react";

interface SectionEditActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const SectionEditActions = ({
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}: SectionEditActionsProps) => {
  if (isEditing) {
    return (
      <div className="d-flex gap-2">
        <Button
          color="outline-secondary"
          icon={<X size={16} />}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          color="primary"
          icon={<Save size={16} />}
          onClick={onSave}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      color="outline-primary"
      icon={<Edit2 size={16} />}
      onClick={onEdit}
    >
      Edit
    </Button>
  );
};

export default SectionEditActions;