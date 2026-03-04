/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";
import type { Task, TaskCategory, TaskCategoryColor } from "../types/TaskType";
import { mockService } from "../data/mockService";

import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";
import TaskListGroup from "../components/task/TaskListGroup";

const TaskManager = () => {
  const CATEGORY_COLORS: TaskCategoryColor = {
    General: "primary",
    Vitals: "danger",
    Medication: "danger",
    Personal: "success",
    Nutrition: "success",
    Therapy: "primary",
    Activity: "success",
  };

  const [visible, setVisible] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    mockService.getTasks().then(setTasks);
  }, []);

  // Function to handle adding a new task to the list
  const handleAddTask = (
    title: string,
    description: string,
    time: string,
    category: string,
  ) => {
    mockService
      .addTask({
        title,
        description,
        time,
        category: category as TaskCategory,
        completed: false,
      })
      .then((newTask) => setTasks((prev) => [...prev, newTask]));
  };

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

        <TaskListGroup />

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
