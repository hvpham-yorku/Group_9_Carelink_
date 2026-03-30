import type { NewMedication, MedRepo } from "./MedRepo";
import type { Medication, MedicationLog } from "../../../types/medication";
import { supabase } from "../../../lib/supabase";

type MedicationLogRow = {
  medication_log_id?: string | null;
  medication_id?: string | null;
  scheduled_time?: string | null;
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
  medication_logs?: MedicationLogRow[];
  medication_schedule?: MedicationSchedule[];
};

const normalizeTime = (time: string) => {
  if (!time) return "";

  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;

  const date = new Date(time);
  if (!Number.isNaN(date.getTime())) {
    return date.toTimeString().split(" ")[0];
  }

  return time;
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
          medication_log_id,
          medication_id,
          scheduled_time,
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
    const scheduleTimes =
      row.medication_schedule
        ?.map((s) => s.scheduled_at)
        .filter((t): t is string => t !== null)
        .map((t) => normalizeTime(t)) ?? [];

    const medicationLogs: MedicationLog[] =
      row.medication_logs
        ?.filter((log) => log.scheduled_time !== null)
        .map((log) => ({
          medicationLogId: log.medication_log_id ?? "",
          medicationId: log.medication_id ?? "",
          caregiverId: log.caregiver_id ?? "",
          takenAt: log.taken_at ?? "",
          isCompleted: !!log.is_completed,
          scheduledTime: normalizeTime(log.scheduled_time ?? ""),
          firstName: log.caregivers?.first_name ?? "",
          lastName: log.caregivers?.last_name ?? "",
        })) ?? [];

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
      medicationLogs,
    };
  };

  async getMedicationsByPatient(patientId: string): Promise<Medication[]> {
    return this.fetchMedications(patientId, true);
  }

  async getArchivedMedications(patientId: string): Promise<Medication[]> {
    return this.fetchMedications(patientId, false);
  }

  async markAsTaken(
    medicationId: string,
    scheduledTime: string,
    caregiverId: string,
  ): Promise<void> {
    const normalizedTime = normalizeTime(scheduledTime);

    const { data: existingLog, error: fetchError } = await supabase
      .from("medication_logs")
      .select("medication_log_id")
      .eq("medication_id", medicationId)
      .eq("scheduled_time", normalizedTime)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingLog) {
      const { error } = await supabase
        .from("medication_logs")
        .update({
          caregiver_id: caregiverId,
          taken_at: new Date().toISOString(),
          is_completed: true,
        })
        .eq("medication_log_id", existingLog.medication_log_id);

      if (error) throw error;
      return;
    }

    const { error } = await supabase.from("medication_logs").insert([
      {
        medication_id: medicationId,
        scheduled_time: normalizedTime,
        caregiver_id: caregiverId,
        taken_at: new Date().toISOString(),
        is_completed: true,
      },
    ]);

    if (error) throw error;
  }

  async unmarkAsTaken(
    medicationId: string,
    scheduledTime: string,
  ): Promise<void> {
    const normalizedTime = normalizeTime(scheduledTime);

    const { error } = await supabase
      .from("medication_logs")
      .update({
        is_completed: false,
        taken_at: null,
      })
      .eq("medication_id", medicationId)
      .eq("scheduled_time", normalizedTime);

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

    const scheduledTimes = (newMedication.scheduledAt ?? []).map((time) =>
      normalizeTime(time),
    );

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
      medicationLogs: [],
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

    let updatedScheduleTimes: string[] = [];

    if (updates.scheduledAt !== undefined) {
      updatedScheduleTimes = updates.scheduledAt.map((time) =>
        normalizeTime(time),
      );

      const { error: deleteError } = await supabase
        .from("medication_schedule")
        .delete()
        .eq("medication_id", medicationId);

      if (deleteError) throw deleteError;

      if (updatedScheduleTimes.length > 0) {
        const { error: insertError } = await supabase
          .from("medication_schedule")
          .insert(
            updatedScheduleTimes.map((time) => ({
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
      scheduledAt: updates.scheduledAt
        ? updates.scheduledAt.map((time) => normalizeTime(time))
        : updatedScheduleTimes,
      isActive: data.is_active ?? true,
      medicationLogs: [],
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
