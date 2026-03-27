import type { AppointmentRecord } from "../../../types/appointment";

export interface NewAppointment {
  patientId: string;
  teamId: string;
  caregiverId: string;
  scheduledAt: string;
  title?: string;
  description?: string;
  location?: string;
}

export interface UpdateAppointmentInput {
  scheduledAt?: string;
  title?: string;
  description?: string;
  location?: string;
}

export interface AppRepo {
  getAppointmentsByPatient(patientId: string): Promise<AppointmentRecord[]>;
  addAppointment(appointment: NewAppointment): Promise<AppointmentRecord>;
  updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentInput,
  ): Promise<AppointmentRecord>;
  markAppointmentComplete(appointmentId: string): Promise<AppointmentRecord>;
  markAppointmentIncomplete(appointmentId: string): Promise<AppointmentRecord>;
  deleteAppointment(appointmentId: string): Promise<void>;
}
