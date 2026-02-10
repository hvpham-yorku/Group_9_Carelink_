import CustomSection from "../components/ui/CustomSection";
// import TaskCard from "../components/task/TaskCard";
import TaskList from "../components/task/TaskList";

const TaskManager = () => {
  return (
    <>
      <div className="container">
        <h1>Task Manager</h1>
        <p>This is the Task Manager page.</p>
        <hr />

        <CustomSection
          title="Add Task"
          subheader="Create new Tasks here: "
        ></CustomSection>

        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskList />
        </CustomSection>
      </div>
    </>
  );
};

export default TaskManager;
