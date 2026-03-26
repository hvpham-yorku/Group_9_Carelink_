import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  HeartPulse,
  Stethoscope,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  UserRound,
} from "lucide-react";
import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import type { PatientInfo } from "../types/Types";
import { usePatient } from "../contexts/patient/usePatient";
import { patientService } from "../services/patientService";

const PatientProfile = () => {
  const { selectedPatientId } = usePatient();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPatientId) {
      setPatient(null);
      return;
    }

    const fetchPatient = async () => {
      setLoading(true);
      try {
        const data = await patientService.getFullProfile(selectedPatientId);
        setPatient(data as PatientInfo);
      } catch (err) {
        console.error("Failed to load patient profile:", err);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [selectedPatientId]);

  const renderContactInfo = () => (
    <CustomSection title="Contact Information">
      <div className="d-flex flex-column gap-4">
        <div className="d-flex gap-3">
          <MapPin size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "2px" }}>
              Address
            </div>
            <div style={{ color: "#111827", fontSize: "0.95rem" }}>
              {patient?.address || "Not Available"}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3">
          <Phone size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "2px" }}>
              Phone
            </div>
            <div style={{ color: "#111827", fontSize: "0.95rem" }}>
              {patient?.phoneNumber || "Not Available"}
            </div>
          </div>
        </div>

        <div className="d-flex gap-3">
          <Mail size={16} style={{ color: "#9ca3af", marginTop: "4px" }} />
          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "2px" }}>
              Email
            </div>
            <div style={{ color: "#111827", fontSize: "0.95rem" }}>
              {patient?.email || "Not Available"}
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderMedicalInfo = () => (
    <CustomSection title="Medical Information">
      <div className="d-flex flex-column gap-3">
        <div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Blood Type</div>
          <div style={{ color: "#111827" }}>{patient?.bloodType || "Not Available"}</div>
        </div>

        <div className="row g-3">
          <div className="col-6">
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Height</div>
            <div style={{ color: "#111827" }}>{patient?.height || "Not Available"}</div>
          </div>

          <div className="col-6">
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Weight</div>
            <div style={{ color: "#111827" }}>{patient?.weight || "Not Available"}</div>
          </div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "6px" }}>
            Allergies
          </div>

          {patient?.allergies?.length ? (
            <div className="d-flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="d-inline-flex align-items-center gap-1"
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    borderRadius: "999px",
                    padding: "4px 10px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  <AlertCircle size={12} />
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ color: "#111827" }}>Not Available</div>
          )}
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Mobility</div>
          <div style={{ color: "#111827" }}>Not Available</div>
        </div>

        <div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
            Dietary Requirements
          </div>
          <div style={{ color: "#111827" }}>Not Available</div>
        </div>
      </div>
    </CustomSection>
  );

  const renderInsuranceInfo = () => (
    <CustomSection title="Insurance Information">
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            backgroundColor: "#eef6ff",
          }}
        >
          <Shield size={18} color="#2563eb" />
        </div>

        <div className="flex-grow-1 d-flex flex-column gap-3">
          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Provider</div>
            <div style={{ color: "#111827" }}>
              {patient?.insuranceProvider || "Not Available"}
            </div>
          </div>

          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Policy Number</div>
            <div style={{ color: "#111827" }}>
              {patient?.insurancePolicyNumber || "Not Available"}
            </div>
          </div>

          <div>
            <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Group Number</div>
            <div style={{ color: "#111827" }}>Not Available</div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderEmergencyContact = () => (
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
                  {patient?.emergencyContactName || "Not Available"}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                  {patient?.emergencyContactRelationship || "Not Available"}
                </div>
              </div>
            </div>

            <div style={{ color: "#111827", fontSize: "0.92rem" }}>
              {patient?.emergencyContactPhone || "Not Available"}
            </div>

            <div style={{ color: "#9ca3af", fontSize: "0.82rem", marginTop: "4px" }}>
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
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Not Available</div>
            <div style={{ color: "#111827", fontSize: "0.92rem", marginTop: "8px" }}>
              Not Available
            </div>
            <div style={{ color: "#9ca3af", fontSize: "0.82rem", marginTop: "4px" }}>
              Not Available
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderPhysicianInfo = () => (
    <CustomSection title="Primary Care Physician">
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            backgroundColor: "#eef4ff",
          }}
        >
          <Stethoscope size={18} color="#3b82f6" />
        </div>

        <div className="flex-grow-1">
          <div className="fw-semibold" style={{ color: "#111827" }}>
            {patient?.physicianName || "Not Available"}
          </div>

          <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "10px" }}>
            Not Available
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <Phone size={14} color="#9ca3af" />
                <span style={{ color: "#111827", fontSize: "0.92rem" }}>
                  {patient?.physicianPhone || "Not Available"}
                </span>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={14} color="#9ca3af" />
                <span style={{ color: "#111827", fontSize: "0.92rem" }}>
                  {patient?.physicianAddress || "Not Available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderMedicalConditions = () => (
    <CustomSection title="Medical Conditions">
      {patient?.conditions?.length ? (
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

              <span style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 500 }}>
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

  const renderCareNotes = () => (
    <CustomSection
      title="Care Notes & Preferences"
      rightAction={
        <Button color="outline-primary" onClick={() => navigate("/notes")}>
          View Notes
        </Button>
      }
    >
      <div
        className="p-3"
        style={{
          backgroundColor: "#fffbea",
          borderRadius: "12px",
          border: "1px solid #fde68a",
        }}
      >
        <div className="d-flex align-items-start gap-2">
          <ClipboardList size={16} color="#ca8a04" style={{ marginTop: "2px" }} />
          <div>
            <div
              className="fw-semibold mb-1"
              style={{ color: "#92400e", fontSize: "0.9rem" }}
            >
              Important Care Information
            </div>
            <div style={{ fontSize: "0.93rem", color: "#4b5563", lineHeight: 1.6 }}>
              {patient?.careNotes || "Not Available"}
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderCareHistorySummary = () => (
    <CustomSection
      title="Care History Summary"
      rightAction={
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none"
          style={{ fontSize: "0.88rem", color: "#2563eb" }}
        >
          View Full History →
        </button>
      }
    >
      <div className="row g-3">
        <div className="col-md-4">
          <StatCard
            title="Care Days"
            value="—"
            description="Total care days"
            icon={<Calendar size={16} color="#2563eb" />}
            backgroundColor="#e0ecff"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Tasks Completed"
            value="—"
            description="Completed care tasks"
            icon={<CheckCircle size={16} color="#16a34a" />}
            backgroundColor="#dcfce7"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Appointments"
            value="—"
            description="Scheduled appointments"
            icon={<Calendar size={16} color="#9333ea" />}
            backgroundColor="#f3e8ff"
          />
        </div>
      </div>
    </CustomSection>
  );

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <span className="spinner-border spinner-border-sm me-2" />
        Loading patient profile...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container py-4 text-center text-muted">
        No patient selected.
      </div>
    );
  }

  return (
    <div className="container py-4">
      <CustomTitleBanner
        title="Patient Profile"
        subheader="View and manage patient details"
      />

      <div className="mb-4">
        <PatientInfoBanner patient={patient} />
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          {renderContactInfo()}
          {renderMedicalInfo()}
          {renderInsuranceInfo()}
        </div>

        <div className="col-lg-8">
          {renderEmergencyContact()}
          {renderPhysicianInfo()}
          {renderMedicalConditions()}
          {renderCareNotes()}
          {renderCareHistorySummary()}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;