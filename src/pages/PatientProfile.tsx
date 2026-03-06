import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
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
              <h3 className="fw-semibold mb-3">Patient Profile</h3>
              <p className="text-muted mb-0">
                Additional patient details will be added in the next section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;