import { Route, Routes, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./contexts/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PatientProvider } from "./contexts/patient/PatientProvider";

// Pages
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
import MedicationTracker from "./pages/MedicationTracker";
import PatientProfile from "./pages/PatientProfile";
import Teams from "./pages/Teams";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Layout from "./components/Layout";
import Notes from "./pages/Notes";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <>
      <AuthProvider>
        <PatientProvider>
          <Routes>
            <Route path="/landingpage" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/task-manager"
                element={
                  <ProtectedRoute>
                    <TaskManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medication-tracker"
                element={
                  <ProtectedRoute>
                    <MedicationTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-profile"
                element={
                  <ProtectedRoute>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <Teams />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </PatientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
