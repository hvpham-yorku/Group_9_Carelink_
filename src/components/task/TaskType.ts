/**
 * Task Type Definition
 */

export type TaskCategory =
  | "General"
  | "Vitals"
  | "Medication"
  | "Personal"
  | "Nutrition"
  | "Therapy"
  | "Activity";

export type TaskCategoryColor = {
  [key in TaskCategory]: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  time?: string;
  completed: boolean;
}
