import { useState } from "react";

interface JoinTeamFormProps {
  onJoinTeam: (joinCode: string) => void;
}

const JoinTeamForm = ({ onJoinTeam }: JoinTeamFormProps) => {
  const [joinCode, setJoinCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinTeam(joinCode);
    setJoinCode("");
  };

  return (
    <>
      <form className="input-group mb-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="joinCode"
          className="form-control"
          placeholder="Enter team code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Join
        </button>
      </form>
    </>
  );
};

export default JoinTeamForm;
