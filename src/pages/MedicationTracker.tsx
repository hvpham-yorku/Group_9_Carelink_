import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";

const MedicationTracker = () => {
    const todaySchedule = [
  { id: 1, name: "Metformin", dosage: "500mg", time: "08:00 AM" },
  { id: 2, name: "Lisinopril", dosage: "10mg", time: "08:00 AM" },
  { id: 3, name: "Aspirin", dosage: "81mg", time: "08:00 AM" },
];

  return (
    <>
      <div className="container">
  <h1>Medication Tracker</h1>

  <div style={{ marginTop: "20px" }}>
    {todaySchedule.map((med) => (
      <MedicationScheduleItem
        key={med.id}
        name={med.name}
        dosage={med.dosage}
        time={med.time}
      />
    ))}
  </div>
</div>
    </>
  );
};

export default MedicationTracker;
