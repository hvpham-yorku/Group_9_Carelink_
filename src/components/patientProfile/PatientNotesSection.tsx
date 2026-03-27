import { ClipboardList } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import Button from "../ui/Button";
import type { PatientInfo } from "../../types/Types";
import SectionEditActions from "./SectionEditActions";

interface Props {
  patient: PatientInfo;
  draft: PatientInfo;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: keyof PatientInfo, value: string) => void;
  onViewNotes: () => void;
}

const PatientNotesSection = ({
  patient,
  draft,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onViewNotes,
}: Props) => {
  return (
    <CustomSection
      title="Care Notes & Preferences"
      rightAction={
        <div className="d-flex gap-2">
          <SectionEditActions
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={onEdit}
            onCancel={onCancel}
            onSave={onSave}
          />
          <Button color="outline-primary" onClick={onViewNotes}>
            View Notes
          </Button>
        </div>
      }
    >
      <div
        className="p-3"
        style={{
          backgroundColor: "#fffbea",
          borderRadius: "12px",
          border: "1px solid #fde68a",
        }}
      >
        <div className="d-flex align-items-start gap-2">
          <ClipboardList size={16} color="#ca8a04" style={{ marginTop: "2px" }} />
          <div className="w-100">
            <div
              className="fw-semibold mb-1"
              style={{ color: "#92400e", fontSize: "0.9rem" }}
            >
              Important Care Information
            </div>

            {isEditing ? (
              <textarea
                className="form-control"
                rows={5}
                value={draft.careNotes || ""}
                onChange={(e) => onChange("careNotes", e.target.value)}
              />
            ) : (
              <div
                style={{
                  fontSize: "0.93rem",
                  color: "#4b5563",
                  lineHeight: 1.6,
                }}
              >
                {patient.careNotes || "Not Available"}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientNotesSection;