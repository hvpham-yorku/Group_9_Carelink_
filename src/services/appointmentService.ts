// src/services/appointmentService.ts
import { supabase } from "../lib/supabase";

export interface AppointmentRecord {
     appointmentId: string;
     careTeamId: string;
     caregiverId: string;
     patientId: string;
     scheduledAt: string;
     description: string | null;
     completedTime: string | null;
     caregivers?: {
          firstName?: string;
          lastName?: string;
     } | null;
}

export interface NewAppointment {
     patientId: string;
     careTeamId: string;
     caregiverId: string;
     scheduledAt: string;
     description?: string;
}

export interface UpdateAppointmentInput {
     scheduledAt?: string;
     description?: string;
}

export const appointmentService = {
     async getAppointmentsByPatient(patientId: string) {
          const { data, error } = await supabase
               .from("appointments")
               .select(`
        *,
        caregivers (
          firstName,
          lastName
        )
      `)
               .eq("patientId", patientId)
               .order("scheduledAt", { ascending: true });

          if (error) throw error;
          return (data ?? []) as AppointmentRecord[];
     },

     async addAppointment(appointment: NewAppointment) {
          const { data, error } = await supabase
               .from("appointments")
               .insert([
                    {
                         patientId: appointment.patientId,
                         careTeamId: appointment.careTeamId,
                         caregiverId: appointment.caregiverId,
                         scheduledAt: appointment.scheduledAt,
                         description: appointment.description?.trim() || null,
                         completedTime: null,
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
               .update({
                    ...payload,
               })
               .eq("appointmentId", appointmentId)
               .select()
               .single();

          if (error) throw error;
          return data as AppointmentRecord;
     },

     async markAppointmentComplete(appointmentId: string) {
          const { data, error } = await supabase
               .from("appointments")
               .update({
                    completedTime: new Date().toISOString(),
               })
               .eq("appointmentId", appointmentId)
               .select()
               .single();

          if (error) throw error;
          return data as AppointmentRecord;
     },

     async markAppointmentIncomplete(appointmentId: string) {
          const { data, error } = await supabase
               .from("appointments")
               .update({
                    completedTime: null,
               })
               .eq("appointmentId", appointmentId)
               .select()
               .single();

          if (error) throw error;
          return data as AppointmentRecord;
     },

     async deleteAppointment(appointmentId: string) {
          const { error } = await supabase
               .from("appointments")
               .delete()
               .eq("appointmentId", appointmentId);

          if (error) throw error;
          return true;
     },
};