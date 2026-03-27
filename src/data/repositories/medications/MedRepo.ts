import type { Medication } from "../../../types/medication";

export interface NewMedication {
  patientId: string;
  careTeamId: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose?: string;
  instructions?: string;
  prescribedBy?: string;
  warnings?: string;

  scheduledAt?: string[];
}

export interface MedRepo {
  getMedicationsByPatient(patientId: string): Promise<Medication[]>;
  getArchivedMedications(patientId: string): Promise<Medication[]>;
  markAsTaken(medicationId: string, caregiverId: string): Promise<void>;
  unmarkAsTaken(medicationId: string): Promise<void>;

  addMedication(newMedication: NewMedication): Promise<Medication>;
  updateMedication(
    medicationId: string,
    updates: Partial<NewMedication>,
  ): Promise<Medication>;
  archiveMedication(medicationId: string): Promise<void>;
}
