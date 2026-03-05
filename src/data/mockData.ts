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
    time: "10:00",
    completedAt: "3/1/2024, 10:00:00 AM",
    completedBy: "Jose Urbina",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Medication Reminder",
    description: "Take blood pressure medication.",
    category: "Medication",
    time: "08:00",
    completedAt: "3/4/2024, 8:00:00 AM",
    completedBy: "Jose Urbina",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Physical Therapy",
    description: "Attend physical therapy session.",
    category: "Therapy",
    time: "14:00",
    completedAt: "3/4/2024, 2:00:00 PM",
    completedBy: "Jose Urbina",
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
