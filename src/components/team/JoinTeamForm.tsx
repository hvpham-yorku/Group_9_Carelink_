import { useState } from "react";

interface JoinTeamFormProps {
  modalId: string;
  onJoinTeam: (joinCode: string) => void | Promise<void>;
  error?: string | null;
}

const JoinTeamForm = ({ modalId, onJoinTeam, error }: JoinTeamFormProps) => {
  const [joinCode, setJoinCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void onJoinTeam(joinCode);
    setJoinCode("");
  };

  return (
    <div className="modal fade" id={modalId}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
              Join a Team
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column gap-3">
              {error && <div className="alert alert-danger mb-0">{error}</div>}
              <div>
                <label htmlFor={`${modalId}Code`} className="form-label">
                  Team Code:
                </label>
                <input
                  id={`${modalId}Code`}
                  type="text"
                  name="joinCode"
                  className="form-control"
                  placeholder="Enter team code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Join
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinTeamForm;
