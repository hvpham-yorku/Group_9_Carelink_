import type {
  PatientInfo,
  CaregiverInfo,
  CaregiverTeam,
  Category,
} from "../types/teams";

import type { AllPatientInfo } from "../types/patient";
import type { Note } from "../types/note";
import type { Task, TaskLogEntry } from "../types/task";
import type { Medication } from "../types/medication";

// patient ids
const patientId1 = crypto.randomUUID();
const patientId2 = crypto.randomUUID();

// caregiver ids
const caregiverId1 = crypto.randomUUID();
const caregiverId2 = crypto.randomUUID();
const caregiverId3 = crypto.randomUUID();

// care team id
const careTeamId1 = crypto.randomUUID();

// category ids
const categoryId1 = crypto.randomUUID();
const categoryId2 = crypto.randomUUID();

/*
  Team Related Data
*/

export let teamPatients: PatientInfo[] = [
  {
    patientId: patientId1,
    firstName: "John",
    lastName: "Doe",
    dob: "1950-01-01",
    gender: "Male",
    bloodType: "A+",
  },
  {
    patientId: patientId2,
    firstName: "Jane",
    lastName: "Smith",
    dob: "1945-05-15",
    gender: "Female",
    bloodType: "O+",
  },
];

export let teamCaregivers: CaregiverInfo[] = [
  {
    caregiverId: caregiverId1,
    firstName: "Alice",
    lastName: "Johnson",
    phoneNumber: "(555) 234-5678",
    email: "testcaregiver1@example.com",
    jobTitle: "Registered Nurse",
    teamRole: "Primary Caregiver",
    teamDateAssigned: new Date().toISOString(),
  },
  {
    caregiverId: caregiverId2,
    firstName: "Bob",
    lastName: "Williams",
    phoneNumber: "(555) 345-6789",
    email: "testcaregiver2@example.com",
    jobTitle: "Licensed Practical Nurse",
    teamRole: "Secondary Caregiver",
    teamDateAssigned: new Date().toISOString(),
  },
  {
    caregiverId: caregiverId3,
    firstName: "Carol",
    lastName: "Brown",
    phoneNumber: "(555) 456-7890",
    email: "testcaregiver3@example.com",
    jobTitle: "Personal Support Worker",
    teamRole: "Support Worker",
    teamDateAssigned: new Date().toISOString(),
  },
];

export let careTeams: CaregiverTeam[] = [
  {
    careTeamId: careTeamId1,
    caregivers: teamCaregivers,
    patients: teamPatients,
    teamName: "Stub Team 1",
    joinCode: "TEST1234",
  },
];

export let categories: Category[] = [
  {
    categoryId: categoryId1,
    name: "Medication",
    color: "text-bg-primary",
  },
  {
    categoryId: categoryId2,
    name: "Appointments",
    color: "text-bg-success",
  },
];

/*
  Task Related Data
*/

export let tasks: Task[] = [
  {
    taskId: crypto.randomUUID(),
    patientId: patientId1,
    title: "Take Medication",
    description: "Take prescribed medication at the scheduled time.",
    categories: { name: "Medication", color: "text-bg-primary" },
    scheduledAt: new Date().toISOString(),
  },
  {
    taskId: crypto.randomUUID(),
    patientId: patientId1,
    title: "Doctor's Appointment",
    description: "Visit Dr. Smith for a routine check-up.",
    categories: { name: "Appointments", color: "text-bg-success" },
    scheduledAt: new Date().toISOString(),
  },
  {
    taskId: crypto.randomUUID(),
    patientId: patientId2,
    title: "Take Blood Pressure",
    description: "Measure blood pressure daily and log the readings.",
    categories: { name: "Medication", color: "text-bg-primary" },
    scheduledAt: new Date().toISOString(),
  },
  {
    taskId: crypto.randomUUID(),
    patientId: patientId2,
    title: "Physical Therapy",
    description: "Attend physical therapy sessions twice a week.",
    categories: { name: "Appointments", color: "text-bg-success" },
    scheduledAt: new Date().toISOString(),
  },
];

