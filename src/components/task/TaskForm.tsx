/*
    TaskForm component is responsible for rendering a form that allows users to create or edit tasks. 
    It includes input fields for task title, description, due date, and category level. 
*/
import { useState } from "react";

interface TaskFormProps {
  onAddTask: (
    title: string,
    description: string,
    time: string,
    category: string,
  ) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  // State variables to hold the values of the form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("None");

  // Event handlers to update the state variables when the user types in the form inputs
  const titleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const descriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const timeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const categoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  /*
    Calls onAddTask prop function with the current values from the inputs.
    Resets the inputs after adding a task. 
  */
  const handleAddClick = () => {
    onAddTask(title, description, time, category);
    setTitle("");
    setDescription("");
    setTime("");
    setCategory("None");
  };

  return (
    <>
      <form
        className="mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddClick();
        }}
      >
        <label htmlFor="task-title" className="form-label">
          Task Title:
        </label>
        <input
          type="text"
          className="form-control"
          id="task-title"
          value={title}
          onChange={titleChange}
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
          onChange={descriptionChange}
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
          onChange={timeChange}
          required
        />

        <label htmlFor="task-category" className="form-label mt-3">
          Category:
        </label>
        <select
          className="form-select"
          id="task-category"
          value={category}
          onChange={categoryChange}
          required
        >
          <option value="None">None</option>
          <option value="Vitals">Vitals</option>
          <option value="Medication">Medication</option>
          <option value="Personal">Personal</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Therapy">Therapy</option>
          <option value="Activity">Activity</option>
        </select>

        <button className="btn btn-primary mt-3" type="submit">
          Add Task
        </button>
      </form>
    </>
  );
};

export default TaskForm;
