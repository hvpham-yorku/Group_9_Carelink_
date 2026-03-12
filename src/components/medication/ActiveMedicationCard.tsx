import { Pill } from "lucide-react";

interface ActiveMedicationCardProps {
  name: string;
  dosage: string;
  frequency?: string;
  isSelected: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const ActiveMedicationCard = ({
  name,
  dosage,
  frequency,
  isSelected,
  isCompleted,
  onClick,
}: ActiveMedicationCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-start w-100 bg-white"
      style={{
        borderRadius: "16px",
        border: isSelected ? "1px solid #b6d4fe" : "1px solid #e9ecef",
        padding: "1rem",
        boxShadow: isSelected ? "0 0 0 3px rgba(13,110,253,0.08)" : "none",
        transition: "all 0.2s ease",
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

        {isCompleted && (
          <span className="badge text-bg-success rounded-pill">Taken</span>
        )}
      </div>
    </button>
  );
};

export default ActiveMedicationCard;