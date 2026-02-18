/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";
import type { Task, TaskCategory } from "../components/task/TaskType";

import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";

const TaskManager = () => {
  // Initialize tasks state with a sample task for demonstration purposes
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage if available, otherwise initialize with a sample task
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? (JSON.parse(savedTasks) as Task[])
      : [
          {
            id: crypto.randomUUID(), // api to generate unique id for the task
            title: "Sample Task",
            description: "This is a sample task description.",
            category: "None",
            time: "10:00 AM",
            completed: false,
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
    const newTask: Task = {
      id: crypto.randomUUID(), // Generate a unique id for the new task
      title,
      description,
      time,
      category: category as TaskCategory,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  // (Temporary) Saves tasks to localStorage whenever the tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to toggle the completion status of a task based on its id
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

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
          <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
        </CustomSection>
      </div>
    </>
  );
};

export default TaskManager;
