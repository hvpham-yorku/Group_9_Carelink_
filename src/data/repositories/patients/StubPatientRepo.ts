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

  async updatePatientContactInfo(
    patientId: string,
    contactInfo: Partial<PatientContactInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...contactInfo };
  }

  async updatePatientMedicalInfo(
    patientId: string,
    medicalInfo: Partial<PatientMedicalInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...medicalInfo };
  }

  async updatePatientConditions(
    patientId: string,
    conditions: Partial<PatientConditions>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...conditions };
  }

  async updatePatientEmergencyContact(
    patientId: string,
    emergencyContactInfo: Partial<PatientEmergencyContact>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...emergencyContactInfo };
  }

  async updatePatientInsuranceInfo(
    patientId: string,
    insuranceInfo: Partial<PatientInsuranceInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...insuranceInfo };
  }

  async updatePatientPhysicianInfo(
    patientId: string,
    physicianInfo: Partial<PatientPhysicianInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...physicianInfo };
  }

  async updatePatientNotes(
    patientId: string,
    notesInfo: Partial<PatientNotesInfo>,
  ): Promise<AllPatientInfo> {
    const patient = await this.getPatientDetails(patientId);
    return { ...patient, ...notesInfo };
  }
}