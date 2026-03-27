import type {
  AllPatientInfo,
  PatientBasicInfo,
  PatientContactInfo,
  PatientMedicalInfo,
  PatientEmergencyContact,
  PatientInsuranceInfo,
  PatientPhysicianInfo,
} from "../../../types/patient";

import type { PatientRepo } from "./PatientRepo";
import { patients } from "../../data";

export class StubPatientRepo implements PatientRepo {
  async getPatientDetails(patientId: string): Promise<AllPatientInfo> {
    const patient = patients.find((p) => p.patientId === patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }

  /**
   * Update Methods for Patient Fields -----------------------------
   */
  async updatePatientBasicInfo(
    patientId: string,
    updates: Partial<PatientBasicInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...updates };
    return updatedPatient;
  }

  async updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...contactInfo };
    return updatedPatient;
  }

  async updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...medicalInfo };
    return updatedPatient;
  }

  async updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...emergencyContactInfo };
    return updatedPatient;
  }

  async updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...insuranceInfo };
    return updatedPatient;
  }

  async updatePatientPhysicianInfo(
    patientId: string,
    physicianInfo: Partial<PatientPhysicianInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    const updatedPatient = { ...patient, ...physicianInfo };
    return updatedPatient;
  }
}
