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
      className="mb-3"
      style={{
        borderRadius: "18px",
        border: isCompleted ? "1px solid #98d4a9" : "1px solid #e9ecef",
        backgroundColor: isCompleted ? "#f3fbf5" : "#ffffff",
        transition: "all 0.2s ease",
      }}
    >
      <div className="p-3 p-md-4 d-flex align-items-start gap-3">
        <div className="pt-1">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(prescriptionId, isCompleted)}
            style={{
              width: "1.2rem",
              height: "1.2rem",
              cursor: "pointer",
            }}
          />
        </div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div>
              <h5
                className={`mb-1 fw-semibold ${
                  isCompleted ? "text-muted text-decoration-line-through" : ""
                }`}
              >
                {name} ({dosage})
              </h5>

              <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                {frequency}
              </p>
            </div>

            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: isCompleted ? "#d1e7dd" : "#f1f3f5",
                color: isCompleted ? "#146c43" : "#495057",
                fontWeight: 600,
                fontSize: "0.8rem",
                padding: "0.55rem 0.8rem",
              }}
            >
              {formatToTime(scheduledAt)}
            </span>
          </div>

          <div className="mb-2">
            <span className="text-muted" style={{ fontSize: "0.92rem" }}>
              Scheduled: {formatToTime(scheduledAt)}
            </span>
          </div>

          {isCompleted && (takenAt || takenBy) && (
            <div
              className="mt-3 px-3 py-2"
              style={{
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                border: "1px solid #dbe7df",
              }}
            >
              {takenAt && (
                <div
                  className="mb-1"
                  style={{ fontSize: "0.87rem", color: "#495057" }}
                >
                  <span className="fw-semibold">Taken at:</span>{" "}
                  {formatToDateTimeLocal(takenAt)}
                </div>
              )}

              {takenBy && (
                <div style={{ fontSize: "0.87rem", color: "#495057" }}>
                  <span className="fw-semibold">By:</span> {takenBy}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationScheduleItem;