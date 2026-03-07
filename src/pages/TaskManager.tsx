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

// Context and services
import { taskService } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";

// UI Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import TaskList from "../components/task/TaskList";
import TaskForm from "../components/task/TaskForm";
import Button from "../components/ui/Button";
import TaskEdit from "../components/task/TaskEdit";

const TaskManager = () => {
  // Local state for tasks, categories, and form visibility
  const [visible, setVisible] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Get current user and patient context
  const { user } = useAuth();
  const {
    selectedPatientId,
    careTeamId,
    loading: contextLoading,
  } = usePatient();

  // Context state: patientId, careTeamId, caregiverId
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<
    { categoryId: string; name: string }[]
  >([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Load context: User -> CareTeam -> Patient, fetch categories, and initial task load
  useEffect(() => {
    async function loadTaskData() {
      if (!selectedPatientId || !careTeamId) return;

      setLoadingTasks(true);
      try {
        const [fetchedTasks, fetchedCats] = await Promise.all([
          taskService.getTasksByPatient(selectedPatientId),
          taskService.getCategories(careTeamId),
        ]);

        setTasks(fetchedTasks as Task[]);
        setCategories(fetchedCats);
      } catch (err) {
        console.error("Failed to load tasks for patient:", err);
      } finally {
        setLoadingTasks(false);
      }
    }

    loadTaskData();
  }, [selectedPatientId, careTeamId]);

  const refreshTasks = async () => {
    if (!selectedPatientId) return;
    try {
      const data = await taskService.getTasksByPatient(selectedPatientId);
      if (data) setTasks(data as Task[]);
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
    if (!selectedPatientId || !careTeamId) return;
    try {
      await taskService.addTask({
        title,
        description,
        scheduledAt: time,
        categoryId,
        patientId: selectedPatientId,
        careTeamId: careTeamId,
      });
      await refreshTasks();
      setVisible(false);
      setFormMode("add");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  // Toggle task completion (mark or unmark as done)
  const handleToggleTask = async (taskId: string) => {
    if (!user) return;
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task) return;
    const isCompleted = task.taskLogs?.some((log) => log.isCompleted) ?? false;
    try {
      if (isCompleted) {
        await taskService.unmarkTaskAsDone(taskId);
      } else {
        await taskService.markTaskAsDone(taskId, user.id);
      }
      await refreshTasks();
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
    }
  };

  // Update an existing task
  const handleUpdateTask = async (updatedTask: Task) => {
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

  // Show the add/edit form and set the selected task for editing
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
              {contextLoading || loadingTasks ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center p-5 bg-light rounded">
                  <p className="text-muted">
                    No tasks scheduled for this patient today.
                  </p>
                </div>
              ) : (
                <TaskList
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onSelectTask={handleSelectTask}
                />
              )}
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
