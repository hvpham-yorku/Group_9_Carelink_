export type NoteCategory = {
  categoryId: string;
  name: string;
};

export type Caregiver = {
  firstName: string;
  lastName: string;
};

export type Note = {
  noteId: string;
  title: string;
  description: string;
  categoryId: string;
  createdAt: string;
  isUrgent?: boolean;
  patientId?: string;
  caregiverId?: string;
  careTeamId?: string;
  categories?: NoteCategory | null;
  caregivers?: Caregiver | null;
};