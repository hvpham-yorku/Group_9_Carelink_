import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
import MedicationTracker from "./pages/MedicationTracker";
import PatientProfile from "./pages/PatientProfile";
import Login from "./pages/Login";
import Layout from "./components/layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/medication-tracker" element={<MedicationTracker />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
