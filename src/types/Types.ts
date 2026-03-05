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
  completedAt?: string;
  completedBy?: string;
  completed: boolean;
}

/**
 * Medication Type Definitions
 */
export interface MedicationScheduleItemProps {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledAt: string;
  taken?: boolean;
  takenAt?: string | null;
  takenBy?: string | null;
  onToggle?: () => void;
}

/**
 * Notes Type Definition
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tags;
  createdAt: string;
  updatedAt: number;
}

/**
 * Patient Info Type Definition
 */
export interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // date of birth
  address: string;
  phone: string;
}

/**
 * Caregiver Info Type Definition
 */
export interface CaregiverInfo {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  jobTitle: string;
}

/**
 * Caregiver Teams Type Definition
 */
export interface CaregiverTeam {
  id: string;
  caregiver: CaregiverInfo[];
  patient: PatientInfo[];
  caregiverRole: string;
  dateAssigned: string;
}

/**
 * Dashboard Type Definition
 */
export interface DashboardData {
  stats: StatCard[];
  recentActivities: ActivityItem[];
  medications: MedItem[];
  appointments: AppointmentItem[];
}

type StatCard = {
  title: string;
  primary: string;
  secondary: string;
  route?: string; // optional route for navigation
};

type ActivityItem = {
  icon: string;
  text: string;
};

type MedItem = {
  time: string;
  name: string;
  dose: string;
  taken: boolean;
};

type AppointmentItem = {
  day: string;
  title: string;
  location: string;
};
