import { formatToTime } from "../../utils/formatters";
import type { MedicationScheduleItemProps } from "../../types/Types";
import Button from "../ui/Button";

type Prescription = Omit<MedicationScheduleItemProps, "onToggle"> & {
  purpose?: string;
  instructions?: string;
  warnings?: string;
  prescribedBy?: string;
  startDate?: string;
};

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
    <div className="d-flex flex-column gap-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <div>
          <p
            className="text-muted mb-1"
            style={{ fontSize: "0.8rem", fontWeight: 600 }}
          >
            Medication
          </p>
          <div className="fw-semibold fs-5">{medication.name}</div>
        </div>

        {onArchive && (
          <Button color="outline-danger" onClick={onArchive}>
            Archive
          </Button>
        )}
      </div>

      {/* BASIC INFO */}
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

      {/* SCHEDULE */}
      <div>
        <p className="text-muted mb-1 small fw-semibold">Scheduled Time</p>
        <div>
          {medication.scheduledAt
            ? formatToTime(medication.scheduledAt)
            : "Not available"}
        </div>
      </div>

      {/* START DATE */}
      <div>
        <p className="text-muted mb-1 small fw-semibold">Start Date</p>
        <div>
          {medication.startDate
            ? new Date(medication.startDate).toLocaleDateString()
            : "Not available"}
        </div>
      </div>

      {/* PURPOSE */}
      <div>
        <p className="text-muted mb-1 small fw-semibold">Purpose</p>
        <div>
          {medication.purpose
            ? medication.purpose
            : "No purpose provided"}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div>
        <p className="text-muted mb-1 small fw-semibold">Instructions</p>
        <div>
          {medication.instructions
            ? medication.instructions
            : "No instructions provided"}
        </div>
      </div>

      {/* PRESCRIBED BY */}
      <div>
        <p className="text-muted mb-1 small fw-semibold">Prescribed By</p>
        <div>
          {medication.prescribedBy
            ? medication.prescribedBy
            : "Not available"}
        </div>
      </div>

      {/* WARNINGS */}
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
          {medication.warnings
            ? medication.warnings
            : "No warnings provided"}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsCard;