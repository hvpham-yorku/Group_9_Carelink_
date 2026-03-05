import { supabase } from "../lib/supabase";
import type { NewTask, TaskLogEntry } from "../types/Types";

export const taskService = {
  // Fetch tasks filtered by a specific patient
  async getTasksByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
    *,
    taskLogs (
      completedAt,
      caregivers (firstName)
    )
  `,
      )
      .eq("patientId", patientId)
      .order("completedAt", { foreignTable: "taskLogs", ascending: false })
      .limit(1, { foreignTable: "taskLogs" });

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
};
