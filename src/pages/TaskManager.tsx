/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";

import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";

const TaskManager = () => {
  // Initialize tasks state with a sample task for demonstration purposes
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage if available, otherwise initialize with a sample task
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            title: "Sample Task",
            description: "This is a sample task description.",
            category: "General",
            time: "2024-06-30 10:00",
          },
        ];
  });

  // Function to handle adding a new task to the list
  const handleAddTask = (
    title: string,
    description: string,
    time: string,
    category: string,
  ) => {
    const newTask = {
      id: tasks.length + 1,
      title,
      description,
      time,
      category,
    };
    setTasks([...tasks, newTask]);
  };

  // Temporary Saves tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <>
      <div className="container">
        <h1>Task Manager</h1>
        <p>This is the Task Manager page.</p>
        <hr />

        <CustomSection title="Add Task" subheader="Create new Tasks here: ">
          <TaskForm onAddTask={handleAddTask} />
        </CustomSection>

        <CustomSection title="All Tasks" subheader="Manage your tasks here">
          <TaskList tasks={tasks} />
        </CustomSection>
      </div>
    </>
  );
};

export default TaskManager;
