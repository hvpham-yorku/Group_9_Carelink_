import type { CaregiverInfo } from "../../types/teams";

interface TeamListProps {
  caregivers: CaregiverInfo[];
}

const TeamList = ({ caregivers }: TeamListProps) => {
  if (caregivers.length === 0) {
    return <p className="mb-0 text-muted">No team members assigned yet.</p>;
  }

  return (
    <ul className="list-group list-group-flush">
      {caregivers.map((caregivers) => (
        <li key={caregivers.caregiverId} className="list-group-item py-2">
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div>
              <div className="fw-semibold">
                {caregivers.firstName} {caregivers.lastName}
              </div>
              <small className="text-muted">
                {caregivers.teamRole} • {caregivers.jobTitle}
              </small>
            </div>

            <div className="text-end">
              <div className="small">{caregivers.email}</div>
              <small className="text-muted">
                {caregivers.teamDateAssigned}
              </small>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TeamList;
