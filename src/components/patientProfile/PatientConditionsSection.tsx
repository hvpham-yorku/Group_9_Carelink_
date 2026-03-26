import { HeartPulse } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import type { PatientInfo } from "../../types/Types";

interface Props {
  patient: PatientInfo;
}

const PatientConditionsSection = ({ patient }: Props) => {
  return (
    <CustomSection title="Medical Conditions">
      {patient.conditions?.length ? (
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