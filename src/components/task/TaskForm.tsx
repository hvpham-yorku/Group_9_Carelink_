/*
    TaskForm component is responsible for rendering a form that allows users to create or edit tasks. 
    It includes input fields for task title, description, due date, and category level. 
*/
import { useState } from "react";
import type { TaskCategory } from "./TaskType";

interface TaskFormProps {
  onAddTask: (
    title: string,
    description: string,
    time: string,
    category: TaskCategory,
  ) => void;
}

const CATEGORIES: TaskCategory[] = [
  "General",
  "Vitals",
  "Medication",
  "Personal",
  "Nutrition",
  "Therapy",
  "Activity",
];

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  // State variables to hold the values of the form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<TaskCategory>("General");

  /*
    Calls onAddTask prop function with the current values from the inputs.
    Resets the inputs after adding a task. 
  */
  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onAddTask(title, description, time, category);
    setTitle("");
    setDescription("");
    setTime("");
    setCategory("General");
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
          type="time"
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
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="btn btn-primary mt-3" type="submit">
          Add Task
        </button>
      </form>
    </>
  );
};

export default TaskForm;
