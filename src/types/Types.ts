/**
 * Types.ts
 * This file contains type definitions for the application.
 */

/**
 * Tag Type Definition
 */

export type Tags =
  | "Medical"
  | "Vitals"
  | "Mood"
  | "Nutrition"
  | "Activity"
  | "General"
  | "Medication"
  | "Personal"
  | "Therapy";

/**
 * Task Type Definition
 */

export type TaskCategoryColor = {
  [key in Tags]: string;
};

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Tags;
  time?: string;
  completed: boolean;
}

/**
 * Dashboard Type Definitions
 */
