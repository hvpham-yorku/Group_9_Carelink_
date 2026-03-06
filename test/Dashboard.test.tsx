import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

describe("Dashboard Page", () => {
     it("renders CareLink title", () => {
          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>
          );
          expect(screen.getByText(/CareLink/i)).toBeInTheDocument();
     });

     it("renders Home Care Dashboard subtitle", () => {
          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>
          );
          expect(screen.getByText(/Home Care Dashboard/i)).toBeInTheDocument();
     });

     it("renders Quick Actions section", () => {
          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>
          );
          expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
     });

     it("renders Today’s Med Schedule section", () => {
          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>
          );
          expect(screen.getByText(/Today’s Med Schedule/i)).toBeInTheDocument();
     });
});