import { UserRound } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import type { PatientInfo } from "../../types/Types";

interface Props {
  patient: PatientInfo;
}

const EmergencyContactsSection = ({ patient }: Props) => {
  return (
    <CustomSection title="Emergency Contacts">
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

            <div className="d-flex align-items-start gap-2 mb-2">
              <UserRound size={16} color="#ef4444" style={{ marginTop: "2px" }} />
              <div>
                <div className="fw-semibold" style={{ color: "#111827" }}>
                  {patient.emergencyContactName || "Not Available"}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  {patient.emergencyContactRelationship || "Not Available"}
                </div>
              </div>
            </div>

            <div style={{ color: "#111827", fontSize: "0.92rem" }}>
              {patient.emergencyContactPhone || "Not Available"}
            </div>

            <div
              style={{
                color: "#9ca3af",
                fontSize: "0.82rem",
                marginTop: "4px",
              }}
            >
              Not Available
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

            <div className="fw-semibold" style={{ color: "#111827" }}>
              Not Available
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Not Available
            </div>
            <div
              style={{ color: "#111827", fontSize: "0.92rem", marginTop: "8px" }}
            >
              Not Available
            </div>
            <div
              style={{
                color: "#9ca3af",
                fontSize: "0.82rem",
                marginTop: "4px",
              }}
            >
              Not Available
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default EmergencyContactsSection;