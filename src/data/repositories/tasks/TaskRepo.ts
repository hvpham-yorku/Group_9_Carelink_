import type { Task, TaskLogEntry } from "../../../types/task";

export interface NewTask {
  title: string;
  description?: string;
  categoryId: string;
  patientId: string;
  careTeamId: string;
  scheduledAt: string;
}

export interface TaskRepo {
  getTasksByPatient(patientId: string): Promise<Task[]>;
  addTask(task: NewTask): Promise<Task>;
  updateTask(taskId: string, updates: Partial<NewTask>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  markTaskAsDone(taskId: string, caregiverId: string): Promise<TaskLogEntry>;
  unmarkTaskAsDone(taskId: string): Promise<void>;
}
