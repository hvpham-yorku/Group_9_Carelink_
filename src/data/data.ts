import type { PatientInfo, CaregiverInfo, CaregiverTeam } from "../types/teams";

// patient ids
const patientId1 = crypto.randomUUID();
const patientId2 = crypto.randomUUID();

// caregiver ids
const caregiverId1 = crypto.randomUUID();
const caregiverId2 = crypto.randomUUID();
const caregiverId3 = crypto.randomUUID();

// care team id
const careTeamId1 = crypto.randomUUID();

export let teamPatients: PatientInfo[] = [
  {
    patientId: patientId1,
    firstName: "John",
    lastName: "Doe",
    dob: "1950-01-01",
    address: "123 Main St, Anytown, USA",
    phoneNumber: "(555) 123-4567",
    email: "testpatient1@example.com",
  },
  {
    patientId: patientId2,
    firstName: "Jane",
    lastName: "Smith",
    dob: "1945-05-15",
    address: "456 Elm St, Othertown, USA",
    phoneNumber: "(555) 987-6543",
    email: "testpatient2@example.com",
    gender: "Female",
    bloodType: "O+",
    height: "165 cm",
    weight: "60 kg",
    allergies: ["Peanuts"],
    conditions: ["Hypertension"], // database doesnt have this field yet -----------------------------
    emergencyContactName: "Mary Smith",
    emergencyContactPhone: "(555) 123-4567",
    emergencyContactRelationship: "Daughter",
    insuranceProvider: "HealthCare Inc.",
    insurancePolicyNumber: "HC123456789",
    careNotes: "Patient requires daily monitoring for blood pressure.", // database doesnt have this field yet -----------------------------
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
