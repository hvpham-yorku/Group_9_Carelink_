/*
    This component will be reused to display a list of items in various parts of the application.
    Each item in the list can represent a task, user, or any other entity depending on the context.

    Props:
    - tasks: an array of task objects: title, description, category, time, and completion status.
    - onToggleTask: a function that is called when a task's completion status is toggled. It takes the task's id as an argument.
*/
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: {
    id: number;
    title: string;
    description: string;
    category: string;
    time?: string;
    completed?: boolean;
  }[];
  onToggleTask: (id: number) => void;
}

const TaskList = ({ tasks, onToggleTask }: TaskListProps) => {
  return (
    <>
      <ul className="list-unstyled">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              title={task.title}
              description={task.description}
              category={task.category}
              time={task.time}
              completed={task.completed ?? false}
              onToggle={() => onToggleTask(task.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
