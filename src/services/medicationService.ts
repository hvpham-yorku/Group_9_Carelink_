// services/medicationService.ts
import { supabase } from "../lib/supabase";

export const medicationService = {
  // Fetch all active prescriptions for a patient, with medication logs joined
  async getPrescriptionsByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("prescriptions")
      .select(
        `
        *,
        medicationLogs (
          caregiverId,
          takenAt,
          isCompleted,
          caregivers (firstName, lastName)
        )
      `,
      )
      .eq("patientId", patientId)
      .eq("isActive", true)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Mark a dose as taken by inserting a log entry
  async markAsTaken(prescriptionId: string, caregiverId: string) {
    const { data, error } = await supabase
      .from("medicationLogs")
      .insert([
        {
          prescriptionId,
          caregiverId,
          takenAt: new Date().toISOString(),
          isCompleted: true,
        },
      ])
      .select(
        `
        *,
        caregivers (firstName, lastName)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Unmark a dose by setting active completed logs to false
  async unmarkAsTaken(prescriptionId: string) {
    const { error } = await supabase
      .from("medicationLogs")
      .update({ isCompleted: false })
      .eq("prescriptionId", prescriptionId)
      .eq("isCompleted", true);

    if (error) throw error;
    return true;
  },

  // Add a new prescription
  async addPrescription(prescription: {
    patientId: string;
    careTeamId: string;
    name: string;
    dosage: string;
    frequency: string;
    scheduledAt?: string;
  }) {
    const { data, error } = await supabase
      .from("prescriptions")
      .insert([
        {
          patientId: prescription.patientId,
          careTeamId: prescription.careTeamId,
          name: prescription.name,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          scheduledAt: prescription.scheduledAt || null,
          isActive: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing prescription
  async updatePrescription(
    prescriptionId: string,
    updates: {
      name?: string;
      dosage?: string;
      frequency?: string;
      scheduledAt?: string;
    },
  ) {
    const { data, error } = await supabase
      .from("prescriptions")
      .update({
        ...updates,
        scheduledAt: updates.scheduledAt || null,
      })
      .eq("prescriptionId", prescriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Archive prescription instead of deleting it
  async archivePrescription(prescriptionId: string) {
    const { error } = await supabase
      .from("prescriptions")
      .update({ isActive: false })
      .eq("prescriptionId", prescriptionId);

    if (error) throw error;
    return true;
  },
};