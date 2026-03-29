export interface Note {
  noteId: string;
  caregiverId?: string;
  careTeamId?: string;
  patientId?: string;
  categoryId: string;
  title: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  isUrgent?: boolean | null;
  categories?: { name: string; color?: string } | null;
  caregivers?: { firstName: string; lastName: string } | null;
}
