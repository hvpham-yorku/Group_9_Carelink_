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
    <ul className="list-group list-group-flush">
      {patients.map((patient) => (
        <li key={patient.patientId} className="list-group-item px-0">
          <h6 className="mb-1">
            {patient.firstName} {patient.lastName}
          </h6>
          <p className="mb-1 text-muted">{patient.gender}</p>
          <p className="mb-1 text-muted">Dob: {patient.dob}</p>
        </li>
      ))}
    </ul>
  );
};

export default PatientList;
