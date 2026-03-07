import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  UserRound,
  Stethoscope,
} from "lucide-react";
import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import type { PatientInfo } from "../types/Types";
import { usePatient } from "../contexts/patient/usePatient";
import { patientService } from "../services/patientService";

const PatientProfile = () => {
  const { selectedPatientId } = usePatient();

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
      <PatientInfoBanner patient={patient} />

      <div className="row g-4">
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "18px" }}
          >
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4">Contact Information</h3>

              <div className="d-flex gap-3 mb-4">
                <MapPin size={18} className="text-muted mt-1" />
                <div>
                  <div className="text-muted small">Address</div>
                  <div>{patient.address || "—"}</div>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <Phone size={18} className="text-muted mt-1" />
                <div>
                  <div className="text-muted small">Phone</div>
                  <div>{patient.phoneNumber || "—"}</div>
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
        </div>

        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "18px" }}
          >
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4">Medical Information</h3>

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

                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="badge rounded-pill text-bg-danger"
                      >
                        <AlertCircle size={14} className="me-1" />
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">No allergies listed</div>
                )}
              </div>
            </div>
          </div>

          <div
            className="card border-0 shadow-sm mt-4"
            style={{ borderRadius: "18px" }}
          >
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4">Emergency Contact</h3>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-danger-subtle"
                  style={{ width: "44px", height: "44px" }}
                >
                  <UserRound size={20} className="text-danger" />
                </div>

                <div className="flex-grow-1">
                  <div className="mb-3">
                    <div className="text-muted small">Name</div>
                    <div>{patient.emergencyContactName || "Not Available"}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-muted small">Relationship</div>
                    <div>
                      {patient.emergencyContactRelationship || "Not Available"}
                    </div>
                  </div>

                  <div>
                    <div className="text-muted small">Phone</div>
                    <div>{patient.emergencyContactPhone || "Not Available"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card border-0 shadow-sm mt-4"
            style={{ borderRadius: "18px" }}
          >
            <div className="card-body p-4">
              <h3 className="fw-semibold mb-4">Primary Physician</h3>

              <div className="d-flex align-items-start gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle"
                  style={{ width: "44px", height: "44px" }}
                >
                  <Stethoscope size={20} className="text-primary" />
                </div>

                <div className="flex-grow-1">
                  <div className="mb-3">
                    <div className="text-muted small">Name</div>
                    <div>{patient.physicianName || "Not Available"}</div>
                  </div>

                  <div className="mb-3">
                    <div className="text-muted small">Phone</div>
                    <div>{patient.physicianPhone || "Not Available"}</div>
                  </div>

                  <div>
                    <div className="text-muted small">Address</div>
                    <div>{patient.physicianAddress || "Not Available"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default PatientProfile;