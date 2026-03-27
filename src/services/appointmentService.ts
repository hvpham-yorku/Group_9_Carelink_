// src/services/appointmentService.ts
import { supabase } from "../lib/supabase";

export interface AppointmentRecord {
  appointment_id: string;
  team_id: string;
  caregiver_id: string;
  patient_id: string;
  title: string | null;
  scheduled_at: string;
  description: string | null;
  location: string | null;
  created_at: string | null;
  completed_at: string | null;
  is_completed: boolean | null;
  caregivers?: {
    first_name?: string;
    last_name?: string;
  } | null;
}

export interface NewAppointment {
  patient_id: string;
  team_id: string;
  caregiver_id: string;
  scheduled_at: string;
  title?: string;
  description?: string;
  location?: string;
}

export interface UpdateAppointmentInput {
  scheduled_at?: string;
  title?: string;
  description?: string;
  location?: string;
}

export const appointmentService = {
  async getAppointmentsByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        caregivers (
          first_name,
          last_name
        )
      `,
      )
      .eq("patient_id", patientId)
      .order("scheduled_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as AppointmentRecord[];
  },

  async addAppointment(appointment: NewAppointment) {
    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          patient_id: appointment.patient_id,
          team_id: appointment.team_id,
          caregiver_id: appointment.caregiver_id,
          scheduled_at: appointment.scheduled_at,
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
    return data as AppointmentRecord;
  },

  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentInput,
  ) {
    const payload: UpdateAppointmentInput = {
      ...updates,
      description:
        typeof updates.description === "string"
          ? updates.description.trim() || ""
          : updates.description,
    };

    const { data, error } = await supabase
      .from("appointments")
      .update({ ...payload })
      .eq("appointment_id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data as AppointmentRecord;
  },

  async markAppointmentComplete(appointmentId: string) {
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
    return data as AppointmentRecord;
  },

  async markAppointmentIncomplete(appointmentId: string) {
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
    return data as AppointmentRecord;
  },

  async deleteAppointment(appointmentId: string) {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("appointment_id", appointmentId);

    if (error) throw error;
    return true;
  },
};
