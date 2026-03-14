import { Pill, Pencil } from "lucide-react";
import type { MouseEvent, KeyboardEvent } from "react";
import Button from "../ui/Button";

interface ActiveMedicationCardProps {
  name: string;
  dosage: string;
  frequency?: string;
  isSelected: boolean;
  isCompleted: boolean;
  onClick: () => void;
  onEdit?: () => void;
}

const ActiveMedicationCard = ({
  name,
  dosage,
  frequency,
  isSelected,
  isCompleted,
  onClick,
  onEdit,
}: ActiveMedicationCardProps) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Select ${name}`}
      onClick={onClick}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        borderRadius: "16px",
        border: isSelected ? "1px solid #b6d4fe" : "1px solid #e9ecef",
        padding: "1rem",
        boxShadow: isSelected ? "0 0 0 3px rgba(13,110,253,0.08)" : "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div className="d-flex align-items-start gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              backgroundColor: "#f3edff",
              flexShrink: 0,
            }}
          >
            <Pill size={18} color="#6f42c1" />
          </div>

          <div>
            <div className="fw-semibold text-dark mb-1">{name}</div>

            <div className="text-muted" style={{ fontSize: "0.92rem" }}>
              {dosage} • {frequency || "Not available"}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isCompleted && (
            <span className="badge text-bg-success rounded-pill">Taken</span>
          )}

          {onEdit && (
            <Button
              color="outline-secondary"
              aria-label={`Edit ${name}`}
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Pencil size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveMedicationCard;