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
        boxShadow: isSelected
          ? "0 0 0 3px rgba(13,110,253,0.08)"
          : "0 4px 12px rgba(0,0,0,0.03)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        background: isSelected ? "#f8fbff" : "#fff",
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

            <div className="text-muted mb-2" style={{ fontSize: "0.92rem" }}>
              {dosage} • {frequency || "Not available"}
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {isSelected && (
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "#e7f1ff",
                    color: "#0d6efd",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.45rem 0.7rem",
                  }}
                >
                  Selected
                </span>
              )}

              {isCompleted && (
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: "#d1e7dd",
                    color: "#146c43",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.45rem 0.7rem",
                  }}
                >
                  Taken
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
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