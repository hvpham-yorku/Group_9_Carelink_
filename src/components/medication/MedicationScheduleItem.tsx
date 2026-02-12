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
        background: taken ? "#dcebde" : "white", 
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <input
          type="checkbox"
          checked={taken}
          onChange={onToggle}
          style={{
            marginTop: 4,
            width: 18,
            height: 18,
            cursor: "pointer",
            accentColor: "#3B82F6", 
            flexShrink: 0,
          }}
        />

        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: 0,
              textDecoration: taken ? "line-through" : "none",
              color: taken ? "#6e6e6e" : "#111",
            }}
          >
            {name} - {dosage}
          </h4>

          <p style={{ margin: "6px 0", color: taken ? "#777" : "#666" }}>
            Scheduled: {time}
          </p>

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
      </div>
    </div>
  );
};

export default MedicationScheduleItem;
