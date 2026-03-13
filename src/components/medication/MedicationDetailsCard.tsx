import { formatToTime } from "../../utils/formatters";
import type { MedicationScheduleItemProps } from "../../types/Types";
import Button from "../ui/Button";

type Prescription = Omit<MedicationScheduleItemProps, "onToggle">;

interface MedicationDetailsCardProps {
  medication: Prescription | null;
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
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          <p
            className="text-muted mb-1"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            Medication
          </p>
          <div className="fw-semibold">{medication.name}</div>
        </div>

        {onArchive && (
          <Button color="outline-danger" onClick={onArchive}>
            Archive
          </Button>
        )}
      </div>

      <div className="row g-3">
        <div className="col-6">
          <p
            className="text-muted mb-1"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            Dosage
          </p>
          <div>{medication.dosage || "Not available"}</div>
        </div>

        <div className="col-6">
          <p
            className="text-muted mb-1"
            style={{ fontSize: "0.82rem", fontWeight: 600 }}
          >
            Frequency
          </p>
          <div>{medication.frequency || "Not available"}</div>
        </div>
      </div>

      <div>
        <p
          className="text-muted mb-1"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          Scheduled Time
        </p>
        <div>
          {medication.scheduledAt
            ? formatToTime(medication.scheduledAt)
            : "Not available"}
        </div>
      </div>

      <div>
        <p
          className="text-muted mb-1"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          Purpose
        </p>
        <div className="text-muted">Not available</div>
      </div>

      <div>
        <p
          className="text-muted mb-1"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          Instructions
        </p>
        <div className="text-muted">Not available</div>
      </div>

      <div>
        <p
          className="text-muted mb-1"
          style={{ fontSize: "0.82rem", fontWeight: 600 }}
        >
          Prescribed By
        </p>
        <div className="text-muted">Not available</div>
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
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#997404",
          }}
        >
          Warnings
        </p>

        <div style={{ fontSize: "0.92rem", color: "#6c5b00" }}>
          None listed
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsCard;
