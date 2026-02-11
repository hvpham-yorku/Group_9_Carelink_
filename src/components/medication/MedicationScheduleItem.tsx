import React from "react";

interface MedicationScheduleItemProps {
  name: string;
  dosage: string;
  time: string;
  taken?: boolean;
  takenAt?: string | null;
  takenBy?: string | null;
  onToggle?: () => void;
}

const MedicationScheduleItem: React.FC<MedicationScheduleItemProps> = ({
  name,
  dosage,
  time,
  taken = false,
  takenAt = null,
  takenBy = null,
  onToggle,
}) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "10px",
        background: taken ? "#eefaf0" : "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h4 style={{ margin: 0 }}>
            {name} - {dosage}
          </h4>
          <p style={{ margin: "6px 0", color: "#666" }}>Scheduled: {time}</p>
        </div>

        <button
          onClick={onToggle}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer",
            background: taken ? "#2e7d32" : "white",
            color: taken ? "white" : "#111",
          }}
        >
          {taken ? "Taken" : "Mark Taken"}
        </button>
      </div>

      {taken && (
        <div style={{ marginTop: 10, fontSize: 13 }}>
          <div>
            <b>Taken at:</b> {takenAt ?? "—"}
          </div>
          <div>
            <b>By:</b> {takenBy ?? "—"}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationScheduleItem;
