// services/noteService.ts
import { supabase } from "../lib/supabase";

export const noteService = {
  // FETCH
  async getNotesByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select(
        `
        *,
        caregivers (firstName, lastName),
        categories (name)
      `,
      )
      .eq("patientId", patientId)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data;
  },

  // FETCH CATEGORIES (shared categories table, scoped to care team)
  async getCategories(careTeamId: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("categoryId, name")
      .eq("careTeamId", careTeamId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data as { categoryId: string; name: string }[];
  },

  // ADD
  async addNote(note: {
    patientId: string;
    caregiverId: string;
    careTeamId: string;
    title: string;
    description: string;
    categoryId?: string;
  }) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("notes")
      .insert([{ ...note, createdAt: now, updatedAt: now }])
      .select(
        `
        *,
        caregivers (firstName, lastName),
        categories (name)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // EDIT
  async updateNote(
    noteId: string,
    updates: { title?: string; description?: string; categoryId?: string },
  ) {
    const { data, error } = await supabase
      .from("notes")
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq("noteId", noteId)
      .select(
        `
        *,
        caregivers (firstName, lastName),
        categories (name)
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // DELETE
  async deleteNote(noteId: string) {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("noteId", noteId);

    if (error) throw error;
    return true;
  },
};
