/* 
  This component presents a task card, which can be used to display information about a task in a card format.
  
  Props:
  - title: the title of the task
  - description: a brief description of the task
*/
import type { Task } from "../../types/task";
import { formatToTime, formatToDateTimeLocal } from "../../utils/formatters";

interface TaskCardProps {
  task: Task;

  onToggle: () => void;
  onSelect?: () => void;
}

const TaskCard = ({ task, onToggle, onSelect }: TaskCardProps) => {
  const categoryName = task.categories?.name ?? "General";

  // Format the scheduled time for display
  const displayTime = formatToTime(task.scheduledAt);
  const completedDateTimeLocal = formatToDateTimeLocal(
    task.taskLogs?.[0]?.completedAt ?? null,
  );

  const today = new Date().toDateString();
  const isCompleted =
    task.taskLogs?.some(
      (log) =>
        log.isCompleted &&
        log.completedAt != null &&
        new Date(log.completedAt).toDateString() === today,
    ) ?? false;
  const completedLog = task.taskLogs?.find(
    (log) =>
      log.isCompleted &&
      log.completedAt != null &&
      new Date(log.completedAt).toDateString() === today,
  );
  const completedAt = completedLog?.completedAt;
  const completedBy = completedLog?.caregivers
    ? `${completedLog.caregivers.firstName} ${completedLog.caregivers.lastName}`
    : undefined;

  return (
    <div
      className="mb-3"
      style={{
        borderRadius: "18px",
        border: isCompleted ? "1px solid #98d4a9" : "1px solid #e9ecef",
        backgroundColor: isCompleted ? "#f3fbf5" : "#ffffff",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onSelect) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="p-3 p-md-4 d-flex align-items-start gap-3">
        <div className="pt-1">
          <input
            aria-label={`Mark ${task.title} as done`}
            className="form-check-input"
            type="checkbox"
            name="taskCheck"
            checked={isCompleted}
            onClick={(e) => e.stopPropagation()}
            onChange={() => onToggle()}
            style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
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
                {task.title}
              </h5>
              {task.description && (
                <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                  {task.description}
                </p>
              )}
            </div>

            <div className="d-flex flex-column align-items-end gap-1">
              {task.scheduledAt && (
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
                  {displayTime}
                </span>
              )}
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: "#dde9ff",
                  color: "#2c5ce6",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  padding: "0.55rem 0.8rem",
                }}
              >
                {categoryName}
              </span>
            </div>
          </div>

          {isCompleted && (completedAt || completedBy) && (
            <div
              className="mt-3 px-3 py-2"
              style={{
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                border: "1px solid #dbe7df",
              }}
            >
              {completedAt && (
                <div
                  className="mb-1"
                  style={{ fontSize: "0.87rem", color: "#495057" }}
                >
                  <span className="fw-semibold">Completed at:</span>{" "}
                  {completedDateTimeLocal}
                </div>
              )}
              {completedBy && (
                <div style={{ fontSize: "0.87rem", color: "#495057" }}>
                  <span className="fw-semibold">By:</span> {completedBy}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
