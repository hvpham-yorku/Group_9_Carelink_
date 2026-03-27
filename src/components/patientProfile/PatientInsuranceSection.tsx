import { Shield } from "lucide-react";
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
}

const PatientInsuranceSection = ({
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
      title="Insurance Information"
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
            backgroundColor: "#eef6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Shield size={18} color="#2563eb" />
        </div>

        <div className="flex-grow-1 d-flex flex-column gap-3">
          <div>
            <div className="text-muted small mb-1">Provider</div>
            {isEditing ? (
              <input
                className="form-control"
                value={draft.insuranceProvider || ""}
                onChange={(e) => onChange("insuranceProvider", e.target.value)}
              />
            ) : (
              <div>{patient.insuranceProvider || "Not Available"}</div>
            )}
          </div>

          <div>
            <div className="text-muted small mb-1">Policy Number</div>
            {isEditing ? (
              <input
                className="form-control"
                value={draft.insurancePolicyNumber || ""}
                onChange={(e) =>
                  onChange("insurancePolicyNumber", e.target.value)
                }
              />
            ) : (
              <div>{patient.insurancePolicyNumber || "Not Available"}</div>
            )}
          </div>

          <div>
            <div className="text-muted small mb-1">Group Number</div>
            {isEditing ? (
              <input
                className="form-control"
                value={draft.groupNumber || ""}
                onChange={(e) => onChange("groupNumber", e.target.value)}
              />
            ) : (
              <div>{patient.groupNumber || "Not Available"}</div>
            )}
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientInsuranceSection;
