/*
    This component will be reused to display a list of items in various parts of the application.
    Each item in the list can represent a task, user, or any other entity depending on the context.


*/
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: {
    id: number;
    title: string;
    description: string;
    category: string;
    time?: string;
  }[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <>
      <div>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            category={task.category}
            time={task.time}
          />
        ))}
      </div>
    </>
  );
};

export default TaskList;
