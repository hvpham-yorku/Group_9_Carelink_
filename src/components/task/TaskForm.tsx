/*
    TaskForm component is responsible for rendering a form that allows users to create or edit tasks. 
    It includes input fields for task title, description, due date, and category level. 
    
*/

const TaskForm = () => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="task-title" className="form-label">
          Task Title:
        </label>
        <input type="text" className="form-control" id="task-title" />

        <label htmlFor="task-description" className="form-label mt-3">
          Task Description:
        </label>
        <textarea className="form-control" id="task-description" rows={2} />

        <label htmlFor="task-time" className="form-label mt-3">
          Time:
        </label>
        <input type="time" className="form-control" id="task-time" />

        <label htmlFor="task-category" className="form-label mt-3">
          Category:
        </label>
        <select className="form-select" id="task-category">
          <option value="none">None</option>
          <option value="vitals">Vitals</option>
          <option value="medication">Medication</option>
          <option value="personal">Personal</option>
          <option value="nutrition">Nutrition</option>
          <option value="therapy">Therapy</option>
          <option value="activity">Activity</option>
        </select>

        <button className="btn btn-primary mt-3" type="submit">
          Add Task
        </button>
      </div>
    </>
  );
};

export default TaskForm;
