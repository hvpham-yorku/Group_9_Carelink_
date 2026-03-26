import { useEffect, useState } from "react";
import Button from "../ui/Button";

interface MedicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    dosage: string;
    frequency: string;
    scheduledAt: string[];
    purpose: string;
    instructions: string;
    prescribedBy: string;
    warnings: string;
  }) => void;
  initialData?: {
    name?: string | null;
    dosage?: string | null;
    frequency?: string | null;
    scheduledAt?: string[];
    purpose?: string | null;
    instructions?: string | null;
    prescribedBy?: string | null;
    warnings?: string | null;
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
  const [scheduledAt, setScheduledAt] = useState<string[]>(["08:00"]);

  const [purpose, setPurpose] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prescribedBy, setPrescribedBy] = useState("");
  const [warnings, setWarnings] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name ?? "");
      setDosage(initialData?.dosage ?? "");
      setFrequency(initialData?.frequency ?? "");
      setScheduledAt(
        Array.isArray(initialData?.scheduledAt)
          ? initialData.scheduledAt
          : initialData?.scheduledAt
            ? [initialData.scheduledAt]
            : ["08:00"],
      );

      setPurpose(initialData?.purpose ?? "");
      setInstructions(initialData?.instructions ?? "");
      setPrescribedBy(initialData?.prescribedBy ?? "");
      setWarnings(initialData?.warnings ?? "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      name,
      dosage,
      frequency,
      scheduledAt,
      purpose,
      instructions,
      prescribedBy,
      warnings,
    });
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: "18px" }}>
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData ? "Edit Medication" : "Add Medication"}
            </h5>

            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body d-flex flex-column gap-4">
            {/* BASIC */}
            <div>
              <label className="form-label">Medication Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="col">
                <label className="form-label">Dosage</label>
                <input
                  className="form-control"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div className="col">
                <label className="form-label">Frequency</label>
                <input
                  className="form-control"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                />
              </div>
            </div>

            {/* MULTIPLE TIMES */}
            <div>
              <label className="form-label">Scheduled Times</label>

              <div className="d-flex flex-column gap-2">
                {scheduledAt.map((time, index) => (
                  <input
                    key={index}
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={(e) => {
                      const times = [...scheduledAt];
                      times[index] = e.target.value;
                      setScheduledAt(times);
                    }}
                  />
                ))}

                <Button
                  color="outline-primary"
                  onClick={() => setScheduledAt([...scheduledAt, "08:00"])}
                >
                  + Add Time
                </Button>
              </div>
            </div>

            {/* DETAILS */}
            <div>
              <label className="form-label">Purpose</label>
              <textarea
                className="form-control"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Instructions</label>
              <textarea
                className="form-control"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Prescribed By</label>
              <input
                className="form-control"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Warnings</label>
              <textarea
                className="form-control"
                value={warnings}
                onChange={(e) => setWarnings(e.target.value)}
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
