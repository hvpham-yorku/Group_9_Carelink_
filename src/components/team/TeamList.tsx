import type { CaregiverInfo } from "../../types/Types";

interface TeamListProps {
  caregivers: CaregiverInfo[];
}

const TeamList = ({ caregivers }: TeamListProps) => {
  if (caregivers.length === 0) {
    return <p className="mb-0 text-muted">No team members assigned yet.</p>;
  }

  return (
    <ul className="list-group list-group-flush">
      {caregivers.map((caregiver) => (
        <li key={caregiver.caregiverId} className="list-group-item px-0">
          <h6 className="mb-1">
            {caregiver.firstName} {caregiver.lastName}
          </h6>
          <p className="mb-1 text-muted">{caregiver.jobTitle}</p>
          <p className="mb-0 text-muted">
            {caregiver.phone} | {caregiver.email}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default TeamList;
