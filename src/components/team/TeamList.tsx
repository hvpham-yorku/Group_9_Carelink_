import type { CaregiverInfo } from "../../types/teams";

interface TeamListProps {
  caregivers: CaregiverInfo[];
}

const TeamList = ({ caregivers }: TeamListProps) => {
  if (caregivers.length === 0) {
    return <p className="mb-0 text-muted">No team members assigned yet.</p>;
  }

  return (
    <div className="d-flex flex-column gap-2">
      {caregivers.map((caregiver) => (
        <div
          key={caregiver.caregiverId}
          className="d-flex align-items-center gap-3 p-2 rounded border bg-white"
        >
          <div className="flex-grow-1 min-width-0">
            <div className="fw-semibold text-truncate">
              {caregiver.firstName} {caregiver.lastName}
            </div>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {caregiver.teamRole && (
                <span className="badge text-bg-light border">
                  {caregiver.teamRole}
                </span>
              )}
              {caregiver.jobTitle && (
                <span className="badge text-bg-light border">
                  {caregiver.jobTitle}
                </span>
              )}
              {caregiver.email && (
                <span className="badge text-bg-light border">
                  {caregiver.email}
                </span>
              )}
              {caregiver.teamDateAssigned && (
                <span className="badge text-bg-light border">
                  Since: {caregiver.teamDateAssigned}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
