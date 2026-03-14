import { useEffect, useState } from "react";
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
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? "");
      setDosage(initialData?.dosage ?? "");
      setFrequency(initialData?.frequency ?? "");

      if (initialData?.scheduledAt) {
        const date = new Date(initialData.scheduledAt);
        if (!Number.isNaN(date.getTime())) {
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          setScheduledAt(`${hours}:${minutes}`);
        } else {
          setScheduledAt("");
        }
      } else {
        setScheduledAt("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isFormValid = name.trim() !== "" && dosage.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;

    onSave({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      scheduledAt,
    });
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          style={{ borderRadius: "18px", overflow: "hidden" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Medication" : "Add Medication"}
            </h5>

            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body d-flex flex-column gap-3">
            <div>
              <label className="form-label">Medication Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter medication name"
              />
            </div>

            <div>
              <label className="form-label">Dosage</label>
              <input
                className="form-control"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Example: 500mg"
              />
            </div>

            <div>
              <label className="form-label">Frequency</label>
              <input
                className="form-control"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="Example: Twice daily"
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

            <Button
              color="primary"
              onClick={handleSubmit}
            >
              Save Medication
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationFormModal;