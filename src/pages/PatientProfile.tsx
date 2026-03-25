import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  UserRound,
  Stethoscope,
  Shield,
  FileText,
  Calendar,
  CheckCircle,
} from "lucide-react";

import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
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
        {/* LEFT COLUMN */}
        <div className="col-lg-4">
          {/* Contact */}
          <div className="card border-0 shadow" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4 text-dark">
                Contact Information
              </h3>

              <div className="d-flex gap-3 mb-4">
                <MapPin size={18} className="text-muted mt-1" />
                <div>
                  <div className="text-muted small">Address</div>
                  <div>{patient.address || "Not Available"}</div>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <Phone size={18} className="text-muted mt-1" />
                <div>
                  <div className="text-muted small">Phone</div>
                  <div>{patient.phoneNumber || "Not Available"}</div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <Mail size={18} className="text-muted mt-1" />
                <div>
                  <div className="text-muted small">Email</div>
                  <div>{patient.email || "Not Available"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div
            className="card border-0 shadow mt-4"
            style={{ borderRadius: "18px" }}
          >
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4 text-dark">Insurance</h3>

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
                    <div>{patient.insuranceProvider || "Not Available"}</div>
                  </div>

                  <div>
                    <div className="text-muted small">Policy Number</div>
                    <div>{patient.insurancePolicyNumber || "Not Available"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-8">
          {/* Medical */}
          <div className="card border-0 shadow" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4 text-dark">
                Medical Information
              </h3>

              <div className="mb-3">
                <div className="text-muted small">Blood Type</div>
                <div>{patient.bloodType || "Not Available"}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">Height</div>
                <div>{patient.height || "Not Available"}</div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">Weight</div>
                <div>{patient.weight || "Not Available"}</div>
              </div>

              <div>
                <div className="text-muted small mb-2">Allergies</div>

                {patient.allergies?.length ? (
                  <div className="d-flex flex-wrap gap-2">
                    {patient.allergies.map((a, i) => (
                      <span key={i} className="badge rounded-pill text-bg-danger">
                        <AlertCircle size={14} className="me-1" />
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">Not Available</div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency */}
          <div className="card border-0 shadow mt-4" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4 text-dark">Emergency Contact</h3>

              <div className="d-flex gap-3">
                <UserRound size={20} className="text-danger" />
                <div>
                  <div>{patient.emergencyContactName || "Not Available"}</div>
                  <div className="text-muted small">
                    {patient.emergencyContactRelationship || "—"}
                  </div>
                  <div>{patient.emergencyContactPhone || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Physician */}
          <div className="card border-0 shadow mt-4" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4 text-dark">Primary Physician</h3>

              <div className="d-flex gap-3">
                <Stethoscope size={20} className="text-primary" />
                <div>
                  <div>{patient.physicianName || "Not Available"}</div>
                  <div className="text-muted small">
                    {patient.physicianPhone || "—"}
                  </div>
                  <div>{patient.physicianAddress || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card border-0 shadow mt-4" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-4">
                <h3 className="fw-semibold">Care Notes</h3>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/notes")}
                >
                  View Notes
                </button>
              </div>

              <div>{patient.careNotes || "Not Available"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="fw-semibold mb-3">Care History Summary</h3>

        <div className="row g-3">
          <div className="col-md-4">
            <StatCard
              title="Care Days"
              value="—"
              description="Total days under care"
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
      </div>
    </div>
  );
};

export default PatientProfile;