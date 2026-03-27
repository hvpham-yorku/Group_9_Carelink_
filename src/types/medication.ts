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

  // supabase join for medications and medicationLogs
  medicationLog?: {
    caregiverId: string;
    firstName: string;
    lastName: string;
    takenAt: string;
    isCompleted: boolean;
  };
}
