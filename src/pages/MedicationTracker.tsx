import { useState } from "react";
import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";
import Button from "../components/ui/Button";
import CustomSection from "../components/ui/CustomSection";

const MedicationTracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [schedule, setSchedule] = useState([
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      time: "08:00 AM",
      taken: false,
      takenAt: null as string | null,
      takenBy: null as string | null,
    },
    {
      id: 2,
      name: "Lisinopril",
      dosage: "10mg",
      time: "08:00 AM",
      taken: false,
      takenAt: null as string | null,
      takenBy: null as string | null,
    },
    {
      id: 3,
      name: "Aspirin",
      dosage: "81mg",
      time: "08:00 AM",
      taken: false,
      takenAt: null as string | null,
      takenBy: null as string | null,
    },
  ]);

  const toggleTaken = (id: number) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.taken) {
          return { ...item, taken: false, takenAt: null, takenBy: null };
        }

        return {
          ...item,
          taken: true,
          takenAt: new Date().toLocaleString(),
          takenBy: "Caregiver (Mock)",
        };
      })
    );
  };

  return (
    <div className="container">
      <h1>Medication Tracker</h1>

      {/* Toggle sidebar button */}
      <div style={{ marginTop: 10, marginBottom: 20 }}>
        <Button onClick={() => setSidebarOpen((prev) => !prev)}>
          {sidebarOpen ? "Collapse Sidebar" : "Show Sidebar"}
        </Button>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sidebarOpen ? "2fr 1fr" : "1fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* LEFT: Schedule */}
        <CustomSection title="Today's Medication Schedule">
          {schedule.map((med) => (
            <MedicationScheduleItem
              key={med.id}
              name={med.name}
              dosage={med.dosage}
              time={med.time}
              taken={med.taken}
              takenAt={med.takenAt}
              takenBy={med.takenBy}
              onToggle={() => toggleTaken(med.id)}
            />
          ))}
        </CustomSection>

        {/* RIGHT: Sidebar */}
        {sidebarOpen && (
          <div style={{ position: "sticky", top: 20 }}>
            <CustomSection title="Active Medications">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setSidebarOpen(false)}>Hide</Button>
              </div>

              <p style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
                {schedule.length} scheduled items
              </p>

              <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                {schedule.map((m) => (
                  <li key={m.id} style={{ marginBottom: 6 }}>
                    {m.name} ({m.dosage})
                  </li>
                ))}
              </ul>
            </CustomSection>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationTracker;
