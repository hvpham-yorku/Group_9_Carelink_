import React from "react";

interface MedicationScheduleItemProps {
  name: string;
  dosage: string;
  time: string;
}

const MedicationScheduleItem: React.FC<MedicationScheduleItemProps> = ({
  name,
  dosage,
  time,
}) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "8px", marginBottom: "10px" }}>
      <h4>{name} - {dosage}</h4>
      <p>Scheduled: {time}</p>
    </div>
  );
};

export default MedicationScheduleItem;
