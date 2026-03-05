/*
  TaskManager.tsx
  This page serves as the main ui for managing tasks, able to view and add tasks.
  
  Components used in this page:
  - TaskForm: A form component for adding new tasks.
  - TaskList: A component that displays a list of tasks using TaskCard components.
  - TaskCard: A component that represents an individual task in a card format, with a checkbox to mark completion.
*/

import { useState, useEffect } from "react";
import type { Task } from "../types/Types";
import { taskService } from "../services/taskService";
import { patientService } from "../services/patientService";
import { useAuth } from "../hooks/useAuth";

import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";
import TaskEdit from "../components/task/TaskEdit";

const TaskManager = () => {
  const { user } = useAuth();

  const [visible, setVisible] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<
    { categoryId: string; name: string }[]
  >([]);
  const [context, setContext] = useState<{
    patientId: string;
    careTeamId: string;
    caregiverId: string;
  } | null>(null);

  // Load context: User -> CareTeam -> Patient, fetch categories, and initial task load
  useEffect(() => {
    async function loadContext() {
      if (!user) return;

      try {
        // The component now just asks the SERVICE for the info
        const contextData = await patientService.getInitialContext(user.id);

        if (contextData && contextData.patientId) {
          // Fetch categories and tasks using the IDs we got back
          const cats = await taskService.getCategories(contextData.careTeamId);
          const data = await taskService.getTasksByPatient(
            contextData.patientId,
          );

          setCategories(cats);
          setTasks(data);
          setContext({ ...contextData, caregiverId: user.id });
        }
      } catch (err) {
        console.error("Clean architecture load failed:", err);
      }
    }
    loadContext();
  }, [user]);

  const refreshTasks = async () => {
    if (!context) return;
    try {
      const data = await taskService.getTasksByPatient(context.patientId);
      if (data) setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Add a new task
  const handleAddTask = async (
    title: string,
    description: string,
    time: string,
    categoryId: string,
  ) => {
    if (!context) return;
    try {
      await taskService.addTask({
        title,
        description,
        scheduledAt: time,
        categoryId,
        patientId: context.patientId,
        careTeamId: context.careTeamId,
      });
      await refreshTasks();
      setVisible(false);
      setFormMode("add");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // Toggle task completion (mark as done)
  const handleToggleTask = async (taskId: string) => {
    if (!context) return;
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task) return;
    const isCompleted = (task.taskLogs?.length ?? 0) > 0;
    if (!isCompleted) {
      try {
        await taskService.markTaskAsDone(taskId, context.caregiverId);
        await refreshTasks();
      } catch (err) {
        console.error("Failed to mark task as done:", err);
      }
    }
  };

  // Update an existing task
  const handleUpdateTask = async (updatedTask: Task) => {
    if (!context) return;
    try {
      await taskService.updateTask(updatedTask.taskId, {
        title: updatedTask.title,
        description: updatedTask.description,
        scheduledAt: updatedTask.scheduledAt,
        categoryId: updatedTask.categoryId,
      });
      await refreshTasks();
      setSelectedTask(null);
      setVisible(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    if (!context) return;
    try {
      await taskService.deleteTask(taskId);
      await refreshTasks();
      if (selectedTask?.taskId === taskId) {
        setSelectedTask(null);
        setVisible(false);
        setFormMode("add");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

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
                    categories={categories}
                    onAddTask={handleAddTask}
                    onCancel={() => setVisible(false)}
                  />
                ) : (
                  selectedTask && (
                    <TaskEdit
                      key={selectedTask.taskId}
                      task={selectedTask}
                      categories={categories}
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
