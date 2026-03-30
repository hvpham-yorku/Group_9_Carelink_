import type { MedRepo, NewMedication } from "./MedRepo";
import type { Medication, MedicationLog } from "../../../types/medication";

import { medications, teamCaregivers } from "../../data";

export class StubMedRepo implements MedRepo {
  async getMedicationsByPatient(patientId: string): Promise<Medication[]> {
    return medications.filter(
      (med) => med.patientId === patientId && med.isActive,
    );
  }

  async getArchivedMedications(patientId: string): Promise<Medication[]> {
    return medications.filter(
      (med) => med.patientId === patientId && !med.isActive,
    );
  }

  async markAsTaken(
    medicationId: string,
    scheduledTime: string,
    caregiverId: string,
  ): Promise<void> {
    const medIndex = medications.findIndex(
      (m) => m.medicationId === medicationId,
    );
    if (medIndex === -1) throw new Error("Medication not found");

    const caregiver = teamCaregivers.find((c) => c.caregiverId === caregiverId);

    const newLog: MedicationLog = {
      caregiverId,
      firstName: caregiver?.firstName ?? "",
      lastName: caregiver?.lastName ?? "",
      takenAt: new Date().toISOString(),
      isCompleted: true,
      scheduledTime,
    };

    const existingLogs = medications[medIndex].medicationLogs ?? [];
    const existingIndex = existingLogs.findIndex(
      (log) => log.scheduledTime === scheduledTime,
    );

    if (existingIndex >= 0) {
      existingLogs[existingIndex] = newLog;
    } else {
      existingLogs.push(newLog);
    }

    medications[medIndex].medicationLogs = existingLogs;
  }

  async unmarkAsTaken(
    medicationId: string,
    scheduledTime: string,
  ): Promise<void> {
    const medIndex = medications.findIndex(
      (m) => m.medicationId === medicationId,
    );
    if (medIndex === -1) throw new Error("Medication not found");

    medications[medIndex].medicationLogs =
      medications[medIndex].medicationLogs?.filter(
        (log) => log.scheduledTime !== scheduledTime,
      ) ?? [];
  }

  async addMedication(newMedication: NewMedication): Promise<Medication> {
    const medication: Medication = {
      medicationId: crypto.randomUUID(),
      careTeamId: newMedication.careTeamId,
      patientId: newMedication.patientId,
      name: newMedication.name,
      dosage: newMedication.dosage,
      frequency: newMedication.frequency,
      purpose: newMedication.purpose,
      instructions: newMedication.instructions,
      prescribedBy: newMedication.prescribedBy,
      warnings: newMedication.warnings,
      scheduledAt: newMedication.scheduledAt ?? [],
      isActive: true,
      medicationLogs: [],
    };

    medications.push(medication);
    return medication;
  }

  async updateMedication(
    medicationId: string,
    updates: Partial<NewMedication>,
  ): Promise<Medication> {
    const medIndex = medications.findIndex(
      (m) => m.medicationId === medicationId,
    );
    if (medIndex === -1) throw new Error("Medication not found");

    const updatedMedication = {
      ...medications[medIndex],
      ...updates,
    };

    medications[medIndex] = updatedMedication;
    return updatedMedication;
  }

  async archiveMedication(medicationId: string): Promise<void> {
    const medIndex = medications.findIndex(
      (m) => m.medicationId === medicationId,
    );
    if (medIndex === -1) throw new Error("Medication not found");
    medications[medIndex].isActive = false;
  }
}