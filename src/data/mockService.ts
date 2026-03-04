import type { Task } from "../types/Types";
import { mockTasks } from "./mockData";

const tasks = [...mockTasks];

export const mockService = {
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(tasks), 300);
    });
  },

  async addTask(task: Omit<Task, "id">): Promise<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...task,
    };

    tasks.push(newTask);
    return newTask;
  },
};
