/*
    This component will be reused to display a list of items in various parts of the application.
    Each item in the list can represent a task, user, or any other entity depending on the context.

    Props:
    - tasks: an array of task objects: title, description, category, time, and completion status.
    - onToggleTask: a function that is called when a task's completion status is toggled. It takes the task's id as an argument.
*/
import type { Task, TaskCategoryColor } from "./TaskType";

import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  categoryColors: TaskCategoryColor;
  onToggleTask: (id: string) => void;
}

const TaskList = ({ tasks, categoryColors, onToggleTask }: TaskListProps) => {
  return (
    <>
      <ul className="list-unstyled">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard
              task={task}
              categoryColors={categoryColors}
              onToggle={() => onToggleTask(task.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
