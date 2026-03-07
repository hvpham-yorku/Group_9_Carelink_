import type { MedicationScheduleItemProps } from "../../types/Types";
import { formatToTime, formatToDateTimeLocal } from "../../utils/formatters";

const MedicationScheduleItem = ({
  name,
  dosage,
  frequency,
  scheduledAt,
  medicationLog,
  onToggle,
  prescriptionId,
}: MedicationScheduleItemProps) => {
  const isCompleted = medicationLog?.isCompleted ?? false;
  const takenAt = medicationLog?.takenAt ?? null;
  const takenBy = medicationLog
    ? `${medicationLog.firstName} ${medicationLog.lastName}`
    : null;

  return (
    <div
      className={`card mb-3 ${
        isCompleted ? "bg-success-subtle border-success" : ""
      }`}
    >
      <div className="card-body d-flex align-items-center">
        <div className="form-check me-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(prescriptionId, isCompleted)}
          />
        </div>

        <div className="flex-grow-1">
          <h5
            className={`card-title ${
              isCompleted ? "text-decoration-line-through text-muted" : ""
            }`}
          >
            {name} &mdash; {dosage}
          </h5>
          <p className="card-text text-muted mb-1">
            {frequency} &middot; Scheduled: {formatToTime(scheduledAt)}
          </p>

          {isCompleted && (takenAt || takenBy) && (
            <div className="small text-success-emphasis mt-1">
              {takenAt && <div>Taken at: {formatToDateTimeLocal(takenAt)}</div>}
              {takenBy && <div>By: {takenBy}</div>}
            </div>
          )}
        </div>

        <div className="text-end">
          <span className="badge text-bg-primary">
            {formatToTime(scheduledAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicationScheduleItem;
