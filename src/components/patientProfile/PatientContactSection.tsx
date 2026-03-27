import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import type { AllPatientInfo } from "../../types/patient";
import SectionEditActions from "./SectionEditActions";

interface PatientContactSectionProps {
  patient: AllPatientInfo;
  draft: AllPatientInfo;
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: keyof AllPatientInfo, value: string) => void;
}

const PatientContactSection = ({
  patient,
  draft,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onChange,
}: PatientContactSectionProps) => {
  return (
    <CustomSection
      title="Contact Information"
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
      <div className="d-flex flex-column gap-4">
        <div className="d-flex gap-3">
          <UserRound size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.8rem",
                marginBottom: "6px",
              }}
            >
              First Name
            </div>

            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={draft.firstName || ""}
                onChange={(e) => onChange("firstName", e.target.value)}
              />
            ) : (
              <div style={{ color: "#111827", fontSize: "0.95rem" }}>
                {patient.firstName || "Not Available"}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3">
          <UserRound size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.8rem",
                marginBottom: "6px",
              }}
            >
              Last Name
            </div>

            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={draft.lastName || ""}
                onChange={(e) => onChange("lastName", e.target.value)}
              />
            ) : (
              <div style={{ color: "#111827", fontSize: "0.95rem" }}>
                {patient.lastName || "Not Available"}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3">
          <MapPin size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.8rem",
                marginBottom: "6px",
              }}
            >
              Address
            </div>

            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={draft.address || ""}
                onChange={(e) => onChange("address", e.target.value)}
              />
            ) : (
              <div style={{ color: "#111827", fontSize: "0.95rem" }}>
                {patient.address || "Not Available"}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3">
          <Phone size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.8rem",
                marginBottom: "6px",
              }}
            >
              Phone
            </div>

            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={draft.phoneNumber || ""}
                onChange={(e) => onChange("phoneNumber", e.target.value)}
              />
            ) : (
              <div style={{ color: "#111827", fontSize: "0.95rem" }}>
                {patient.phoneNumber || "Not Available"}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-3">
          <Mail size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.8rem",
                marginBottom: "6px",
              }}
            >
              Email
            </div>

            {isEditing ? (
              <input
                type="email"
                className="form-control"
                value={draft.email || ""}
                onChange={(e) => onChange("email", e.target.value)}
              />
            ) : (
              <div style={{ color: "#111827", fontSize: "0.95rem" }}>
                {patient.email || "Not Available"}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientContactSection;
