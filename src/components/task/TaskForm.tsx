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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("None");

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

  return (
    <>
      <div className="mb-3">
        <label htmlFor="task-title" className="form-label">
          Task Title:
        </label>
        <input
          type="text"
          className="form-control"
          id="task-title"
          value={title}
          onChange={titleChange}
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
        />

        <label htmlFor="task-category" className="form-label mt-3">
          Category:
        </label>
        <select
          className="form-select"
          id="task-category"
          value={category}
          onChange={categoryChange}
        >
          <option value="None">None</option>
          <option value="Vitals">Vitals</option>
          <option value="Medication">Medication</option>
          <option value="Personal">Personal</option>
          <option value="Nutrition">Nutrition</option>
          <option value="Therapy">Therapy</option>
          <option value="Activity">Activity</option>
        </select>

        <button
          className="btn btn-primary mt-3"
          onClick={() => onAddTask(title, description, time, category)}
        >
          Add Task
        </button>
      </div>
    </>
  );
};

export default TaskForm;
