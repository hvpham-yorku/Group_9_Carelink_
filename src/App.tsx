import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
import MedicationTracker from "./pages/MedicationTracker";
import PatientProfile from "./pages/PatientProfile";
import Layout from "./components/layout";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/medication-tracker" element={<MedicationTracker />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
