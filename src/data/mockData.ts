import type { Task } from "../types/Types";

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task description.",
    category: "General",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "2",
    title: "Medication Reminder",
    description: "Take blood pressure medication.",
    category: "Medication",
    time: "8:00 AM",
    completed: false,
  },
  {
    id: "3",
    title: "Physical Therapy",
    description: "Attend physical therapy session.",
    category: "Therapy",
    time: "2:00 PM",
    completed: false,
  },
];

// export const medicationTasks: Task[] = [];

// export const notes: Task[] = [];

// export const patientInfo: Task[] = [];
