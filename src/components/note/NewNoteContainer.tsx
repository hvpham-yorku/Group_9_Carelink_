import CustomSection from "../ui/CustomSection";
import NoteForm from "./NoteForm";
import type { Note, NoteCategory } from "./types";

type Props = {
  selectedNote: Note | null;
  formatDateTime: (ts: string) => string;

  title: string;
  description: string;
  categoryId: string;

  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setCategoryId: (value: string) => void;

  handleSave: () => void;
  handleDelete: (id: string) => void;

  categories: NoteCategory[];
};

export default function NewNoteContainer({
  selectedNote,
  formatDateTime,
  ...formProps
}: Props) {
  return (
    <CustomSection
      title={selectedNote ? "Edit Note" : "New Note"}
      subheader={
        selectedNote
          ? `Created: ${formatDateTime(selectedNote.createdAt)}`
          : "Not saved yet"
      }
    >
      <NoteForm selectedNote={selectedNote} {...formProps} />
    </CustomSection>
  );
}