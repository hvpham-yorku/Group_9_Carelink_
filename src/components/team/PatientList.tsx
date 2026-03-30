import type { PatientInfo } from "../../types/teams";

interface PatientListProps {
  patients: PatientInfo[];
}

const PatientList = ({ patients }: PatientListProps) => {
  if (patients.length === 0) {
    return (
      <p className="mb-0 text-muted">No patients are assigned to this team.</p>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">
      {patients.map((patient) => (
        <div
          key={patient.patientId}
          className="d-flex align-items-center gap-3 p-2 rounded border bg-white"
        >
          {/* Info */}
          <div className="flex-grow-1 min-width-0">
            <div className="fw-semibold text-truncate">
              {patient.firstName} {patient.lastName}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {patient.gender && (
                <span className="badge text-bg-light border">
                  {patient.gender}
                </span>
              )}
              {patient.dob && (
                <span className="badge text-bg-light border">
                  DOB: {patient.dob}
                </span>
              )}
              {patient.bloodType && (
                <span className="badge text-bg-danger bg-opacity-10 border border-danger-subtle text-danger">
                  {patient.bloodType}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
