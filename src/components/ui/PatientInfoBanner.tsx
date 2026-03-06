import { useEffect, useState } from "react";
import type { PatientInfo } from "../../types/Types";
import { usePatient } from "../../contexts/patient/usePatient";
import { patientService } from "../../services/patientService";
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
  pill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
    fontSize: "0.82rem",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};

const PatientInfoBanner = () => {
  const { selectedPatientId, loading: patientLoading } = usePatient();
  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await patientService.getFullProfile(selectedPatientId);
        setPatient(data as PatientInfo);
      } catch (err) {
        console.error("Failed to load patient profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [selectedPatientId]);

  if (patientLoading || loading) {
    return (
      <div className="p-4 mb-4 text-center text-muted" style={styles.banner}>
        <span className="spinner-border spinner-border-sm me-2" />
        Loading patient profile…
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-4 mb-4 text-center text-white" style={styles.banner}>
        No patient selected.
      </div>
    );
  }

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const dob = patient.dob ? formatDayLabel(formatDayKey(patient.dob)) : "—";
  const age = patient.dob ? calculateAge(patient.dob) : null;

  return (
    <div className="p-4 mb-4" style={styles.banner}>
      <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
        {/* Left: name + details */}
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

        {/* Right: emergency contact placeholder */}
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
            Coming soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoBanner;
