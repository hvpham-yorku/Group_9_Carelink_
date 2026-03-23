/*
    This is the SideBar component for the CareLink application. 
    It provides navigation links to different sections of the app.
    
    Props:
    - username: The name of the logged-in user, displayed in the dropdown menu.
*/

import { NavLink } from "react-router-dom";
import { Heart } from "lucide-react";

// Context and services
import { authService } from "../../services/authService";
import { usePatient } from "../../contexts/patient/usePatient";

interface SideBarProps {
  username: string;
}

const SideBar = ({ username }: SideBarProps) => {
  const { patients, selectedPatientId, setSelectedPatientId } = usePatient();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-uppercase fw-semibold px-3 py-2 rounded-3 ${
      isActive ? "active-nav-link" : "inactive-nav-link"
    }`;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 border-bottom"
        style={{
          height: "76px",
          zIndex: 1000,
          backgroundColor: "#ffffff",
        }}
      >
        <div className="d-flex align-items-center justify-content-between h-100 px-5">

          {/* Logo */}
          <NavLink
            to="/dashboard"
            end
            className="d-flex align-items-center text-decoration-none"
          >
            <Heart size={36} className="text-primary me-2" />
            <span
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1,
              }}
            >
              CareLink
            </span>
          </NavLink>

          {/* Navigation */}
          <ul className="nav d-flex flex-row align-items-center justify-content-evenly mb-0 flex-grow-1 mx-4">

            <li className="nav-item">
              <NavLink to="/dashboard" end className={navLinkClass}>
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/task-manager" className={navLinkClass}>
                Task Manager
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/medication-tracker" className={navLinkClass}>
                Medication Tracker
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/notes" className={navLinkClass}>
                Notes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/teams" className={navLinkClass}>
                Care Team
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/patient-profile" className={navLinkClass}>
                Patient Profile
              </NavLink>
            </li>

            {/* Active Patient */}
            <li className="nav-item d-flex align-items-center ms-3">
              <span
                className="fw-semibold me-2 text-uppercase"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  color: "#6B7280",
                  whiteSpace: "nowrap",
                }}
              >
                Active Patient
              </span>

              <select
                className="form-select form-select-sm navbar-select"
                style={{
                  width: "180px",
                  borderRadius: "10px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "#ffffff",
                  color: "#111827",
                }}
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

          {/* User Dropdown */}
          <div className="btn-group dropup">
            <button
              type="button"
              className="btn btn-primary dropdown-toggle d-flex align-items-center px-3 py-2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              {username}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
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
      </div>
    </>
  );
};

export default SideBar;