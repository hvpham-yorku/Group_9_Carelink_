import type {
  AllPatientInfo,
  PatientContactInfo,
  PatientMedicalInfo,
  PatientConditions,
  PatientEmergencyContact,
  PatientInsuranceInfo,
  PatientPhysicianInfo,
  PatientNotesInfo,
} from "../../../types/patient";

export interface PatientRepo {
  getPatientDetails(patientId: string): Promise<AllPatientInfo>;

  updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<AllPatientInfo>;

  updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<AllPatientInfo>;

  updatePatientConditions(
    patientId: string,
    conditions: Partial<PatientConditions>,
  ): Promise<AllPatientInfo>;

  updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<AllPatientInfo>;

  updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<AllPatientInfo>;

  updatePatientPhysicianInfo(
    patientId: string,
    physicianInfo: Partial<PatientPhysicianInfo>,
  ): Promise<AllPatientInfo>;

  updatePatientNotes(
    patientId: string,
    notesInfo: Partial<PatientNotesInfo>,
  ): Promise<AllPatientInfo>;
}