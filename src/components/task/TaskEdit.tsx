import { useState, type FormEvent } from "react";
import type { Tags, Task } from "../../types/Types";

interface TaskEditProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCancel?: () => void;
}

const CATEGORIES: Tags[] = [
  "Medical",
  "Vitals",
  "Mood",
  "Nutrition",
  "Activity",
  "General",
  "Medication",
  "Personal",
  "Therapy",
];

const TaskEdit = ({
  task,
  onUpdateTask,
  onDeleteTask,
  onCancel,
}: TaskEditProps) => {
  const [formState, setFormState] = useState({
    title: task.title,
    description: task.description,
    time: task.time ?? "",
    category: task.category,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateTask({
      ...task,
      title: formState.title,
      description: formState.description,
      time: formState.time,
      category: formState.category,
    });
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <label htmlFor="edit-task-title" className="form-label">
        Task Title:
      </label>
      <input
        type="text"
        className="form-control"
        id="edit-task-title"
        value={formState.title}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, title: e.target.value }))
        }
        required
      />

      <label htmlFor="edit-task-description" className="form-label mt-3">
        Task Description:
      </label>
      <textarea
        className="form-control"
        id="edit-task-description"
        rows={2}
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
        required
      />

      <label htmlFor="edit-task-time" className="form-label mt-3">
        Time:
      </label>
      <input
        type="time"
        className="form-control"
        id="edit-task-time"
        value={formState.time}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, time: e.target.value }))
        }
        required
      />

      <label htmlFor="edit-task-category" className="form-label mt-3">
        Category:
      </label>
      <select
        className="form-select"
        id="edit-task-category"
        value={formState.category}
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev,
            category: e.target.value as Tags,
          }))
        }
        required
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {task.completed && (
        <div className="mt-3 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">Completion details</span>
            {task.completedAt && (
              <span className="text-muted small">{task.completedAt}</span>
            )}
          </div>
          <div className="form-label mt-2 mb-0">Completed By:</div>
          <div className="text-muted">
            {task.completedBy ?? "Not specified"}
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
          {onCancel && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>

        <button
          className="btn btn-outline-danger"
          type="button"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete Task
        </button>
      </div>
    </form>
  );
};

export default TaskEdit;
