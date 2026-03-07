import { supabase } from "../lib/supabase";
import type { TaskLogEntry } from "../types/Types";

export interface NewTask {
  title: string;
  description?: string;
  categoryId: string;
  patientId: string;
  careTeamId: string;
  scheduledAt: string;
}

export const taskService = {
  // Fetch tasks filtered by a specific patient
  async getTasksByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        categories (name),
        taskLogs (
          completedAt,
          isCompleted,
          caregivers (firstName)
        )
      `,
      )
      .eq("patientId", patientId)
      // We order logs by newest first so the first item in the array is the "current" status
      .order("completedAt", { foreignTable: "taskLogs", ascending: false });

    if (error) throw error;
    return data;
  },

  // fetch categories for dropdown
  async getCategories(teamId: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("categoryId, name")
      .eq("careTeamId", teamId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create a new task
  async addTask(task: NewTask) {
    const { data, error } = await supabase
      .from("tasks")
      .insert([task])
      .select() // Returns the newly created task (including its new UUID)
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing task
  async updateTask(taskId: string, updates: Partial<NewTask>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("taskId", taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a task
  async deleteTask(taskId: string) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("taskId", taskId);

    if (error) throw error;
    return true;
  },

  // Toggle task completion status
  async markTaskAsDone(taskId: string, caregiverId: string) {
    const logEntry: TaskLogEntry = {
      taskId,
      caregiverId,
      completedAt: new Date().toISOString(),
      isCompleted: true,
    };

    const { data, error } = await supabase
      .from("taskLogs")
      .insert([logEntry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // updates the isCompleted field to false, but keeps the log entry for historical tracking
  async unmarkTaskAsDone(taskId: string) {
    const { error } = await supabase
      .from("taskLogs")
      .update({ isCompleted: false })
      .eq("taskId", taskId);

    if (error) throw error;
    return true;
  },
};
