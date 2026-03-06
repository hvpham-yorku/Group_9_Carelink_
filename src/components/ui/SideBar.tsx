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
        className="position-fixed top-0 start-0 w-100 d-flex align-items-center px-4"
        style={{ height: "70px", zIndex: 1000, backgroundColor: "#4f67f6" }}
      >
        <NavLink
          to="/dashboard"
          end
          className="d-flex align-items-center me-4 text-white text-decoration-none fw-bold"
        >
          <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>CareLink</span>
        </NavLink>
        
        <ul className="nav d-flex flex-row align-items-center justify-content-evenly mb-0 flex-grow-1">

  <li className="nav-item">
    <NavLink
      to="/dashboard"
      end
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Dashboard
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink
      to="/task-manager"
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Task Manager
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink
      to="/medication-tracker"
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Medication Tracker
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink
      to="/notes"
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Notes
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink
      to="/teams"
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Care Team
    </NavLink>
  </li>

  <li className="nav-item">
    <NavLink
      to="/patient-profile"
      className={({ isActive }) =>
        `nav-link text-white text-uppercase fw-semibold px-3 py-2 rounded ${
          isActive ? "bg-white bg-opacity-10" : ""
        }`
      }
    >
      Patient Profile
    </NavLink>
  </li>

  <li className="nav-item px-2 d-flex flex-column justify-content-center">
    <small
      className="text-white text-uppercase fw-semibold d-block mb-1"
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
