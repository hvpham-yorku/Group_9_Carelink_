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
    completedAt: new Date().toLocaleString(),
    completedBy: "Jose Urbina",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Medication Reminder",
    description: "Take blood pressure medication.",
    category: "Medication",
    time: "08:00",
    completedAt: new Date().toLocaleString(),
    completedBy: "Jose Urbina",
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Physical Therapy",
    description: "Attend physical therapy session.",
    category: "Therapy",
    time: "14:00",
    completedAt: new Date().toLocaleString(),
    completedBy: "Jose Urbina",
    completed: false,
  },
];

export const medicationTasks: MedicationScheduleItemProps[] = [
  {
    id: crypto.randomUUID(),
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    scheduledAt: "08:00",
    taken: false,
    takenAt: null,
    takenBy: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    scheduledAt: "08:00",
    taken: false,
    takenAt: null,
    takenBy: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    scheduledAt: "20:00",
    taken: false,
    takenAt: null,
    takenBy: null,
  },
];

export const notes: Note[] = [
  {
    id: crypto.randomUUID(),
    title: "Doctor's Visit",
    content: "Visit to Dr. Smith for routine check-up.",
    createdAt: "2024-03-01",
    updatedAt: Date.now(),
    tag: "Medical",
  },
  {
    id: crypto.randomUUID(),
    title: "Mood Update",
    content: "Feeling more energetic today.",
    createdAt: "2024-03-02",
    updatedAt: Date.now(),
    tag: "Mood",
  },
  {
    id: crypto.randomUUID(),
    title: "Dietary Note",
    content: "Started a new low-sodium diet.",
    createdAt: "2024-03-03",
    updatedAt: Date.now(),
    tag: "Nutrition",
  },
];

// export const patientInfo: Task[] = [];

export const dashboardData: DashboardData = {
  stats: [],
  recentActivities: [],
  medications: [],
  appointments: [],
};
