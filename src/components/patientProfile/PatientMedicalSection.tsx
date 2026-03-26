import { AlertCircle } from "lucide-react";
import CustomSection from "../ui/CustomSection";
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
  onAllergyChange: (value: string) => void;
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
          <div className="text-muted small mb-1">Allergies</div>

          {isEditing ? (
            <input
              className="form-control"
              placeholder="Separate allergies with commas"
              value={draft.allergies?.join(", ") || ""}
              onChange={(e) => onAllergyChange(e.target.value)}
            />
          ) : patient.allergies?.length ? (
            <div className="d-flex flex-wrap gap-2">
              {patient.allergies.map((a, i) => (
                <span
                  key={i}
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
                  {a}
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