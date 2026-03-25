/**
 * This is the SideBar component for the CareLink application.
 * It provides navigation links to different sections of the app.
 *
 * Props:
 * - username: The name of the logged-in user, displayed in the dropdown menu.
 */

import { NavLink, useNavigate } from "react-router-dom";
import { Heart, ChevronDown } from "lucide-react";
import { useState } from "react";

// Context and services
import { authService } from "../../services/authService";
import { usePatient } from "../../contexts/patient/usePatient";

interface SideBarProps {
  username: string;
}

const SideBar = ({ username }: SideBarProps) => {
  const { patients, selectedPatientId, setSelectedPatientId } = usePatient();
  const navigate = useNavigate();

  const [patientMenuOpen, setPatientMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link text-uppercase fw-semibold px-3 py-2 rounded-3 ${
      isActive ? "active-nav-link" : "inactive-nav-link"
    }`;

  const selectedPatient = patients.find(
    (p) => p.patientId === selectedPatientId
  );

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
            <Heart size={40} className="text-primary me-2" />
            <span
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#111827",
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

            <li className="nav-item d-flex align-items-center ms-3">
              <span
                className="fw-semibold me-2 text-uppercase"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  color: "#6B7280",
                }}
              >
                Active Patient
              </span>

              <div className="dropdown">
                <button
                  type="button"
                  className={`btn patient-dropdown-button d-flex align-items-center justify-content-between ${
                    patientMenuOpen ? "show" : ""
                  }`}
                  data-bs-toggle="dropdown"
                  aria-expanded={patientMenuOpen}
                  onClick={() => setPatientMenuOpen((prev) => !prev)}
                  style={{
                    width: "180px",
                    borderRadius: "10px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#ffffff",
                    color: "#111827",
                    fontWeight: 500,
                    padding: "8px 12px",
                  }}
                >
                  <span className="text-truncate">
                    {selectedPatient
                      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                      : "Select Patient"}
                  </span>

                  <ChevronDown size={18} className="patient-chevron ms-2" />
                </button>

                <ul
                  className="dropdown-menu shadow-sm"
                  style={{ minWidth: "180px" }}
                >
                  {patients.map((p) => (
                    <li key={p.patientId}>
                      <button
                        type="button"
                        className={`dropdown-item ${
                          selectedPatientId === p.patientId ? "active" : ""
                        }`}
                        onClick={() => {
                          setSelectedPatientId(p.patientId);
                          setPatientMenuOpen(false);
                        }}
                      >
                        {p.firstName} {p.lastName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          {/* Account Dropdown */}
          <div className="btn-group dropup account-dropdown">
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center px-3 py-2 account-button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              <span>{username}</span>
              <ChevronDown size={18} className="account-chevron ms-2" />
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={async () => {
                    navigate("/landingpage");
                    await authService.signOut();
                  }}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;