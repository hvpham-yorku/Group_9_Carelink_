/* 
  This component presents a task card, which can be used to display information about a task in a card format.
  
  Props:
  - title: the title of the task
  - description: a brief description of the task

  Syntax:
  <TaskCard title description category time completed onToggle />
*/
import type { Task, TaskCategoryColor } from "./TaskType";

interface TaskCardProps {
  task: Task;
  categoryColors: TaskCategoryColor;
  onToggle: () => void;
}

const TaskCard = ({ task, categoryColors, onToggle }: TaskCardProps) => {
  const badgeColor = categoryColors[task.category];

  return (
    <>
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="taskCheck"
              checked={task.completed}
              onChange={onToggle}
            />
          </div>

          {
            // updates if task is checked or not,
            // if checked, the title will have a line through them to indicate completion
            <div className="flex-grow-1">
              <h5
                className={`card-title ${task.completed ? "text-decoration-line-through" : ""}`}
              >
                {task.title}
              </h5>
              <p className="card-text">{task.description}</p>
            </div>
          }

          <div className="text-end">
            <span className="text-muted">{task.time}</span> <br />
            <span className={`badge text-bg-${badgeColor}`}>
              {task.category}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
