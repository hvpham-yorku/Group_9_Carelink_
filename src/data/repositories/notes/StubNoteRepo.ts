import type { Note } from "../../../types/note";
import type { Category } from "../../../types/teams";

import { notes, categories } from "../../data";
import type { NoteRepo, NewNote } from "./NoteRepo";

export class StubNoteRepo implements NoteRepo {
  async getNotesByPatient(patientId: string): Promise<Note[]> {
    return notes.filter((note) => note.patientId === patientId);
  }

  async getCategories(careTeamId: string): Promise<Category[]> {
    // In stub mode, careTeamId is ignored and all categories are returned
    void careTeamId;
    return categories.map((c) => ({
      categoryId: c.categoryId,
      name: c.name,
      color: c.color,
    }));
  }

  async addNote(note: NewNote): Promise<Note> {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote: Note = {
      ...note,
      noteId: crypto.randomUUID(),
      createdAt,
      updatedAt,
      categoryId: note.categoryId ?? "",
    };
    notes.push(newNote);

    return newNote;
  }

  async updateNote(noteId: string, updates: Partial<NewNote>): Promise<Note> {
    const noteIndex = notes.findIndex((n) => n.noteId === noteId);
    if (noteIndex === -1) throw new Error("Note not found");

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      categoryId: updates.categoryId ?? notes[noteIndex].categoryId ?? "",
    };
    notes[noteIndex] = updatedNote;

    return updatedNote;
  }

  async deleteNote(noteId: string): Promise<void> {
    const noteIndex = notes.findIndex((n) => n.noteId === noteId);
    if (noteIndex === -1) throw new Error("Note not found");

    notes.splice(noteIndex, 1);
  }
}
