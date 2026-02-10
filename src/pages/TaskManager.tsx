import CustomSection from "../components/ui/CustomSection";
import TaskCard from "../components/ui/TaskCard";

const TaskManager = () => {
  return (
    <>
      <div className="container">
        <h1>Task Manager</h1>
        <p>This is the Task Manager page.</p>
        <hr />
        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskCard title="Sample Task" description="description here" />
        </CustomSection>

        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskCard title="Sample Task" description="description here" />
        </CustomSection>

        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskCard title="Sample Task" description="description here" />
        </CustomSection>
      </div>
    </>
  );
};

export default TaskManager;
