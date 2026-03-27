import { UserRound } from "lucide-react";
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

const EmergencyContactsSection = ({
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
      title="Emergency Contacts"
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
      <div className="row g-3">
        <div className="col-md-6">
          <div
            className="h-100 p-3"
            style={{
              border: "1px solid #fecaca",
              borderRadius: "14px",
              backgroundColor: "#fff7f7",
            }}
          >
            <div
              className="mb-2"
              style={{
                color: "#dc2626",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              PRIMARY CONTACT
            </div>

            <div className="d-flex align-items-start gap-2">
              <UserRound size={16} color="#ef4444" style={{ marginTop: "2px" }} />
              <div className="w-100">
                {isEditing ? (
                  <>
                    <div className="mb-2">
                      <label className="form-label small text-muted mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.emergencyContactName || ""}
                        onChange={(e) =>
                          onChange("emergencyContactName", e.target.value)
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-muted mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.emergencyContactRelationship || ""}
                        onChange={(e) =>
                          onChange("emergencyContactRelationship", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="form-label small text-muted mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.emergencyContactPhone || ""}
                        onChange={(e) =>
                          onChange("emergencyContactPhone", e.target.value)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fw-semibold" style={{ color: "#111827" }}>
                      {patient.emergencyContactName || "Not Available"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      {patient.emergencyContactRelationship || "Not Available"}
                    </div>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "0.92rem",
                        marginTop: "8px",
                      }}
                    >
                      {patient.emergencyContactPhone || "Not Available"}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="h-100 p-3"
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              backgroundColor: "#ffffff",
            }}
          >
            <div
              className="mb-2"
              style={{
                color: "#9ca3af",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              SECONDARY CONTACT
            </div>

            <div className="d-flex align-items-start gap-2">
              <UserRound size={16} color="#9ca3af" style={{ marginTop: "2px" }} />
              <div className="w-100">
                {isEditing ? (
                  <>
                    <div className="mb-2">
                      <label className="form-label small text-muted mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.secondaryEmergencyContactName || ""}
                        onChange={(e) =>
                          onChange(
                            "secondaryEmergencyContactName",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-muted mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.secondaryEmergencyContactRelationship || ""}
                        onChange={(e) =>
                          onChange(
                            "secondaryEmergencyContactRelationship",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="form-label small text-muted mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={draft.secondaryEmergencyContactPhone || ""}
                        onChange={(e) =>
                          onChange(
                            "secondaryEmergencyContactPhone",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fw-semibold" style={{ color: "#111827" }}>
                      {patient.secondaryEmergencyContactName || "Not Available"}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      {patient.secondaryEmergencyContactRelationship ||
                        "Not Available"}
                    </div>
                    <div
                      style={{
                        color: "#111827",
                        fontSize: "0.92rem",
                        marginTop: "8px",
                      }}
                    >
                      {patient.secondaryEmergencyContactPhone ||
                        "Not Available"}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default EmergencyContactsSection;