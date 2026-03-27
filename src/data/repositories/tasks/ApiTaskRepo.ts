import type { NewTask, TaskRepo } from "./TaskRepo";
import type { Task, TaskLogEntry } from "../../../types/task";
import type { Category } from "../../../types/teams";

import { supabase } from "../../../lib/supabase";
import { formatToDateTimeLocal } from "../../../utils/formatters";

export class ApiTaskRepo implements TaskRepo {
  async getTasksByPatient(patientId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `
                task_id,
                category_id,
                title,
                description,
                scheduled_at,
                categories (name, color),
                task_logs (
                    completed_at,
                    is_completed,
                    caregivers (first_name, last_name)
                )
            `,
      )
      .eq("patient_id", patientId)
      .order("completed_at", { foreignTable: "task_logs", ascending: false });

    if (error) throw error;

    const formattedData: Task[] = data.map((item) => ({
      taskId: item.task_id,
      categoryId: item.category_id,
      title: item.title,
      description: item.description,
      scheduledAt: formatToDateTimeLocal(item.scheduled_at),
      categories: item.categories,
      taskLogs: item.task_logs.map((log) => ({
        completedAt: log.completed_at,
        isCompleted: log.is_completed,
        caregivers: log.caregivers
          ? {
              firstName: log.caregivers.first_name,
              lastName: log.caregivers.last_name,
            }
          : undefined,
      })),
    }));

    return formattedData;
  }

  async getCategories(careTeamId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("category_id, name, color")
      .eq("team_id", careTeamId)
      .order("name", { ascending: true });

    if (error) throw error;

    const formattedData: Category[] = data.map((item) => ({
      categoryId: item.category_id,
      name: item.name,
      color: item.color,
    }));

    return formattedData;
  }

  async addTask(task: NewTask): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: task.title,
          description: task.description || null,
          category_id: task.categoryId,
          patient_id: task.patientId,
          team_id: task.careTeamId,
          scheduled_at: task.scheduledAt,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const formattedData: Task = {
      taskId: data.task_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      scheduledAt: formatToDateTimeLocal(data.scheduled_at),
    };

    return formattedData;
  }

  async updateTask(taskId: string, updates: Partial<NewTask>): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: updates.title,
        description: updates.description || null,
        category_id: updates.categoryId,
        scheduled_at: updates.scheduledAt,
      })
      .eq("task_id", taskId)
      .select()
      .single();

    if (error) throw error;

    const formattedData: Task = {
      taskId: data.task_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      scheduledAt: formatToDateTimeLocal(data.scheduled_at),
    };

    return formattedData;
  }

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", taskId);

    if (error) throw error;
    return;
  }

  async markTaskAsDone(
    taskId: string,
    caregiverId: string,
  ): Promise<TaskLogEntry> {
    const { data, error } = await supabase
      .from("task_logs")
      .insert([
        {
          task_id: taskId,
          caregiver_id: caregiverId,
          completed_at: new Date().toISOString(),
          is_completed: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const formattedData: TaskLogEntry = {
      taskId: data.task_id,
      caregiverId: data.caregiver_id,
      completedAt: data.completed_at,
      isCompleted: data.is_completed,
    };

    return formattedData;
  }

  // updates the isCompleted field to false, but keeps the log entry for historical tracking
  async unmarkTaskAsDone(taskId: string): Promise<void> {
    const { error } = await supabase
      .from("task_logs")
      .update({ is_completed: false })
      .eq("task_id", taskId);

    if (error) throw error;
    return;
  }
}
