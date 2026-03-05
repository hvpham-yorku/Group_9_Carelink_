/* 
  This component presents a task card, which can be used to display information about a task in a card format.
  
  Props:
  - title: the title of the task
  - description: a brief description of the task

  Syntax:
  <TaskCard title description category time completed onToggle />
*/
import type { Task } from "../../types/Types";
import { formatToTime } from "../../utils/formatters";

interface TaskCardProps {
  task: Task;

  onToggle: () => void;
  onSelect?: () => void;
}

const TaskCard = ({ task, onToggle, onSelect }: TaskCardProps) => {
  const categoryName = task.categories?.name ?? "General";
  const displayTime = formatToTime(task.scheduledAt);

  const isCompleted = (task.taskLogs?.length ?? 0) > 0;
  const completedAt = task.taskLogs?.[0]?.completedAt;
  const completedBy = task.taskLogs?.[0]?.caregivers?.firstName;

  return (
    <>
      <div
        className={`card mb-3 ${
          isCompleted ? "bg-success-subtle border-success" : ""
        }`}
        style={{ cursor: "pointer" }}
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
        <div className="card-body d-flex align-items-center">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="taskCheck"
              checked={isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            />
          </div>

          {
            // updates if task is checked or not,
            // if checked, the title will have a line through them to indicate completion
            <div className="flex-grow-1">
              <h5
                className={`card-title text-muted ${
                  isCompleted ? "text-decoration-line-through" : ""
                }`}
              >
                {task.title}
              </h5>
              <p className="card-text">{task.description}</p>
              {isCompleted && (completedAt || completedBy) && (
                <div className="card-text text-success-emphasis small mb-0">
                  {completedAt && <div>Completed at {completedAt}</div>}
                  {completedBy && <div>By {completedBy}</div>}
                </div>
              )}
            </div>
          }

          <div className="text-end">
            {task.scheduledAt && <span>{displayTime}</span>}{" "}
            {task.scheduledAt && <br />}
            <span className="badge text-bg-primary">{categoryName}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
