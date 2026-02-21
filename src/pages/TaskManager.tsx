/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";
import type {
  Task,
  TaskCategory,
  TaskCategoryColor,
} from "../components/task/TaskType";

import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";

const TaskManager = () => {
  const CATEGORY_COLORS: TaskCategoryColor = {
    General: "primary",
    Vitals: "danger",
    Medication: "danger",
    Personal: "secondary",
    Nutrition: "success",
    Therapy: "primary",
    Activity: "success",
  };

  const [visible, setVisible] = useState(false);

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
            category: "General",
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

  // Toggles the visibility of the TaskForm component when the "Add New Task" button is clicked
  const toggleFormVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <div className="container">
        <CustomTitleBanner
          title="Task Manager"
          subheader="Manage your tasks efficiently"
        >
          <Button color="primary" onClick={toggleFormVisibility}>
            + Add New Task
          </Button>
        </CustomTitleBanner>

        <section className="row mb-4">
          <div className="col">
            <CustomSection title="All Tasks" subheader="Manage your tasks here">
              <TaskList
                tasks={tasks}
                categoryColors={CATEGORY_COLORS}
                onToggleTask={handleToggleTask}
              />
            </CustomSection>
          </div>

          {visible && (
            <div className="col">
              <CustomSection
                title="Manage Task"
                subheader="Create new Tasks here: "
              >
                <TaskForm onAddTask={handleAddTask} />
              </CustomSection>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default TaskManager;
