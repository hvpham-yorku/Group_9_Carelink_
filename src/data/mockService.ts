import type { Task } from "../types/Types";
import { mockTasks } from "./mockData";

const tasks = [...mockTasks];

export const mockService = {
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      // Return a new array instance to avoid shared reference mutations in React state.
      setTimeout(() => resolve([...tasks]), 300);
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

  async deleteTask(id: string): Promise<void> {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  },
};
