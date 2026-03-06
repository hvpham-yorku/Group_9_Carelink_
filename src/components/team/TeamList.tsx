import type { CaregiverInfo } from "../../types/Types";

interface TeamListProps {
  members: CaregiverInfo[];
}

const TeamList = ({ members }: TeamListProps) => {
  if (members.length === 0) {
    return <p className="mb-0 text-muted">No team members assigned yet.</p>;
  }

  return (
    <ul className="list-group list-group-flush">
      {members.map((member) => (
        <li key={member.id} className="list-group-item px-0">
          <h6 className="mb-1">
            {member.firstName} {member.lastName}
          </h6>
          <p className="mb-1 text-muted">{member.jobTitle}</p>
          <p className="mb-0 text-muted">
            {member.phone} | {member.email}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default TeamList;
