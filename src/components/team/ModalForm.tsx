import { useState } from "react";

interface ModalFormProps {
  modalId: string;
  entityType: "caregiver" | "patient";
  onSubmitId: (id: string) => void | Promise<void>;
}

const ModalForm = ({ modalId, entityType, onSubmitId }: ModalFormProps) => {
  const [entityId, setEntityId] = useState("");

  const isCaregiver = entityType === "caregiver";
  const title = isCaregiver ? "Add Caregiver" : "Add Patient";
  const idLabel = isCaregiver ? "Caregiver ID" : "Patient ID";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedId = entityId.trim();
    if (!trimmedId) {
      return;
    }

    void onSubmitId(trimmedId);
    setEntityId("");
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id={`${modalId}Label`}>
              {title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <label htmlFor={`${modalId}Input`} className="form-label">
                {idLabel}
              </label>
              <input
                id={`${modalId}Input`}
                type="text"
                className="form-control"
                value={entityId}
                onChange={(event) => setEntityId(event.target.value)}
                placeholder={`Enter ${idLabel.toLowerCase()}`}
                required
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalForm;
