import { ClipboardList } from "lucide-react";
import CustomSection from "../ui/CustomSection";
import Button from "../ui/Button";

interface Props {
  onViewNotes: () => void;
}

const PatientNotesSection = ({ onViewNotes }: Props) => {
  return (
    <CustomSection
      title="Care Notes & Preferences"
      rightAction={
        <Button color="outline-primary" onClick={onViewNotes}>
          View Notes
        </Button>
      }
    >
      <div
        className="p-3"
        style={{
          backgroundColor: "#fffbea",
          borderRadius: "12px",
          border: "1px solid #fde68a",
        }}
      >
        <div className="d-flex align-items-start gap-2">
          <ClipboardList
            size={16}
            color="#ca8a04"
            style={{ marginTop: "2px" }}
          />
          <div>
            <div
              className="fw-semibold mb-1"
              style={{ color: "#92400e", fontSize: "0.9rem" }}
            >
              Important Care Information
            </div>
            <div
              style={{ fontSize: "0.93rem", color: "#4b5563", lineHeight: 1.6 }}
            >
              View and manage care notes from the Notes page.
            </div>
          </div>
        </div>
      </div>
    </CustomSection>
  );
};

export default PatientNotesSection;
