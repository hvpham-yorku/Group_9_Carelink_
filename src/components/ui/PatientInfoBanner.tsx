import type { PatientInfo } from "../../types/Types";
import {
  formatDayLabel,
  formatDayKey,
  calculateAge,
} from "../../utils/formatters";

const styles = {
  banner: {
    background: "linear-gradient(135deg, #1a6b4a 0%, #2d9c6e 100%)",
    borderRadius: "18px",
    color: "#fff",
  },
};

interface PatientInfoBannerProps {
  patient: PatientInfo;
}

const PatientInfoBanner = ({ patient }: PatientInfoBannerProps) => {
  const fullName = `${patient.firstName} ${patient.lastName}`;
  const dob = patient.dob ? formatDayLabel(formatDayKey(patient.dob)) : "—";
  const age = patient.dob ? calculateAge(patient.dob) : null;

  return (
    <div className="p-4 mb-4" style={styles.banner}>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <div
            className="fw-bold"
            style={{ fontSize: "2.6rem", lineHeight: 1.1 }}
          >
            {fullName}
          </div>

          <div className="mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>
            Date of Birth: {dob}
            {age !== null ? ` (Age ${age})` : ""}
          </div>

          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            Address: {patient.address || "—"}
          </div>

          <div style={{ color: "rgba(255,255,255,0.85)" }}>
            Phone: {patient.phoneNumber || "—"}
          </div>
        </div>

        <div
          className="p-3"
          style={{
            borderRadius: "14px",
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.15)",
            minWidth: "240px",
            alignSelf: "flex-start",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
            Emergency Contact
          </div>

          <div
            className="fw-semibold mt-1"
            style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
          >
            {patient.emergencyContactName || "Coming soon"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoBanner;