/*
    This is the SideBar component for the CareLink application. 
    It provides navigation links to different sections of the app.
    Props:
    - username: The name of the logged-in user, displayed in the dropdown menu.
*/

import { NavLink } from "react-router-dom";

interface SideBarProps {
  username: string;
}

const SideBar = ({ username }: SideBarProps) => {
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
          <li>
            <NavLink to="/task-manager" className="nav-link">
              Task Manager
            </NavLink>
          </li>
          <li>
            <NavLink to="/medication-tracker" className="nav-link">
              Medication Tracker
            </NavLink>
          </li>
          <li>
            <NavLink to="/patient-profile" className="nav-link">
              Patient Profile
            </NavLink>
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
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <NavLink className="dropdown-item" to="/login">
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
