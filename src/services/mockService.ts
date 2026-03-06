import type { CaregiverInfo, PatientInfo, Task } from "../types/Types";
import { mockTasks, teamMembers, teamPatients } from "./mockData";

const tasks = [...mockTasks];
const caregivers = [...teamMembers];
const patients = [...teamPatients];

export const mockService = {
  /**
   * Task Manager functions
   */
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve) => {
      // Return a new array instance to avoid shared reference mutations in React state.
      setTimeout(() => resolve([...tasks]), 300);
    });
  },

  async addTask(task: Omit<Task, "taskId">): Promise<Task> {
    const newTask: Task = {
      taskId: crypto.randomUUID(),
      ...task,
    };

    tasks.push(newTask);
    return newTask;
  },

  async deleteTask(taskId: string): Promise<void> {
    const index = tasks.findIndex((task) => task.taskId === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  },

  /**
   * Team Management functions
   */

  async getCaregivers(): Promise<CaregiverInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...caregivers]), 300);
    });
  },

  async getPatients(): Promise<PatientInfo[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...patients]), 300);
    });
  },
};
