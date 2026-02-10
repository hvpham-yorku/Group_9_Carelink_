import CustomSection from "../components/ui/CustomSection";
// import TaskCard from "../components/task/TaskCard";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";

const TaskManager = () => {
  const tasks = [
    {
      id: 1,
      title: "Task 1",
      description: "This is the first task.",
      category: "Medication",
      time: "10:00 AM",
    },
    {
      id: 2,
      title: "Task 2",
      description: "This is the second task.",
      category: "Vitals",
      time: "2:00 PM",
    },
    {
      id: 3,
      title: "Task 3",
      description: "This is the third task.",
      category: "Personal",
      time: "4:00 PM",
    },
  ];

  return (
    <>
      <div className="container">
        <h1>Task Manager</h1>
        <p>This is the Task Manager page.</p>
        <hr />

        <CustomSection title="Add Task" subheader="Create new Tasks here: ">
          <TaskForm />
        </CustomSection>

        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskList tasks={tasks} />
        </CustomSection>
      </div>
    </>
  );
};

export default TaskManager;