export let taskLogs: TaskLogEntry[] = [
  {
    taskId: tasks[0].taskId,
    caregiverId: caregiverId1,
    completedAt: new Date().toISOString(),
    isCompleted: true,
    caregivers: { firstName: "Alice", lastName: "Johnson" },
  },
  {
    taskId: tasks[2].taskId,
    caregiverId: caregiverId2,
    completedAt: new Date().toISOString(),
    isCompleted: true,
    caregivers: { firstName: "Bob", lastName: "Williams" },
  },
];

/*
  Patient Related Data
*/
export let patients: AllPatientInfo[] = [
  {
    patientId: patientId1,
    firstName: "John",
    lastName: "Doe",
    dob: "1950-01-01",
    gender: "Male",
    bloodType: "A+",
    height: "180 cm",
    weight: "80 kg",
    allergies: ["Penicillin"],
    conditions: ["Diabetes"],
    emergencyContactName: "Mary Doe",
    emergencyContactPhone: "(555) 123-4567",
    emergencyContactRelationship: "Spouse",
    insuranceProvider: "HealthCare Inc.",
    insurancePolicyNumber: "HC123456789",
  },
  {
    patientId: patientId2,
    firstName: "Jane",
    lastName: "Smith",
    dob: "1945-05-15",
    gender: "Female",
    bloodType: "O+",
    height: "165 cm",
    weight: "60 kg",
    allergies: ["Peanuts"],
    conditions: ["Hypertension"],
    emergencyContactName: "Mary Smith",
    emergencyContactPhone: "(555) 123-4567",
    emergencyContactRelationship: "Daughter",
    insuranceProvider: "HealthCare Inc.",
    insurancePolicyNumber: "HC123456789",
  },
];

/*
  Note Related Data
*/
export let notes: Note[] = [
  {
    noteId: crypto.randomUUID(),
    patientId: patientId1,
    caregiverId: caregiverId1,
    careTeamId: careTeamId1,
    categoryId: categoryId1,
    title: "Medication Reminder",
    description: "Reminder to take morning medication.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUrgent: false,
    categories: { name: "Medication", color: "text-bg-primary" },
    caregivers: { firstName: "Alice", lastName: "Johnson" },
  },
  {
    noteId: crypto.randomUUID(),
    patientId: patientId2,
    caregiverId: caregiverId2,
    careTeamId: careTeamId1,
    categoryId: categoryId2,
    title: "Appointment Reminder",
    description: "Reminder for upcoming doctor's appointment.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isUrgent: true,
    categories: { name: "Appointments", color: "text-bg-success" },
    caregivers: { firstName: "Bob", lastName: "Williams" },
  },
];

/*
  Medication Related Data
*/

export let medications: Medication[] = [
  {
    medicationId: crypto.randomUUID(),
    careTeamId: careTeamId1,
    patientId: patientId1,
    name: "Metformin",
    dosage: "500 mg",
    frequency: "Twice a day",
    purpose: "Manage blood sugar levels",
    instructions: "Take with meals",
    prescribedBy: "Dr. Smith",
    warnings: "May cause dizziness",
    isActive: true,
    scheduledAt: [new Date().toISOString()],
  },
  {
    medicationId: crypto.randomUUID(),
    careTeamId: careTeamId1,
    patientId: patientId2,
    name: "Lisinopril",
    dosage: "10 mg",
    frequency: "Once a day",
    purpose: "Manage blood pressure",
    instructions: "Take in the morning",
    prescribedBy: "Dr. Johnson",
    warnings: "May cause dizziness",
    isActive: true,
    scheduledAt: [new Date().toISOString()],
  },
  {
    medicationId: crypto.randomUUID(),
    careTeamId: careTeamId1,
    patientId: patientId1,
    name: "Aspirin",
    dosage: "100 mg",
    frequency: "Once a day",
    purpose: "Prevent blood clots",
    instructions: "Take with water",
    prescribedBy: "Dr. Brown",
    warnings: "May cause stomach upset",
    isActive: false,
    scheduledAt: [new Date().toISOString()],
  },
];
