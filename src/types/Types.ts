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

export interface Task {
  taskId: string;
  patientId: string;
  careTeamId: string;
  categoryId: string;
  title: string;
  description: string;
  scheduledAt: string;
  // Supabase Join
  categories?: { name: string };
  taskLogs?: TaskLogEntry[];
}

export interface NewTask {
  title: string;
  description?: string;
  categoryId: string;
  patientId: string;
  careTeamId: string;
  scheduledAt: string;
}

export interface TaskLogEntry {
  taskId: string;
  caregiverId: string;
  completedAt: string;
  isCompleted: boolean;
  caregivers?: { firstName: string };
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
  patientId: string;
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
  caregiverId: string;
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
  careTeamId: string;
  caregivers: CaregiverInfo[];
  patients: PatientInfo[];
  joinCode: string;
  caregiverRole: string;
  dateAssigned: string;
}

export interface careTeamMember {
  membershipId: string;
  careTeamId: string;
  caregiverId: string;
  patientId: string;
  role: string;
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
