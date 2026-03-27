import { HeartPulse, Plus, Trash2 } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import Button from "../ui/Button";
import type { AllPatientInfo } from "../../types/patient";
import SectionEditActions from "./SectionEditActions";

interface Props {
  patient: AllPatientInfo;
  draft: AllPatientInfo;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onConditionChange: (index: number, value: string) => void;
  onAddCondition: () => void;
  onRemoveCondition: (index: number) => void;
}

const PatientConditionsSection = ({
  patient,
  draft,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onConditionChange,
  onAddCondition,
  onRemoveCondition,
}: Props) => {
  return (
    <CustomSection
      title="Medical Conditions"
      rightAction={
        <SectionEditActions
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
        />
      }
    >
      {isEditing ? (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted small">Conditions</div>
            <Button
              color="outline-primary"
              icon={<Plus size={16} />}
              onClick={onAddCondition}
            >
              Add Condition
            </Button>
          </div>

          <div className="d-flex flex-column gap-2">
            {(draft.conditions || []).map((condition, index) => (
              <div key={index} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  value={condition}
                  onChange={(e) => onConditionChange(index, e.target.value)}
                  placeholder="Enter condition"
                />
                <Button
                  color="outline-danger"
                  icon={<Trash2 size={16} />}
                  onClick={() => onRemoveCondition(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            {(!draft.conditions || draft.conditions.length === 0) && (
              <div className="text-muted">No conditions added yet.</div>
            )}
          </div>
        </div>
      ) : patient.conditions?.length ? (
        <div className="d-flex flex-column gap-2">
          {patient.conditions.map((condition, index) => (
            <div
              key={index}
              className="d-flex align-items-center gap-3 px-3 py-3"
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: "#eef4ff",
                  flexShrink: 0,
                }}
              >
                <HeartPulse size={15} color="#3b82f6" />
              </div>

              <span
                style={{
                  color: "#111827",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                {condition}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#6b7280" }}>Not Available</div>
      )}
    </CustomSection>
  );
};

export default PatientConditionsSection;
