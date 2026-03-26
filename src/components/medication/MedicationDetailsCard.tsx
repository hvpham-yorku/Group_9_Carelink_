import type { Medication } from "../../types/medication";
import { formatToTime } from "../../utils/formatters";
import Button from "../ui/Button";

interface MedicationDetailsCardProps {
  medication: Medication | null;
  onArchive?: () => void;
}

const MedicationDetailsCard = ({
  medication,
  onArchive,
}: MedicationDetailsCardProps) => {
  if (!medication) {
    return (
      <div className="text-muted">
        Select a medication from the list above to view more details.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          <p className="text-muted mb-1 small fw-semibold">Medication</p>
          <div className="fw-semibold fs-5">{medication.name}</div>
        </div>

        {onArchive && (
          <Button color="outline-danger" onClick={onArchive}>
            Archive
          </Button>
        )}
      </div>

      <div className="row g-3">
        <div className="col-6">
          <p className="text-muted mb-1 small fw-semibold">Dosage</p>
          <div>{medication.dosage || "Not available"}</div>
        </div>

        <div className="col-6">
          <p className="text-muted mb-1 small fw-semibold">Frequency</p>
          <div>{medication.frequency || "Not available"}</div>
        </div>
      </div>

      <div>
        <p className="text-muted mb-1 small fw-semibold">Scheduled Times</p>

        {medication.scheduledAt && medication.scheduledAt.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {medication.scheduledAt.map((time, index) => (
              <span
                key={index}
                className="badge rounded-pill"
                style={{
                  backgroundColor: "#f1f3f5",
                  color: "#495057",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8rem",
                }}
              >
                {formatToTime(time)}
              </span>
            ))}
          </div>
        ) : (
          <div>Not available</div>
        )}
      </div>

      <div>
        <p className="text-muted mb-1 small fw-semibold">Purpose</p>
        <div>{medication.purpose || "No purpose provided"}</div>
      </div>

      <div>
        <p className="text-muted mb-1 small fw-semibold">Instructions</p>
        <div>{medication.instructions || "No instructions provided"}</div>
      </div>

      <div>
        <p className="text-muted mb-1 small fw-semibold">Prescribed By</p>
        <div>{medication.prescribedBy || "Not available"}</div>
      </div>

      <div
        className="px-3 py-3"
        style={{
          borderRadius: "14px",
          backgroundColor: "#fff8e6",
          border: "1px solid #ffe69c",
        }}
      >
        <p
          className="mb-1"
          style={{ fontSize: "0.85rem", fontWeight: 600, color: "#997404" }}
        >
          Warnings
        </p>

        <div style={{ fontSize: "0.92rem", color: "#6c5b00" }}>
          {medication.warnings || "No warnings provided"}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsCard;
