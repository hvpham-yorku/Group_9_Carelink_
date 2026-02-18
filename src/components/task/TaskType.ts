/**
 * Task Type Definition
 */

export type TaskCategory =
  | "None"
  | "Vitals"
  | "Medication"
  | "Personal"
  | "Nutrition"
  | "Therapy"
  | "Activity";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  time?: string;
  completed: boolean;
}
