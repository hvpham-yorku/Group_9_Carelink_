import type { Note } from "../../../types/note";
import type { Category } from "../../../types/teams";
import { supabase } from "../../../lib/supabase";
import type { NoteRepo, NewNote } from "./NoteRepo";

export class ApiNoteRepo implements NoteRepo {
  async getNotesByPatient(patientId: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
                *,
                caregivers (first_name, last_name),
                categories (name, color)
            `,
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedData: Note[] = data.map((item) => ({
      noteId: item.note_id,
      patientId: item.patient_id,
      caregiverId: item.caregiver_id,
      careTeamId: item.team_id,
      categoryId: item.category_id,
      title: item.title,
      description: item.description,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      isUrgent: item.is_urgent,
      categories: item.categories
        ? { name: item.categories.name, color: item.categories.color }
        : null,
      caregivers: item.caregivers
        ? {
            firstName: item.caregivers.first_name,
            lastName: item.caregivers.last_name,
          }
        : null,
    }));

    return formattedData;
  }

  async getCategories(careTeamId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("category_id, name, color")
      .eq("team_id", careTeamId)
      .order("name", { ascending: true });

    if (error) throw error;

    const formattedData: Category[] = data.map((item) => ({
      categoryId: item.category_id,
      name: item.name,
      color: item.color,
    }));

    return formattedData;
  }

  async addNote(note: NewNote): Promise<Note> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          patient_id: note.patientId,
          caregiver_id: note.caregiverId,
          team_id: note.careTeamId,
          category_id: note.categoryId ?? "",
          title: note.title,
          description: note.description,
          created_at: now,
          updated_at: now,
          is_urgent: note.isUrgent ?? false,
        },
      ])
      .select(
        `
                *,
                caregivers (first_name, last_name),
                categories (name, color)
            `,
      )
      .single();

    if (error) throw error;

    const formattedData: Note = {
      noteId: data.note_id,
      patientId: data.patient_id,
      caregiverId: data.caregiver_id,
      careTeamId: data.team_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isUrgent: data.is_urgent,
      categories: data.categories
        ? { name: data.categories.name, color: data.categories.color }
        : null,
      caregivers: data.caregivers
        ? {
            firstName: data.caregivers.first_name,
            lastName: data.caregivers.last_name,
          }
        : null,
    };

    return formattedData;
  }

  async updateNote(noteId: string, updates: Partial<NewNote>): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({
        patient_id: updates.patientId,
        caregiver_id: updates.caregiverId,
        team_id: updates.careTeamId,
        category_id: updates.categoryId ?? "",
        title: updates.title,
        description: updates.description,
        is_urgent: updates.isUrgent ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq("note_id", noteId)
      .select(
        `
                *,
                caregivers (first_name, last_name),
                categories (name, color)
            `,
      )
      .single();

    if (error) throw error;

    const formattedData: Note = {
      noteId: data.note_id,
      patientId: data.patient_id,
      caregiverId: data.caregiver_id,
      careTeamId: data.team_id,
      categoryId: data.category_id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isUrgent: data.is_urgent,
      categories: data.categories
        ? { name: data.categories.name, color: data.categories.color }
        : null,
      caregivers: data.caregivers
        ? {
            firstName: data.caregivers.first_name,
            lastName: data.caregivers.last_name,
          }
        : null,
    };

    return formattedData;
  }

  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("note_id", noteId);
    if (error) throw error;
  }
}
