import CustomSection from "../ui/CustomSection";
import NoteForm from "./NoteForm";

type Props = {
  selectedNote: any;
  formatDateTime: (ts: number) => string;

  title: string;
  content: string;
  tag: string;

  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  setTag: (v: any) => void;

  handleSave: () => void;
  handleDelete: (id: string) => void;

  TAGS: string[];
  tagBadgeClass: (tag: any) => string;
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
          ? `Last updated: ${formatDateTime(selectedNote.updatedAt)}`
          : "Not saved yet"
      }
    >
      <NoteForm selectedNote={selectedNote} {...formProps} />
    </CustomSection>
  );
}
