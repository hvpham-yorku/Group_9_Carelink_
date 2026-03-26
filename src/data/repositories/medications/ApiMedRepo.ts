import type { NewMedication, MedRepo } from "./MedRepo";
import type { Medication } from "../../../types/medication";
import { supabase } from "../../../lib/supabase";

type MedicationLog = {
  is_completed: boolean | null;
  caregiver_id: string | null;
  taken_at: string | null;
  caregivers?: {
    first_name?: string | null;
    last_name?: string | null;
  };
};

type MedicationSchedule = {
  scheduled_at: string | null;
};

type MedicationRow = {
  medication_id: string;
  team_id?: string | null;
  patient_id: string | null;
  name?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  purpose?: string | null;
  instructions?: string | null;
  prescribed_by?: string | null;
  warnings?: string | null;
  is_active?: boolean | null;
  medication_logs?: MedicationLog[];
  medication_schedule?: MedicationSchedule[];
};

export class ApiMedRepo implements MedRepo {
  private async fetchMedications(
    patientId: string,
    isActive: boolean,
  ): Promise<Medication[]> {
    const { data, error } = await supabase
      .from("medications")
      .select(
        `
        medication_id,
        team_id,
        patient_id,
        name,
        dosage,
        frequency,
        purpose,
        instructions,
        prescribed_by,
        warnings,
        is_active,
        medication_schedule (scheduled_at),
        medication_logs (
          caregiver_id,
          taken_at,
          is_completed,
          caregivers (first_name, last_name)
        )
      `,
      )
      .eq("patient_id", patientId)
      .eq("is_active", isActive)
      .order("name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => this.formatMedication(row, isActive));
  }

  formatMedication = (row: MedicationRow, isActive: boolean): Medication => {
    const activeLog =
      row.medication_logs?.find((l) => l.is_completed === true) ?? null;
    const scheduleTimes =
      row.medication_schedule
        ?.map((s) => s.scheduled_at)
        .filter((t): t is string => t !== null) ?? [];

    return {
      medicationId: row.medication_id,
      careTeamId: row.team_id ?? "",
      patientId: row.patient_id ?? "",
      name: row.name ?? "",
      dosage: row.dosage ?? "",
      frequency: row.frequency ?? "",
      purpose: row.purpose ?? "",
      instructions: row.instructions ?? "",
      prescribedBy: row.prescribed_by ?? "",
      warnings: row.warnings ?? "",
      scheduledAt: scheduleTimes,
      isActive: row.is_active ?? isActive,
      medicationLog: activeLog
        ? {
            caregiverId: activeLog.caregiver_id ?? "",
            takenAt: activeLog.taken_at ?? "",
            isCompleted: true,
            firstName: activeLog.caregivers?.first_name ?? "",
            lastName: activeLog.caregivers?.last_name ?? "",
          }
        : undefined,
    };
  };

  async getMedicationsByPatient(patientId: string): Promise<Medication[]> {
    return this.fetchMedications(patientId, true);
  }

  async getArchivedMedications(patientId: string): Promise<Medication[]> {
    return this.fetchMedications(patientId, false);
  }

  async markAsTaken(medicationId: string, caregiverId: string): Promise<void> {
    const { error } = await supabase.from("medication_logs").insert([
      {
        medication_id: medicationId,
        caregiver_id: caregiverId,
        taken_at: new Date().toISOString(),
        is_completed: true,
      },
    ]);

    if (error) throw error;
  }

  async unmarkAsTaken(medicationId: string): Promise<void> {
    const { error } = await supabase
      .from("medication_logs")
      .update({ is_completed: false })
      .eq("medication_id", medicationId)
      .eq("is_completed", true);

    if (error) throw error;
  }

  async addMedication(newMedication: NewMedication): Promise<Medication> {
    const { data, error } = await supabase
      .from("medications")
      .insert([
        {
          team_id: newMedication.careTeamId,
          patient_id: newMedication.patientId,
          name: newMedication.name,
          dosage: newMedication.dosage,
          frequency: newMedication.frequency,
          purpose: newMedication.purpose ?? null,
          instructions: newMedication.instructions ?? null,
          prescribed_by: newMedication.prescribedBy ?? null,
          warnings: newMedication.warnings ?? null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    const scheduledTimes = newMedication.scheduledAt ?? [];

    if (scheduledTimes.length > 0) {
      const { error: scheduleError } = await supabase
        .from("medication_schedule")
        .insert(
          scheduledTimes.map((time) => ({
            medication_id: data.medication_id,
            scheduled_at: time,
          })),
        );

      if (scheduleError) throw scheduleError;
    }

    return {
      medicationId: data.medication_id,
      careTeamId: data.team_id,
      patientId: data.patient_id,
      name: data.name ?? "",
      dosage: data.dosage ?? "",
      frequency: data.frequency ?? "",
      purpose: data.purpose ?? "",
      instructions: data.instructions ?? "",
      prescribedBy: data.prescribed_by ?? "",
      warnings: data.warnings ?? "",
      scheduledAt: scheduledTimes,
      isActive: data.is_active ?? true,
    };
  }

  async updateMedication(
    medicationId: string,
    updates: Partial<NewMedication>,
  ): Promise<Medication> {
    const { data, error } = await supabase
      .from("medications")
      .update({
        name: updates.name,
        dosage: updates.dosage,
        frequency: updates.frequency,
        purpose: updates.purpose ?? null,
        instructions: updates.instructions ?? null,
        prescribed_by: updates.prescribedBy ?? null,
        warnings: updates.warnings ?? null,
      })
      .eq("medication_id", medicationId)
      .select()
      .single();

    if (error) throw error;

    if (updates.scheduledAt !== undefined) {
      const { error: deleteError } = await supabase
        .from("medication_schedule")
        .delete()
        .eq("medication_id", medicationId);

      if (deleteError) throw deleteError;

      if (updates.scheduledAt.length > 0) {
        const { error: insertError } = await supabase
          .from("medication_schedule")
          .insert(
            updates.scheduledAt.map((time) => ({
              medication_id: medicationId,
              scheduled_at: time,
            })),
          );

        if (insertError) throw insertError;
      }
    }

    return {
      medicationId: data.medication_id,
      careTeamId: data.team_id,
      patientId: data.patient_id,
      name: data.name ?? "",
      dosage: data.dosage ?? "",
      frequency: data.frequency ?? "",
      purpose: data.purpose ?? "",
      instructions: data.instructions ?? "",
      prescribedBy: data.prescribed_by ?? "",
      warnings: data.warnings ?? "",
      scheduledAt: updates.scheduledAt ?? [],
      isActive: data.is_active ?? true,
    };
  }

  async archiveMedication(medicationId: string): Promise<void> {
    const { error } = await supabase
      .from("medications")
      .update({ is_active: false })
      .eq("medication_id", medicationId);

    if (error) throw error;
  }
}
