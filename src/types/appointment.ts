export interface AppointmentRecord {
  appointmentId: string;
  teamId: string;
  caregiverId: string;
  patientId: string;
  title: string | null;
  scheduledAt: string;
  description: string | null;
  location: string | null;
  createdAt: string | null;
  completedAt: string | null;
  isCompleted: boolean | null;
  caregivers?: {
    firstName?: string;
    lastName?: string;
  } | null;
}
