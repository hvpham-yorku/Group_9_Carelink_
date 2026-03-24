export interface PatientBasicInfo {
  patientId: string;
  firstName: string;
  lastName: string;
  dob?: string;
  gender?: string;
}

export interface PatientContactInfo {
  address?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface PatientMedicalInfo {
  bloodType?: string | null;
  height?: string | null;
  weight?: string | null;
  allergies?: string[] | null;
  conditions?: string[] | null;
}

export interface PatientEmergencyContact {
  emergencyContactName?: string | null;
  emergencyContactEmail?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelationship?: string | null;
}

export interface PatientPhysicianInfo {
  physicianName?: string | null;
  physicianPhone?: string | null;
  physicianAddress?: string | null;
}

export interface PatientInsuranceInfo {
  insuranceProvider?: string | null;
  insurancePolicyNumber?: string | null;
}

// Full patient composed from all sections
export type PatientInfo = PatientBasicInfo &
  PatientContactInfo &
  PatientMedicalInfo &
  PatientEmergencyContact &
  PatientPhysicianInfo &
  PatientInsuranceInfo;
