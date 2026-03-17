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
  teamName: string; // new field ------------------------------
  joinCode: string;
}
