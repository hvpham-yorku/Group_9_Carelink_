import type { Medication } from "../../types/medication";
import { formatToTime, formatToDateTimeLocal } from "../../utils/formatters";

interface MedicationScheduleItemProps extends Medication {
  scheduledTime: string;
  onToggle: (
    medicationId: string,
    scheduledTime: string,
    isCompleted: boolean,
  ) => void;
}

const buildTodayTime = (time: string): Date | null => {
  if (!time) return null;

  const normalizedTime =
    /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time;

  if (/^\d{2}:\d{2}:\d{2}$/.test(normalizedTime)) {
    const now = new Date();
    const [hours, minutes, seconds] = normalizedTime.split(":").map(Number);

    const scheduledDate = new Date(now);
    scheduledDate.setHours(hours, minutes, seconds, 0);
    return scheduledDate;
  }

  const parsedDate = new Date(time);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const MedicationScheduleItem = ({
  name,
  dosage,
  frequency,
  medicationLog,
  onToggle,
  medicationId,
  scheduledTime,
}: MedicationScheduleItemProps) => {
  const isCompleted = medicationLog?.isCompleted ?? false;
  const takenAt = medicationLog?.takenAt ?? null;
  const takenBy = medicationLog
    ? `${medicationLog.firstName} ${medicationLog.lastName}`
    : null;

  const scheduledDate = buildTodayTime(scheduledTime);

  const hasValidScheduledDate =
    scheduledDate instanceof Date && !Number.isNaN(scheduledDate.getTime());

  const now = new Date();
  const isOverdue =
    !isCompleted && hasValidScheduledDate ? scheduledDate < now : false;

  const statusLabel = isCompleted ? "Taken" : isOverdue ? "Overdue" : "Pending";

  const statusStyles = isCompleted
    ? {
        border: "1px solid #98d4a9",
        backgroundColor: "#f3fbf5",
        badgeBackground: "#d1e7dd",
        badgeColor: "#146c43",
      }
    : isOverdue
      ? {
          border: "1px solid #f5c2c7",
          backgroundColor: "#fff5f5",
          badgeBackground: "#f8d7da",
          badgeColor: "#b02a37",
        }
      : {
          border: "1px solid #e9ecef",
          backgroundColor: "#ffffff",
          badgeBackground: "#f1f3f5",
          badgeColor: "#495057",
        };

  return (
    <div
      className="mb-3"
      style={{
        borderRadius: "18px",
        border: statusStyles.border,
        backgroundColor: statusStyles.backgroundColor,
        transition: "all 0.2s ease",
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
      }}
    >
      <div className="p-3 p-md-4 d-flex align-items-start gap-3">
        <div className="pt-1">
          <input
            aria-label={`Mark ${name} as taken`}
            className="form-check-input"
            type="checkbox"
            checked={isCompleted}
            onChange={() =>
              onToggle(medicationId ?? "", scheduledTime, isCompleted)
            }
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
                {frequency || "No frequency provided"}
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: statusStyles.badgeBackground,
                  color: statusStyles.badgeColor,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  padding: "0.55rem 0.8rem",
                }}
              >
                {statusLabel}
              </span>

              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "#3b5bdb",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  padding: "0.55rem 0.8rem",
                }}
              >
                {scheduledTime ? formatToTime(scheduledTime) : "No time"}
              </span>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-muted" style={{ fontSize: "0.92rem" }}>
              {isCompleted
                ? "Completed for today"
                : isOverdue
                  ? "This medication is overdue"
                  : "Scheduled for today"}
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