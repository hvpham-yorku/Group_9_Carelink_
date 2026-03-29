/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "../../src/pages/Dashboard";

const mockNavigate = vi.fn();
const mockUseDashboardData = vi.fn();

vi.mock("react-router-dom", async () => {
     const actual = await vi.importActual<any>("react-router-dom");
     return {
          ...actual,
          useNavigate: () => mockNavigate,
     };
});

vi.mock("../../src/hooks/useDashBoardData", () => ({
     useDashboardData: () => mockUseDashboardData(),
}));

const fullDashboardData = {
     patient: {
          name: "John Doe",
          meta: "Age 76 • Room 12",
     },
     caregiver: {
          name: "Neharika Sharma",
          role: "Assigned Caregiver",
     },
     stats: [
          {
               title: "Today’s Tasks",
               primary: "4",
               secondary: "Tasks to manage today",
               route: "/task-manager",
          },
          {
               title: "Medications",
               primary: "1/2",
               secondary: "1 not taken yet",
               route: "/medication-tracker",
          },
          {
               title: "Next Appointment",
               primary: "Fri",
               secondary: "Physiotherapy • 2:00 PM",
               route: "/appointments",
          },
          {
               title: "Care Notes",
               primary: "3",
               secondary: "recent notes",
               route: "/notes",
          },
     ],
     todaysMeds: [
          {
               name: "Metformin",
               dose: "500 mg",
               time: "8:00 AM",
               taken: true,
          },
          {
               name: "Aspirin",
               dose: "100 mg",
               time: "9:00 PM",
               taken: false,
          },
     ],
     recentActivity: [
          {
               text: "Morning medication completed",
               time: "10 mins ago",
          },
          {
               text: "Vitals checked",
               time: "30 mins ago",
          },
     ],
     recentNotes: [
          {
               text: "Patient had breakfast comfortably.",
               time: "15 mins ago",
          },
          {
               text: "Follow-up note added.",
               time: "1 hour ago",
          },
     ],
     upcomingAppointments: [
          {
               title: "Physiotherapy",
               day: "Fri",
               time: "2:00 PM",
               location: "Downtown Clinic",
          },
          {
               title: "Dental Cleaning",
               day: "Sat",
               time: "11:00 AM",
               location: "Dental Office",
          },
     ],
};

describe("Dashboard Integration Tests", () => {
     beforeEach(() => {
          vi.clearAllMocks();

          mockUseDashboardData.mockReturnValue({
               data: fullDashboardData,
               loading: false,
               error: null,
          });
     });

     it("renders all main dashboard sections with live data", () => {
          render(<Dashboard />);

          expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();

          expect(screen.getByText("John Doe")).toBeInTheDocument();
          expect(screen.getByText("Age 76 • Room 12")).toBeInTheDocument();
          expect(screen.getByText("Neharika Sharma")).toBeInTheDocument();
          expect(screen.getByText("Assigned Caregiver")).toBeInTheDocument();

          expect(screen.getByText(/today’s med schedule/i)).toBeInTheDocument();
          expect(screen.getByText(/upcoming appointments/i)).toBeInTheDocument();
          expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
          expect(screen.getByText(/schedule overview/i)).toBeInTheDocument();

          // FIX: there are multiple "recent notes" matches on the page
          expect(screen.getAllByText(/recent notes/i).length).toBeGreaterThan(0);
     });

     it("renders medication, appointment, activity, and notes content correctly", () => {
          render(<Dashboard />);

          // FIX: some of these appear more than once
          expect(screen.getAllByText("Metformin").length).toBeGreaterThan(0);
          expect(screen.getAllByText("Aspirin").length).toBeGreaterThan(0);
          expect(screen.getAllByText("Physiotherapy").length).toBeGreaterThan(0);

          expect(screen.getAllByText("Dental Cleaning").length).toBeGreaterThan(0);
          expect(screen.getByText("Morning medication completed")).toBeInTheDocument();
          expect(screen.getByText("Vitals checked")).toBeInTheDocument();
          expect(screen.getByText("Patient had breakfast comfortably.")).toBeInTheDocument();
          expect(screen.getByText("Follow-up note added.")).toBeInTheDocument();
     });

     it("navigates to task manager when the Today’s Tasks stat card is clicked", () => {
          render(<Dashboard />);

          fireEvent.click(screen.getByRole("button", { name: /today’s tasks/i }));
          expect(mockNavigate).toHaveBeenCalledWith("/task-manager");
     });

     it("navigates to medication tracker when the Medications stat card is clicked", () => {
          render(<Dashboard />);

          fireEvent.click(screen.getByRole("button", { name: /medications/i }));
          expect(mockNavigate).toHaveBeenCalledWith("/medication-tracker");
     });

     it("navigates to appointments when the Next Appointment stat card is clicked", () => {
          render(<Dashboard />);

          fireEvent.click(screen.getByRole("button", { name: /next appointment/i }));
          expect(mockNavigate).toHaveBeenCalledWith("/appointments");
     });

     it("navigates to notes when the Care Notes stat card is clicked", () => {
          render(<Dashboard />);

          fireEvent.click(screen.getByRole("button", { name: /care notes/i }));
          expect(mockNavigate).toHaveBeenCalledWith("/notes");
     });

     it("opens medication tracker from the Today’s Med Schedule section", () => {
          render(<Dashboard />);

          const openButtons = screen.getAllByRole("button", { name: /^open$/i });
          fireEvent.click(openButtons[0]);

          expect(mockNavigate).toHaveBeenCalledWith("/medication-tracker");
     });

     it("opens appointments from the Upcoming Appointments section", () => {
          render(<Dashboard />);

          const openButtons = screen.getAllByRole("button", { name: /^open$/i });
          fireEvent.click(openButtons[1]);

          expect(mockNavigate).toHaveBeenCalledWith("/appointments");
     });

     it("opens task manager from the Recent Activity section", () => {
          render(<Dashboard />);

          const openButtons = screen.getAllByRole("button", { name: /^open$/i });
          fireEvent.click(openButtons[2]);

          expect(mockNavigate).toHaveBeenCalledWith("/task-manager");
     });

     it("opens notes from the Recent Notes section", () => {
          render(<Dashboard />);

          const openButtons = screen.getAllByRole("button", { name: /^open$/i });
          fireEvent.click(openButtons[3]);

          expect(mockNavigate).toHaveBeenCalledWith("/notes");
     });

     it("opens appointments from the View Appointments button in Schedule Overview", () => {
          render(<Dashboard />);

          fireEvent.click(
               screen.getByRole("button", { name: /view appointments/i }),
          );

          expect(mockNavigate).toHaveBeenCalledWith("/appointments");
     });

     it("renders schedule overview items from both appointments and medications", () => {
          render(<Dashboard />);

          expect(screen.getAllByText("Physiotherapy").length).toBeGreaterThan(0);
          expect(screen.getAllByText("Metformin").length).toBeGreaterThan(0);
     });
});