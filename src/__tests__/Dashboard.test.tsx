import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

describe("Dashboard Page", () => {
     test("renders CareLink title", () => {
          render(
               <BrowserRouter>
                    <Dashboard />
               </BrowserRouter>
          );

          expect(screen.getByText(/CareLink/i)).toBeInTheDocument();
     });

     test("renders Home Care Dashboard subtitle", () => {
          render(
               <BrowserRouter>
                    <Dashboard />
               </BrowserRouter>
          );

          expect(
               screen.getByText(/Home Care Dashboard/i)
          ).toBeInTheDocument();
     });

     test("renders Quick Actions section", () => {
          render(
               <BrowserRouter>
                    <Dashboard />
               </BrowserRouter>
          );

          expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
     });

     test("renders Today’s Med Schedule section", () => {
          render(
               <BrowserRouter>
                    <Dashboard />
               </BrowserRouter>
          );

          expect(
               screen.getByText(/Today’s Med Schedule/i)
          ).toBeInTheDocument();
     });
});