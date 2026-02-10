/*
    This component will be reused to display a list of items in various parts of the application.
    Each item in the list can represent a task, user, or any other entity depending on the context.


*/
import TaskCard from "./TaskCard";

const TaskList = () => {
  const tasks = [
    {
      title: "Task 1",
      description: "This is the first task.",
    },
    {
      title: "Task 2",
      description: "This is the second task.",
    },
    {
      title: "Task 3",
      description: "This is the third task.",
    },
  ];

  return (
    <>
      <div>
        {tasks.map((task, index) => (
          <TaskCard
            key={index}
            title={task.title}
            description={task.description}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
