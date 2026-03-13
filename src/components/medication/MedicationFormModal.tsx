import { useState } from "react";
import Button from "../ui/Button";

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    dosage: string;
    frequency: string;
    scheduledAt: string;
  }) => void;

  initialData?: {
    name: string;
    dosage: string;
    frequency: string;
    scheduledAt: string;
  };
}

const MedicationFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: MedicationFormModalProps) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const [dosage, setDosage] = useState(initialData?.dosage ?? "");
  const [frequency, setFrequency] = useState(initialData?.frequency ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    initialData?.scheduledAt ?? "",
  );

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      name,
      dosage,
      frequency,
      scheduledAt,
    });

    onClose();
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Medication" : "Add Medication"}
            </h5>
          </div>

          <div className="modal-body d-flex flex-column gap-3">

            <div>
              <label className="form-label">Medication Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Dosage</label>
              <input
                className="form-control"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Frequency</label>
              <input
                className="form-control"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Scheduled Time</label>
              <input
                type="time"
                className="form-control"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <Button color="outline-secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button color="primary" onClick={handleSubmit}>
              Save Medication
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicationFormModal;