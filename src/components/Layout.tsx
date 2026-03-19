/*
    This is the layout component, which is a wrapper for the main content of the website.
    It includes the SideBar component and a container for the main content.
    Props:
    - children: The main content to be displayed in the layout.
*/

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./ui/SideBar";

// Context and services
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const Layout = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    if (!user) return;
    authService
      .getProfile(user.id)
      .then((profile) => {
        setUsername(`${profile.first_name} ${profile.last_name}`);
      })
      .catch(() => {
        // fall back to email prefix
        setUsername(user.email?.split("@")[0] ?? "User");
      });
  }, [user]);

  return (
    <>
      <div className="d-flex" style={{ backgroundColor: "#F2F7FF" }}>
        <SideBar username={username} />
        <div className="container" style={{ paddingTop: "90px" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
