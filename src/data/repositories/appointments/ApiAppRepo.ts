import type {
  AppRepo,
  NewAppointment,
  UpdateAppointmentInput,
} from "./AppRepo";
import type { AppointmentRecord } from "../../../types/appointment";
import { supabase } from "../../../lib/supabase";

type RawAppointment = Record<string, unknown> & {
  caregivers?: { first_name?: string; last_name?: string } | null;
};

function mapRecord(item: RawAppointment): AppointmentRecord {
  return {
    appointmentId: item.appointment_id as string,
    teamId: item.team_id as string,
    caregiverId: item.caregiver_id as string,
    patientId: item.patient_id as string,
    title: (item.title as string | null) ?? null,
    scheduledAt: item.scheduled_at as string,
    description: (item.description as string | null) ?? null,
    location: (item.location as string | null) ?? null,
    createdAt: (item.created_at as string | null) ?? null,
    completedAt: (item.completed_at as string | null) ?? null,
    isCompleted: (item.is_completed as boolean | null) ?? null,
    caregivers: item.caregivers
      ? {
          firstName: item.caregivers.first_name,
          lastName: item.caregivers.last_name,
        }
      : null,
  };
}

export class ApiAppRepo implements AppRepo {
  async getAppointmentsByPatient(
    patientId: string,
  ): Promise<AppointmentRecord[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select(`*, caregivers (first_name, last_name)`)
      .eq("patient_id", patientId)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((item) => mapRecord(item as RawAppointment));
  }

  async addAppointment(
    appointment: NewAppointment,
  ): Promise<AppointmentRecord> {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_id: appointment.patientId,
          team_id: appointment.teamId,
          caregiver_id: appointment.caregiverId,
          scheduled_at: appointment.scheduledAt,
          title: appointment.title?.trim() || null,
          description: appointment.description?.trim() || null,
          location: appointment.location?.trim() || null,
          completed_at: null,
          is_completed: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return mapRecord(data as RawAppointment);
  }

  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentInput,
  ): Promise<AppointmentRecord> {
    const payload: Record<string, unknown> = {};
    if (updates.scheduledAt !== undefined)
      payload.scheduled_at = updates.scheduledAt;
    if (updates.title !== undefined)
      payload.title = updates.title?.trim() || null;
    if (updates.description !== undefined)
      payload.description = updates.description.trim();
    if (updates.location !== undefined)
      payload.location = updates.location?.trim() || null;

    const { data, error } = await supabase
      .from("appointments")
      .update(payload)
      .eq("appointment_id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return mapRecord(data as RawAppointment);
  }

  async markAppointmentComplete(
    appointmentId: string,
  ): Promise<AppointmentRecord> {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        completed_at: new Date().toISOString(),
        is_completed: true,
      })
      .eq("appointment_id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return mapRecord(data as RawAppointment);
  }

  async markAppointmentIncomplete(
    appointmentId: string,
  ): Promise<AppointmentRecord> {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        completed_at: null,
        is_completed: false,
      })
      .eq("appointment_id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return mapRecord(data as RawAppointment);
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointment_id", appointmentId);

    if (error) throw error;
  }
}
