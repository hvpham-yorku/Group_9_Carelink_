import type {
  Task,
  MedicationScheduleItemProps,
  Note,
  DashboardData,
} from "../types/Types";

export const mockTasks: Task[] = [
  {
    id: crypto.randomUUID(),
    title: "Sample Task",
    description: "This is a sample task description.",
    category: "General",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Medication Reminder",
    description: "Take blood pressure medication.",
    category: "Medication",
    time: "8:00 AM",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Physical Therapy",
    description: "Attend physical therapy session.",
    category: "Therapy",
    time: "2:00 PM",
    completed: false,
  },
];

export const medicationTasks: MedicationScheduleItemProps[] = [];

export const notes: Note[] = [];

// export const patientInfo: Task[] = [];

export const dashboardData: DashboardData = {
  stats: [],
  recentActivities: [],
  medications: [],
  appointments: [],
};
