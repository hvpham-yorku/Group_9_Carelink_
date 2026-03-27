import type { Medication } from "../../types/medication";
import Button from "../ui/Button";

interface ArchivedMedicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
}

const ArchivedMedicationsModal = ({
  isOpen,
  onClose,
  medications,
}: ArchivedMedicationsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: "18px" }}>
          <div className="modal-header">
            <h5 className="modal-title">Archived Medications</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {medications.length === 0 ? (
              <div className="text-muted">No archived medications found.</div>
            ) : (
              <div
                className="d-flex flex-column gap-3"
                style={{ maxHeight: "420px", overflowY: "auto" }}
              >
                {medications.map((med) => (
                  <div
                    key={med.medicationId}
                    style={{
                      borderRadius: "16px",
                      border: "1px solid #e9ecef",
                      padding: "1rem",
                      background: "#fff",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div>
                        <div className="fw-semibold text-dark mb-1">
                          {med.name}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.92rem" }}
                        >
                          {med.dosage} • {med.frequency || "Not available"}
                        </div>
                      </div>

                      <span className="badge text-bg-secondary rounded-pill">
                        Archived
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <Button color="outline-secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedMedicationsModal;
