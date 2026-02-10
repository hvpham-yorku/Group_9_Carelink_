/* 
  This component presents a task card, which can be used to display information about a task in a card format.
  
  Props:
  - title: the title of the task
  - description: a brief description of the task

  Syntax:
  <TaskCard title="Task Title" description="This is a description of the task." />
*/
import { useState } from "react";

interface TaskCardProps {
  title: string;
  description: string;
  category: string;
  time?: string;
}

const TaskCard = ({ title, description, category, time }: TaskCardProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(
      `Task "${title}" marked as ${!isChecked ? "completed" : "incomplete"}`,
    );
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body d-flex align-items-center">
          <div className="form-check me-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="taskCheck"
              value=""
              id="taskCheck"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </div>

          {
            // updates if task is checked or not,
            // if checked, the title will have a line through them to indicate completion
            <div className="flex-grow-1">
              <h5
                className={`card-title ${isChecked ? "text-decoration-line-through" : ""}`}
              >
                {title}
              </h5>
              <p className="card-text">{description}</p>
            </div>
          }

          <div className="text-end">
            <span className="text-muted">{time}</span> <br />
            <span>{category}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
