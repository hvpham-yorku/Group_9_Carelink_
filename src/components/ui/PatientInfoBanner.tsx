import type { PatientInfo } from "../../types/Types";
import { UserRound } from "lucide-react";
import {
  formatDayLabel,
  formatDayKey,
  calculateAge,
} from "../../utils/formatters";

interface PatientInfoBannerProps {
  patient: PatientInfo;
}

const PatientInfoBanner = ({ patient }: PatientInfoBannerProps) => {
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const dob = patient.dob ? formatDayLabel(formatDayKey(patient.dob)) : "—";
  const age = patient.dob ? calculateAge(patient.dob) : null;

  return (
    <div
      className="p-4 p-md-5 mb-4"
      style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%)",
        borderRadius: "20px",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.18)",
      }}
    >
      <div className="d-flex align-items-start gap-4">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <UserRound size={34} color="white" />
        </div>

        <div className="flex-grow-1">
          <h1 className="fw-bold mb-1" style={{ fontSize: "2rem" }}>
            {fullName}
          </h1>

          <div
            className="mb-1"
            style={{
              color: "rgba(255,255,255,0.88)",
              fontSize: "0.98rem",
            }}
          >
            {patient.gender || "Not Available"}
            {age !== null ? ` • Age ${age}` : ""}
          </div>

          <div
            className="mb-3"
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "0.92rem",
            }}
          >
            Born: {dob}
          </div>

          <div className="d-flex flex-wrap gap-2">
            {(patient.conditions && patient.conditions.length > 0
              ? patient.conditions
              : ["No Conditions Listed"]
            ).map((condition, index) => (
              <span
                key={index}
                style={{
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                }}
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoBanner;