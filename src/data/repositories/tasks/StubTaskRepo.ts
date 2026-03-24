import type { TaskRepo, NewTask } from "./TaskRepo";
import type { Task, TaskLogEntry } from "../../../types/task";
import type { Category } from "../../../types/teams";
import { tasks, taskLogs, categories } from "../../data";

export class StubTaskRepo implements TaskRepo {
  async getTasksByPatient(patientId: string): Promise<Task[]> {
    return tasks.filter((task) => task.patientId === patientId);
  }

  async getCategories(careTeamId: string): Promise<Category[]> {
    // In stub mode, careTeamId is ignored and all categories are returned
    void careTeamId;
    return categories.map((c) => ({
      categoryId: c.categoryId,
      name: c.name,
      color: c.color,
    }));
  }

  async addTask(task: NewTask): Promise<Task> {
    const newTask = { ...task, taskId: crypto.randomUUID() };
    tasks.push(newTask);

    return newTask;
  }

  async updateTask(taskId: string, updates: Partial<NewTask>): Promise<Task> {
    const taskIndex = tasks.findIndex((t) => t.taskId === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;

    return updatedTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskIndex = tasks.findIndex((t) => t.taskId === taskId);
    if (taskIndex === -1) throw new Error("Task not found");

    tasks.splice(taskIndex, 1);
  }

  async markTaskAsDone(
    taskId: string,
    caregiverId: string,
  ): Promise<TaskLogEntry> {
    const logEntry: TaskLogEntry = {
      taskId,
      caregiverId,
      completedAt: new Date().toISOString(),
      isCompleted: true,
    };
    taskLogs.push(logEntry);
    return logEntry;
  }

  async unmarkTaskAsDone(taskId: string): Promise<void> {
    const logIndex = taskLogs.findIndex((log) => log.taskId === taskId);
    if (logIndex === -1) throw new Error("Task log not found");

    taskLogs.splice(logIndex, 1);
  }
}
