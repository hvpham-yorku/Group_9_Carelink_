import { ClipboardList, Edit2, Save, X } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import Button from "../ui/Button";
import type { AllPatientInfo } from "../../types/patient";

interface Props {
  patient: AllPatientInfo;
  draft: AllPatientInfo;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: keyof AllPatientInfo, value: string) => void;
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
}: Props) => {
  const displayNotes =
    patient.careNotes?.trim() || "No care notes or preferences added.";
  const draftNotes = draft.careNotes ?? "";

  return (
    <CustomSection
      title="Care Notes & Preferences"
      rightAction={
        isEditing ? (
          <div className="d-flex gap-2">
            <Button color="outline-secondary" onClick={onCancel}>
              <X size={16} className="me-1" />
              Cancel
            </Button>
            <Button color="primary" onClick={onSave}>
              <Save size={16} className="me-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <Button color="outline-primary" onClick={onEdit}>
            <Edit2 size={16} className="me-1" />
            Edit
          </Button>
        )
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
          <ClipboardList
            size={16}
            color="#ca8a04"
            style={{ marginTop: "2px", flexShrink: 0 }}
          />

          <div className="w-100">
            <div
              className="fw-semibold mb-2"
              style={{ color: "#92400e", fontSize: "0.9rem" }}
            >
              Important Care Information
            </div>

            {isEditing ? (
              <textarea
                className="form-control"
                rows={5}
                value={draftNotes}
                onChange={(e) => onChange("careNotes", e.target.value)}
                placeholder="Enter important care notes and patient preferences..."
              />
            ) : (
              <div
                style={{
                  fontSize: "0.93rem",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {displayNotes}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientNotesSection;