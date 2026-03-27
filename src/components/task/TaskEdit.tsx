import { useState, type FormEvent } from "react";
import type { Task } from "../../types/task";
import type { Category } from "../../types/teams";

import {
  formatToDateTimeLocal,
  toDateTimeInputValue,
} from "../../utils/formatters";

interface TaskEditProps {
  task: Task;
  categories: Category[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCancel?: () => void;
}

const TaskEdit = ({
  task,
  categories,
  onUpdateTask,
  onDeleteTask,
  onCancel,
}: TaskEditProps) => {
  const isCompleted = (task.taskLogs?.length ?? 0) > 0;
  const completedAt = task.taskLogs?.[0]?.completedAt;
  const completedBy = task.taskLogs?.[0]?.caregivers
    ? `${task.taskLogs[0].caregivers.firstName} ${task.taskLogs[0].caregivers.lastName}`
    : undefined;

  // Format the completion time for display in the form
  const completedDateTimeLocal = formatToDateTimeLocal(
    task.taskLogs?.[0]?.completedAt ?? null,
  );

  const [formState, setFormState] = useState({
    title: task.title,
    description: task.description,
    time: toDateTimeInputValue(task.scheduledAt ?? null),
    categoryId: task.categoryId,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const updatedCategory = categories.find(
      (c) => c.categoryId === formState.categoryId,
    );
    onUpdateTask({
      ...task,
      title: formState.title,
      description: formState.description,
      scheduledAt: formState.time,
      categoryId: formState.categoryId,
      categories: updatedCategory
        ? { name: updatedCategory.name, color: updatedCategory.color }
        : task.categories,
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
        value={formState.title ?? ""}
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
        value={formState.description ?? ""}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
        required
      />

      <label htmlFor="edit-task-time" className="form-label mt-3">
        Time:
      </label>
      <input
        type="datetime-local"
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
        value={formState.categoryId}
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev,
            categoryId: e.target.value,
          }))
        }
        required
      >
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryId}>
            {cat.name}
          </option>
        ))}
      </select>

      {isCompleted && (
        <div className="mt-3 p-3 bg-light border rounded">
          <div className="d-flex justify-content-between">
            <span className="fw-semibold">Latest Completion details</span>
            {completedAt && (
              <span className="text-muted small">{completedDateTimeLocal}</span>
            )}
          </div>
          <div className="form-label mt-2 mb-0">Completed By:</div>
          <div className="text-muted">{completedBy ?? "Not specified"}</div>
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
          onClick={() => onDeleteTask(task.taskId)}
        >
          Delete Task
        </button>
      </div>
    </form>
  );
};

export default TaskEdit;
