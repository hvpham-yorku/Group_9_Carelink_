export interface MedicationLog {
  medicationLogId?: string;
  medicationId?: string;
  caregiverId: string;
  firstName: string;
  lastName: string;
  takenAt: string;
  isCompleted: boolean;
  scheduledTime: string;
}

export interface Medication {
  medicationId: string;
  careTeamId?: string;
  patientId?: string;
  name?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  purpose?: string | null;
  instructions?: string | null;
  prescribedBy?: string | null;
  warnings?: string | null;
  isActive?: boolean;

  // supabase joins
  scheduledAt?: string[];

  // single log used by schedule row UI
  medicationLog?: MedicationLog;

  // all logs for this medication
  medicationLogs?: MedicationLog[];
}