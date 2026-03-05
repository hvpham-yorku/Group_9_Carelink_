/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";
import type { Task, Tags, TaskCategoryColor } from "../types/Types";
import { mockService } from "../services/mockService";

import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";
import TaskEdit from "../components/task/TaskEdit";

const TaskManager = () => {
  const CATEGORY_COLORS: TaskCategoryColor = {
    General: "primary",
    Vitals: "danger",
    Medication: "danger",
    Personal: "success",
    Nutrition: "success",
    Therapy: "primary",
    Activity: "success",
    Medical: "danger",
    Mood: "primary",
  };

  const [visible, setVisible] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    mockService.getTasks().then(setTasks);
  }, []);

  // Function to handle adding a new task to the list
  const handleAddTask = (
    title: string,
    description: string,
    time: string,
    category: Tags,
  ) => {
    mockService
      .addTask({
        title,
        description,
        time,
        completedAt: "",
        completedBy: "",
        category,
        completed: false,
      })
      .then((newTask) => {
        setTasks((prev) =>
          prev.some((task) => task.id === newTask.id)
            ? prev
            : [...prev, newTask],
        );
        setSelectedTask(newTask);
        setFormMode("edit");
        setVisible(true);
      });
  };

  // Function to toggle the completion status of a task based on its id
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed
                ? new Date().toLocaleString()
                : undefined,
              completedBy: !task.completed ? "Caregiver" : undefined,
            }
          : task,
      );

      const updated = updatedTasks.find((task) => task.id === id);
      if (updated && selectedTask && selectedTask.id === id) {
        setSelectedTask(updated);
      }

      return updatedTasks;
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
    setSelectedTask(updatedTask);
  };

  const handleDeleteTask = (id: string) => {
    mockService.deleteTask(id).then(() => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
        setVisible(false);
        setFormMode("add");
      }
    });
  };

  // Toggles the visibility of the TaskForm component when the "Add New Task" button is clicked
  const toggleFormVisibility = () => {
    setSelectedTask(null);
    setFormMode("add");
    setVisible(true);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setFormMode("edit");
    setVisible(true);
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
                onSelectTask={handleSelectTask}
              />
            </CustomSection>
          </div>

          {visible && (
            <div className="col">
              <CustomSection
                title={formMode === "add" ? "Add Task" : "Edit Task"}
                subheader={
                  formMode === "add"
                    ? "Create a new task"
                    : "Update the selected task"
                }
              >
                {formMode === "add" ? (
                  <TaskForm
                    onAddTask={handleAddTask}
                    onCancel={() => setVisible(false)}
                  />
                ) : (
                  selectedTask && (
                    <TaskEdit
                      key={selectedTask.id}
                      task={selectedTask}
                      onUpdateTask={handleUpdateTask}
                      onDeleteTask={handleDeleteTask}
                      onCancel={() => setVisible(false)}
                    />
                  )
                )}
              </CustomSection>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default TaskManager;
