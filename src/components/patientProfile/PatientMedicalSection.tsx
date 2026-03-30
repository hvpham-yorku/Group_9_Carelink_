import { AlertCircle, Plus, X } from "lucide-react";
import CustomSection from "../ui/CustomSection";
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
  onChange: (field: keyof AllPatientInfo, value: string) => void;
  onAllergyChange: (index: number, value: string) => void;
  onAddAllergy: () => void;
  onRemoveAllergy: (index: number) => void;
}

const PatientMedicalSection = ({
  patient,
  draft,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onAllergyChange,
  onAddAllergy,
  onRemoveAllergy,
}: Props) => {
  return (
    <CustomSection
      title="Medical Information"
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
      <div className="d-flex flex-column gap-3">
        <div>
          <div className="text-muted small mb-1">Date of Birth</div>
          {isEditing ? (
            <input
              type="date"
              className="form-control"
              value={draft.dob || ""}
              onChange={(e) => onChange("dob", e.target.value)}
            />
          ) : (
            <div>{patient.dob || "Not Available"}</div>
          )}
        </div>

        <div>
          <div className="text-muted small mb-1">Gender</div>
          {isEditing ? (
            <select
              className="form-select"
              value={draft.gender || ""}
              onChange={(e) => onChange("gender", e.target.value)}
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <div>{patient.gender || "Not Available"}</div>
          )}
        </div>

        <div>
          <div className="text-muted small mb-1">Blood Type</div>
          {isEditing ? (
            <input
              className="form-control"
              value={draft.bloodType || ""}
              onChange={(e) => onChange("bloodType", e.target.value)}
            />
          ) : (
            <div>{patient.bloodType || "Not Available"}</div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div className="text-muted small mb-1">Height</div>
            {isEditing ? (
              <input
                className="form-control"
                value={draft.height || ""}
                onChange={(e) => onChange("height", e.target.value)}
              />
            ) : (
              <div>{patient.height || "Not Available"}</div>
            )}
          </div>

          <div className="col-6">
            <div className="text-muted small mb-1">Weight</div>
            {isEditing ? (
              <input
                className="form-control"
                value={draft.weight || ""}
                onChange={(e) => onChange("weight", e.target.value)}
              />
            ) : (
              <div>{patient.weight || "Not Available"}</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-muted small mb-1">Dietary Requirements</div>
          {isEditing ? (
            <textarea
              className="form-control"
              rows={2}
              value={draft.dietaryRequirements || ""}
              onChange={(e) => onChange("dietaryRequirements", e.target.value)}
            />
          ) : (
            <div>{patient.dietaryRequirements || "Not Available"}</div>
          )}
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="text-muted small mb-0">Allergies</div>

            {isEditing && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                onClick={onAddAllergy}
              >
                <Plus size={14} />
                Add Allergy
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="d-flex flex-column gap-2">
              {(draft.allergies || []).length > 0 ? (
                draft.allergies!.map((allergy, index) => (
                  <div
                    key={`allergy-${index}`}
                    className="d-flex align-items-center gap-2"
                  >
                    <input
                      className="form-control"
                      value={allergy}
                      onChange={(e) =>
                        onAllergyChange(index, e.target.value)
                      }
                      placeholder="Enter allergy"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm d-inline-flex align-items-center justify-content-center"
                      onClick={() => onRemoveAllergy(index)}
                      aria-label={`Remove allergy ${index + 1}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-muted small">
                  No allergies added yet.
                </div>
              )}
            </div>
          ) : patient.allergies?.length ? (
            <div className="d-flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={`allergy-badge-${index}`}
                  className="d-inline-flex align-items-center gap-1"
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  <AlertCircle size={12} />
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <div>Not Available</div>
          )}
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientMedicalSection;