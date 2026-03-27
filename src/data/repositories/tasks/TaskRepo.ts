import type { Task, TaskLogEntry } from "../../../types/task";
import type { Category } from "../../../types/teams";

export interface NewTask {
  title: string;
  description?: string | null;
  categoryId: string;
  patientId: string;
  careTeamId: string;
  scheduledAt: string;
}

export interface TaskRepo {
  getTasksByPatient(patientId: string): Promise<Task[]>;
  getCategories(careTeamId: string): Promise<Category[]>;
  addTask(task: NewTask): Promise<Task>;
  updateTask(taskId: string, updates: Partial<NewTask>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  markTaskAsDone(taskId: string, caregiverId: string): Promise<TaskLogEntry>;
  unmarkTaskAsDone(taskId: string): Promise<void>;
}
