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
