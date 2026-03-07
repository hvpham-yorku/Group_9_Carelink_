import type { PatientInfo } from "../../types/Types";

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
    <ul className="list-group list-group-flush">
      {patients.map((patient) => (
        <li key={patient.patientId} className="list-group-item px-0">
          <h6 className="mb-1">
            {patient.firstName} {patient.lastName}
          </h6>
          <p className="mb-1 text-muted">Date of Birth: {patient.dob}</p>
          <p className="mb-1 text-muted">{patient.phone}</p>
          <p className="mb-0 text-muted">{patient.address}</p>
        </li>
      ))}
    </ul>
  );
};

export default PatientList;
