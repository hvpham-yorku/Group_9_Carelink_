import { MapPin, Phone, Stethoscope } from "lucide-react";
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
}

const PatientPhysicianSection = ({
  patient,
  draft,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onChange,
}: Props) => {
  return (
    <CustomSection
      title="Primary Care Physician"
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
      <div className="d-flex align-items-start gap-3">
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            backgroundColor: "#eef4ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stethoscope size={18} color="#3b82f6" />
        </div>

        <div className="flex-grow-1">
          {isEditing ? (
            <>
              <div className="mb-2">
                <label className="form-label small text-muted mb-1">
                  Physician Name
                </label>
                <input
                  className="form-control"
                  value={draft.physicianName || ""}
                  onChange={(e) => onChange("physicianName", e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">
                  Specialty
                </label>
                <input
                  className="form-control"
                  value={draft.physicianSpecialty || ""}
                  onChange={(e) =>
                    onChange("physicianSpecialty", e.target.value)
                  }
                />
              </div>

              <div className="mb-2">
                <label className="form-label small text-muted mb-1">
                  Phone
                </label>
                <input
                  className="form-control"
                  value={draft.physicianPhone || ""}
                  onChange={(e) => onChange("physicianPhone", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label small text-muted mb-1">
                  Address
                </label>
                <input
                  className="form-control"
                  value={draft.physicianAddress || ""}
                  onChange={(e) => onChange("physicianAddress", e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="fw-semibold">
                {patient.physicianName || "Not Available"}
              </div>

              <div
                className="text-muted"
                style={{ fontSize: "0.9rem", marginTop: "2px", marginBottom: "10px" }}
              >
                {patient.physicianSpecialty || "Not Available"}
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <Phone size={14} color="#9ca3af" />
                    <span style={{ color: "#111827", fontSize: "0.92rem" }}>
                      {patient.physicianPhone || "Not Available"}
                    </span>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-2">
                    <MapPin size={14} color="#9ca3af" />
                    <span style={{ color: "#111827", fontSize: "0.92rem" }}>
                      {patient.physicianAddress || "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientPhysicianSection;