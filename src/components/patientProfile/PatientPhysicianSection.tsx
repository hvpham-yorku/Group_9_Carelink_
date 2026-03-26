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
              <input
                className="form-control mb-2"
                placeholder="Name"
                value={draft.physicianName || ""}
                onChange={(e) =>
                  onChange("physicianName", e.target.value)
                }
              />

              <input
                className="form-control mb-2"
                placeholder="Phone"
                value={draft.physicianPhone || ""}
                onChange={(e) =>
                  onChange("physicianPhone", e.target.value)
                }
              />

              <input
                className="form-control"
                placeholder="Address"
                value={draft.physicianAddress || ""}
                onChange={(e) =>
                  onChange("physicianAddress", e.target.value)
                }
              />
            </>
          ) : (
            <>
              <div className="fw-semibold">
                {patient.physicianName || "Not Available"}
              </div>

              <div className="d-flex gap-3 mt-2">
                <span>
                  <Phone size={14} /> {patient.physicianPhone || "—"}
                </span>
                <span>
                  <MapPin size={14} /> {patient.physicianAddress || "—"}
                </span>
              </div>
            </>
          )}

        </div>
      </div>
    </CustomSection>
  );
};

export default PatientPhysicianSection;