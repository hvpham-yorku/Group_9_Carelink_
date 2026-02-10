/*
    This is the layout component, which is a wrapper for the main content of the website.
    It includes the SideBar component and a container for the main content.
    Props:
    - children: The main content to be displayed in the layout.
*/

import type { ReactNode } from "react";
import SideBar from "./ui/SideBar";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="d-flex">
        <SideBar username="Jose" />
        <div className="container mt-4" style={{ marginLeft: "280px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
