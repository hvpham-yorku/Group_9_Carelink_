/**
 * Task Type Definition
 */

export interface Task {
  taskId: string;
  categoryId?: string;
  patientId?: string;
  title: string | null;
  description?: string | null;
  scheduledAt: string | null;

  // Supabase Join
  categories?: { name: string };
  taskLogs?: TaskLogEntry[];
}

export interface TaskLogEntry {
  taskId?: string;
  caregiverId?: string;
  completedAt: string | null;
  isCompleted: boolean | null;
  caregivers?: { firstName: string; lastName: string };
}
