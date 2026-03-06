// services/medicationService.ts
import { supabase } from "../lib/supabase";

export const medicationService = {
  // Fetch all active prescriptions for a patient
  async getPrescriptionsByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*")
      .eq("patientId", patientId)
      .eq("isActive", true)
      .order("name", { ascending: true }); // Alphabetical order

    if (error) throw error;
    return data;
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

  // Log a Dose (mark as taken)
  async logMedication(log: { prescriptionId: string; caregiverId: string }) {
    // Insert record into medicationLogs
    const { data: logData, error: logError } = await supabase
      .from("medicationLogs")
      .insert([log])
      .select(
        `
      *,
      caregivers (firstName, lastName)
    `,
      )
      .single();

    if (logError) throw logError;

    // Update the prescription to mark it as completed
    const { error: updateError } = await supabase
      .from("prescriptions")
      .update({ isCompleted: true }) // Your new status flag
      .eq("prescriptionId", log.prescriptionId);

    if (updateError) throw updateError;

    return logData;
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
