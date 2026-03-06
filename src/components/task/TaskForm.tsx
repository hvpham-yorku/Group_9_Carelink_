/*
    TaskForm component is responsible for rendering a form that allows users to create or edit tasks. 
    It includes input fields for task title, description, due date, and category level. 
*/
import { useState } from "react";

interface Category {
  categoryId: string;
  name: string;
}

interface TaskFormProps {
  categories: Category[];
  onAddTask: (
    title: string,
    description: string,
    time: string,
    categoryId: string,
  ) => void;
  onCancel?: () => void;
}

const TaskForm = ({ categories, onAddTask, onCancel }: TaskFormProps) => {
  // State variables to hold the values of the form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [categoryId, setCategoryId] = useState("");

  /*
    Calls onAddTask prop function with the current values from the inputs.
    Resets the inputs after adding a task. 
  */
  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onAddTask(title, description, time, categoryId);
    setTitle("");
    setDescription("");
    setTime("");
    setCategoryId("");
  };

  return (
    <>
      <form className="mb-3" onSubmit={handleAddClick}>
        <label htmlFor="task-title" className="form-label">
          Task Title:
        </label>
        <input
          type="text"
          className="form-control"
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="task-description" className="form-label mt-3">
          Task Description:
        </label>
        <textarea
          className="form-control"
          id="task-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="task-time" className="form-label mt-3">
          Time:
        </label>
        <input
          type="datetime-local"
          className="form-control"
          id="task-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <label htmlFor="task-category" className="form-label mt-3">
          Category:
        </label>
        <select
          className="form-select"
          id="task-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit">
            Add Task
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
      </form>
    </>
  );
};

export default TaskForm;
