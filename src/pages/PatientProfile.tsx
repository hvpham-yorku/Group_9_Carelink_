import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  UserRound,
  Stethoscope,
  Shield,
  Calendar,
  CheckCircle,
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
      <div className="d-flex gap-3 mb-4">
        <MapPin size={18} className="text-muted mt-1" />
        <div>
          <div className="text-muted small">Address</div>
          <div>{patient?.address || "Not Available"}</div>
        </div>
      </div>

      <div className="d-flex gap-3 mb-4">
        <Phone size={18} className="text-muted mt-1" />
        <div>
          <div className="text-muted small">Phone</div>
          <div>{patient?.phoneNumber || "Not Available"}</div>
        </div>
      </div>

      <div className="d-flex gap-3">
        <Mail size={18} className="text-muted mt-1" />
        <div>
          <div className="text-muted small">Email</div>
          <div>{patient?.email || "Not Available"}</div>
        </div>
      </div>
    </CustomSection>
  );

  const renderMedicalInfo = () => (
    <CustomSection title="Medical Information">
      <div className="mb-3">
        <div className="text-muted small">Blood Type</div>
        <div>{patient?.bloodType || "Not Available"}</div>
      </div>

      <div className="mb-3">
        <div className="text-muted small">Height</div>
        <div>{patient?.height || "Not Available"}</div>
      </div>

      <div className="mb-3">
        <div className="text-muted small">Weight</div>
        <div>{patient?.weight || "Not Available"}</div>
      </div>

      <div className="mb-3">
        <div className="text-muted small">Allergies</div>
        <div>
          {patient?.allergies?.length ? patient.allergies.join(", ") : "Not Available"}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-muted small">Mobility</div>
        <div>Not Available</div>
      </div>

      <div>
        <div className="text-muted small">Dietary Requirements</div>
        <div>Not Available</div>
      </div>
    </CustomSection>
  );

  const renderInsuranceInfo = () => (
    <CustomSection title="Insurance Information">
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-success-subtle"
          style={{ width: "44px", height: "44px" }}
        >
          <Shield size={20} className="text-success" />
        </div>

        <div className="flex-grow-1">
          <div className="mb-3">
            <div className="text-muted small">Provider</div>
            <div>{patient?.insuranceProvider || "Not Available"}</div>
          </div>

          <div className="mb-3">
            <div className="text-muted small">Policy Number</div>
            <div>{patient?.insurancePolicyNumber || "Not Available"}</div>
          </div>

          <div>
            <div className="text-muted small">Group Number</div>
            <div>Not Available</div>
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
            className="p-3 h-100"
            style={{
              border: "1px solid #f1c3c3",
              borderRadius: "12px",
              backgroundColor: "#fff8f8",
            }}
          >
            <div className="text-danger small fw-semibold mb-2">PRIMARY CONTACT</div>
            <div className="fw-semibold">
              {patient?.emergencyContactName || "Not Available"}
            </div>
            <div className="text-muted small mb-2">
              {patient?.emergencyContactRelationship || "Not Available"}
            </div>
            <div>{patient?.emergencyContactPhone || "Not Available"}</div>
            <div className="text-muted small mt-1">Not Available</div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="p-3 h-100"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="text-muted small fw-semibold mb-2">SECONDARY CONTACT</div>
            <div className="fw-semibold">Not Available</div>
            <div className="text-muted small mb-2">Not Available</div>
            <div>Not Available</div>
            <div className="text-muted small mt-1">Not Available</div>
          </div>
        </div>
      </div>
    </CustomSection>
  );

  const renderPhysicianInfo = () => (
    <CustomSection title="Primary Care Physician">
      <div className="d-flex align-items-start gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle"
          style={{ width: "44px", height: "44px" }}
        >
          <Stethoscope size={20} className="text-primary" />
        </div>

        <div className="flex-grow-1">
          <div className="fw-semibold">
            {patient?.physicianName || "Not Available"}
          </div>
          <div className="text-muted small mb-2">Not Available</div>

          <div className="d-flex flex-column flex-md-row gap-2 gap-md-4">
            <div>{patient?.physicianPhone || "Not Available"}</div>
            <div>{patient?.physicianAddress || "Not Available"}</div>
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
              className="d-flex align-items-center p-3"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                border: "1px solid #e9ecef",
              }}
            >
              <span>{condition}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted">Not Available</div>
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
          backgroundColor: "#fff3cd",
          borderRadius: "12px",
          border: "1px solid #ffe69c",
        }}
      >
        <div className="fw-semibold mb-1">Important Care Information</div>
        <div style={{ fontSize: "0.95rem" }}>
          {patient?.careNotes || "Not Available"}
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
          style={{ fontSize: "0.9rem" }}
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
            icon={<Calendar size={18} />}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Tasks Completed"
            value="—"
            description="Completed care tasks"
            icon={<CheckCircle size={18} />}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Appointments"
            value="—"
            description="Scheduled appointments"
            icon={<Calendar size={18} />}
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