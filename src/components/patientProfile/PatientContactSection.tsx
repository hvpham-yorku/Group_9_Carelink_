import { Mail, MapPin, Phone } from "lucide-react";
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

const PatientContactSection = ({
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

        {/* Address */}
        <div className="d-flex gap-3">
          <MapPin size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div className="text-muted small mb-1">Address</div>

            {isEditing ? (
              <input
                className="form-control"
                value={draft.address || ""}
                onChange={(e) => onChange("address", e.target.value)}
              />
            ) : (
              <div>{patient.address || "Not Available"}</div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="d-flex gap-3">
          <Phone size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div className="text-muted small mb-1">Phone</div>

            {isEditing ? (
              <input
                className="form-control"
                value={draft.phoneNumber || ""}
                onChange={(e) => onChange("phoneNumber", e.target.value)}
              />
            ) : (
              <div>{patient.phoneNumber || "Not Available"}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="d-flex gap-3">
          <Mail size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div className="w-100">
            <div className="text-muted small mb-1">Email</div>

            {isEditing ? (
              <input
                className="form-control"
                value={draft.email || ""}
                onChange={(e) => onChange("email", e.target.value)}
              />
            ) : (
              <div>{patient.email || "Not Available"}</div>
            )}
          </div>
        </div>

      </div>
    </CustomSection>
  );
};

export default PatientContactSection;