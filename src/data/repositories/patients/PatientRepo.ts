import type {
  PatientInfo,
  PatientBasicInfo,
  PatientContactInfo,
  PatientMedicalInfo,
  PatientEmergencyContact,
  PatientInsuranceInfo,
} from "../../../types/patient";

export interface PatientRepo {
  getPatientDetails(patientId: string): Promise<PatientInfo>;

  // update patient fields
  updatePatientBasicInfo(
    patientId: string,
    updates: Partial<PatientBasicInfo>,
  ): Promise<PatientInfo>;
  updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<PatientInfo>;
  updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<PatientInfo>;
  updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<PatientInfo>;
  updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<PatientInfo>;
  /*
  updatePatientPhysicianInfo(
    patientId: string,
    physicianInfo: Partial<PatientPhysicianInfo>,
  ): Promise<PatientInfo>;
    */
}
