// services/medicationService.ts
import { supabase } from "../lib/supabase";

export const medicationService = {
  // Fetch all active prescriptions for a patient, with latest medication log joined
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

  // Mark a dose as taken — inserts a log entry
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

  // Unmark a dose — sets isCompleted to false on the active log row, keeping history
  async unmarkAsTaken(prescriptionId: string) {
    const { error } = await supabase
      .from("medicationLogs")
      .update({ isCompleted: false })
      .eq("prescriptionId", prescriptionId)
      .eq("isCompleted", true);

    if (error) throw error;
    return true;
  },

  // Add a new Prescription
  async addPrescription(prescription: {
    patientId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    instructions?: string;
  }) {
    const { data, error } = await supabase
      .from("prescriptions")
      .insert([prescription])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update dosage, frequency, or instructions
  async updatePrescription(
    prescriptionId: string,
    updates: {
      medicationName?: string;
      dosage?: string;
      frequency?: string;
    },
  ) {
    const { data, error } = await supabase
      .from("prescriptions")
      .update(updates)
      .eq("prescriptionId", prescriptionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Archive/Delete Prescription (Instead of hard delete)
  async archivePrescription(prescriptionId: string) {
    const { error } = await supabase
      .from("prescriptions")
      .update({ isActive: false })
      .eq("prescriptionId", prescriptionId);

    if (error) throw error;
    return true;
  },
};
