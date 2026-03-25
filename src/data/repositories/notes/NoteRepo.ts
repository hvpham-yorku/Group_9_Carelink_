import type { Note } from "../../../types/note";
import type { Category } from "../../../types/teams";

export interface NewNote {
  patientId: string;
  caregiverId: string;
  careTeamId: string;
  title: string | null;
  description: string | null;
  categoryId?: string | null;
  isUrgent?: boolean | null;
}

export interface NoteRepo {
  getNotesByPatient(patientId: string): Promise<Note[]>;
  getCategories(careTeamId: string): Promise<Category[]>;

  addNote(note: NewNote): Promise<Note>;
  updateNote(noteId: string, updates: Partial<NewNote>): Promise<Note>;
  deleteNote(noteId: string): Promise<void>;
}
