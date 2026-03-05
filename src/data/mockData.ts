import type {
  Task,
  MedicationScheduleItemProps,
  Note,
  DashboardData,
  CaregiverInfo,
  PatientInfo,
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

export const teamMembers: CaregiverInfo[] = [
  {
    id: "cg-1",
    firstName: "Jennifer",
    lastName: "Chen",
    phone: "(555) 111-2233",
    email: "jennifer.chen@carelink.local",
    jobTitle: "Registered Nurse",
  },
  {
    id: "cg-2",
    firstName: "Marco",
    lastName: "Lopez",
    phone: "(555) 222-3344",
    email: "marco.lopez@carelink.local",
    jobTitle: "Personal Support Worker",
  },
  {
    id: "cg-3",
    firstName: "Sara",
    lastName: "Patel",
    phone: "(555) 333-4455",
    email: "sara.patel@carelink.local",
    jobTitle: "Care Coordinator",
  },
];

export const teamPatients: PatientInfo[] = [
  {
    id: "pt-1",
    firstName: "Margaret",
    lastName: "Chen",
    dob: "1948-10-14",
    address: "42 Maple Street, Toronto, ON",
    phone: "(555) 987-6543",
  },
  {
    id: "pt-2",
    firstName: "Ali",
    lastName: "Rahman",
    dob: "1952-06-21",
    address: "18 Cedar Avenue, Toronto, ON",
    phone: "(555) 654-3388",
  },
];
