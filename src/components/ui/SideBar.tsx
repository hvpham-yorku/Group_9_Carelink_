/*
    This is the SideBar component for the CareLink application. 
    It provides navigation links to different sections of the app.
    
    Props:
    - username: The name of the logged-in user, displayed in the dropdown menu.
*/

import { NavLink } from "react-router-dom";

// Context and services
import { authService } from "../../services/authService";
import { usePatient } from "../../contexts/patient/usePatient";

interface SideBarProps {
  username: string;
}

const SideBar = ({ username }: SideBarProps) => {
  // Get patient context for the patient switcher dropdown
  const { patients, selectedPatientId, setSelectedPatientId } = usePatient();

  return (
    <>
      <div
        className="position-fixed top-0 start-0 d-flex flex-column flex-shrink-0 p-3 bg-light vh-100 border-end overflow-auto"
        style={{ width: "280px" }}
      >
        <NavLink
          to="/dashboard"
          end
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
        >
          <span className="fs-4">CareLink</span>
        </NavLink>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink to="/dashboard" end className="nav-link ">
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/task-manager" className="nav-link">
              Task Manager
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/medication-tracker" className="nav-link">
              Medication Tracker
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/notes" className="nav-link">
              Notes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/teams" className="nav-link">
              Care Team
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/patient-profile" className="nav-link">
              Patient Profile
            </NavLink>
          </li>
          <li className="nav-item mt-3 px-2">
            <small
              className="text-muted text-uppercase fw-semibold d-block mb-1"
              style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
            >
              Active Patient
            </small>
            <select
              className="form-select form-select-sm"
              value={selectedPatientId || ""}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </li>
        </ul>

        <hr />
        <div className="btn-group dropup">
          <button
            type="button"
            className="btn btn-success d-flex align-items-center text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {username}
          </button>
          <ul className="dropdown-menu">
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <NavLink
                className="dropdown-item"
                to="/landingpage"
                onClick={() => authService.signOut()}
              >
                Sign out
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;
