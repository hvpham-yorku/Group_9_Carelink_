export interface PatientContactInfo {
  patientId: string;
  firstName?: string;
  lastName?: string;
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface PatientMedicalInfo {
  dob?: string;
  gender?: string;
  bloodType?: string | null;
  height?: string | null;
  weight?: string | null;
  dietaryRequirements?: string | null;

  allergies?: string[];
}

export interface PatientConditions {
  conditions?: string[];
}

export interface PatientEmergencyContact {
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
}

export interface PatientPhysicianInfo {
  physicianName?: string | null;
  physicianSpecialty?: string | null;
  physicianPhone?: string | null;
  physicianAddress?: string | null;
}

export interface PatientInsuranceInfo {
  insuranceProvider?: string | null;
  insurancePolicyNumber?: string | null;
  groupNumber?: string | null;
}

// Full patient composed from all sections
export type AllPatientInfo = PatientContactInfo &
  PatientMedicalInfo &
  PatientConditions &
  PatientEmergencyContact &
  PatientPhysicianInfo &
  PatientInsuranceInfo;
