/**
 * Types.ts
 * This file contains type definitions for the application.
 */

/**
 * Category Type Definition
 */
export interface Category {
  categoryId: string;
  name: string;
}

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

export interface TaskLogEntry {
  taskId: string;
  caregiverId: string;
  completedAt: string;
  isCompleted: boolean;
  caregivers?: { firstName: string; lastName: string };
}

/**
 * Medication Type Definitions
 */
export interface MedicationLogEntry {
  medicationLogId?: string;
  prescriptionId: string;
  caregiverId: string;
  takenAt: string;
  isCompleted: boolean;
  caregivers?: {
    firstName: string;
    lastName: string;
  };
}

export interface MedicationScheduleItemProps {
  prescriptionId: string;
  careTeamId: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledAt: string;
  isActive: boolean;

  // supabase join for prescriptions and medicationLogs
  medicationLog?: {
    caregiverId: string;
    firstName: string;
    lastName: string;
    takenAt: string;
    isCompleted: boolean;
  };

  onToggle: (prescriptionId: string, isCompleted: boolean) => void;
}

/**
 * Appointment Type Definitions
 */
export interface Appointment {
  appointmentId: string;
  careTeamId: string;
  caregiverId: string;
  patientId: string;
  scheduledAt: string;
  description: string;
  completedTime?: string | null;
  caregivers?: {
    firstName: string;
    lastName: string;
  };
}

/**
 * Notes Type Definition
 */
export interface Note {
  noteId: string;
  careTeamId: string;
  caregiverId: string;
  patientId: string;
  categoryId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  // Supabase Joins
  caregivers?: {
    firstName: string;
    lastName: string;
  };
  categories?: {
    name: string;
  };
}

/**
 * Patient Info Type Definition
 */
export interface PatientInfo {
  patientId: string;
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  phoneNumber: string;
  email?: string;
  gender?: string;
  bloodType?: string;
  height?: string;
  weight?: string;
  allergies?: string[];
  conditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  physicianName?: string;
  physicianPhone?: string;
  physicianAddress?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  careNotes?: string;
}

/**
 * Caregiver Info Type Definition
 */
export interface CaregiverInfo {
  caregiverId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  jobTitle: string;
  teamRole?: string; // new field ------------------------------
  teamDateAssigned?: string; // new field ------------------------------
}

/**
 * Caregiver Teams Type Definition
 */
export interface CaregiverTeam {
  careTeamId: string;
  caregivers: CaregiverInfo[];
  patients: PatientInfo[];
  teamName?: string; // new field ------------------------------
  joinCode: string;
  caregiverRole?: string; // marked for deletion ------------------------------
  dateAssigned: string; // marked for deletion ------------------------------
}

// marked for deletion ------------------------------
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
  time?: string;
};