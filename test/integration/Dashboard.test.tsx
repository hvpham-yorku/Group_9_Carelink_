import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../src/pages/Dashboard";

vi.mock("../../src/hooks/useDashBoardData", () => ({
     useDashboardData: vi.fn(),
}));

import { useDashboardData } from "../../src/hooks/useDashBoardData";

const mockedUseDashboardData = vi.mocked(useDashboardData);

describe("Dashboard Page", () => {
     beforeEach(() => {
          vi.clearAllMocks();
     });

     it("renders loading state", () => {
          mockedUseDashboardData.mockReturnValue({
               data: null,
               loading: true,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
     });

     it("renders error state", () => {
          mockedUseDashboardData.mockReturnValue({
               data: null,
               loading: false,
               error: "Failed to load dashboard data.",
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(
               screen.getByText(/Failed to load dashboard data/i),
          ).toBeInTheDocument();
     });

     it("renders no patient selected state", () => {
          mockedUseDashboardData.mockReturnValue({
               data: null,
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/No patient selected/i)).toBeInTheDocument();
     });

     it("renders dashboard title and subtitle", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: ["Diabetes", "Hypertension"],
                         emergencyContact: "Jennifer Chen",
                         emergencyPhone: "(555) 987-6543",
                    },
                    stats: [
                         {
                              title: "Today's Tasks",
                              primary: "3 / 8",
                              secondary: "5 remaining",
                              route: "/task-manager",
                         },
                         {
                              title: "Medications",
                              primary: "2 / 4",
                              secondary: "2 not taken yet",
                              route: "/medication-tracker",
                         },
                         {
                              title: "Next Appointment",
                              primary: "—",
                              secondary: "No data yet",
                         },
                         {
                              title: "Care Notes",
                              primary: "3",
                              secondary: "recent updates",
                              route: "/notes",
                         },
                    ],
                    recentActivity: [
                         { icon: "✅", text: "Task completed: Morning medication check" },
                         { icon: "💊", text: "Medication logged: Metformin" },
                    ],
                    todaysMeds: [
                         {
                              time: "8:00 AM",
                              name: "Metformin",
                              dose: "500mg",
                              taken: true,
                         },
                         {
                              time: "12:00 PM",
                              name: "Vitamin D",
                              dose: "1000 IU",
                              taken: false,
                         },
                    ],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/CareLink/i)).toBeInTheDocument();
          expect(screen.getByText(/Home Care Dashboard/i)).toBeInTheDocument();
     });

     it("renders caregiver and patient information", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: ["Diabetes", "Hypertension"],
                         emergencyContact: "Jennifer Chen",
                         emergencyPhone: "(555) 987-6543",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getAllByText("Jennifer Chen").length).toBeGreaterThan(0);
          expect(screen.getByText("Registered Nurse")).toBeInTheDocument();
          expect(screen.getByText("Margaret Chen")).toBeInTheDocument();
          expect(screen.getByText("Age 78")).toBeInTheDocument();
          expect(screen.getByText("Diabetes")).toBeInTheDocument();
          expect(screen.getByText("Hypertension")).toBeInTheDocument();
     });

     it("renders fallback when patient has no conditions", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/No conditions listed/i)).toBeInTheDocument();
     });

     it("renders stat cards", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [
                         {
                              title: "Today's Tasks",
                              primary: "3 / 8",
                              secondary: "5 remaining",
                              route: "/task-manager",
                         },
                         {
                              title: "Medications",
                              primary: "2 / 4",
                              secondary: "2 not taken yet",
                              route: "/medication-tracker",
                         },
                    ],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText("Today's Tasks")).toBeInTheDocument();
          expect(screen.getByText("3 / 8")).toBeInTheDocument();
          expect(screen.getByText("5 remaining")).toBeInTheDocument();
          expect(screen.getAllByText("Medications").length).toBeGreaterThan(0);
          expect(screen.getByText("2 / 4")).toBeInTheDocument();
          expect(screen.getByText("2 not taken yet")).toBeInTheDocument();
     });

     it("renders recent activity items", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [
                         { icon: "✅", text: "Task completed: Morning medication check" },
                         { icon: "💊", text: "Medication logged: Metformin" },
                    ],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(
               screen.getByText(/Task completed: Morning medication check/i),
          ).toBeInTheDocument();
          expect(
               screen.getByText(/Medication logged: Metformin/i),
          ).toBeInTheDocument();
     });

     it("renders fallback when there is no recent activity", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/No recent activity yet/i)).toBeInTheDocument();
     });

     it("renders today's medication schedule", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [
                         {
                              time: "8:00 AM",
                              name: "Metformin",
                              dose: "500mg",
                              taken: true,
                         },
                         {
                              time: "12:00 PM",
                              name: "Vitamin D",
                              dose: "1000 IU",
                              taken: false,
                         },
                    ],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/Today’s Med Schedule/i)).toBeInTheDocument();
          expect(
               screen.getByText(/8:00 AM — Metformin \(500mg\)/i),
          ).toBeInTheDocument();
          expect(
               screen.getByText(/12:00 PM — Vitamin D \(1000 IU\)/i),
          ).toBeInTheDocument();
     });

     it("renders fallback when there are no medications scheduled", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(
               screen.getByText(/No medications scheduled yet/i),
          ).toBeInTheDocument();
     });

     it("renders fallback when there are no upcoming appointments", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(
               screen.getByText(/No upcoming appointments yet/i),
          ).toBeInTheDocument();
     });

     it("renders quick action buttons", () => {
          mockedUseDashboardData.mockReturnValue({
               data: {
                    caregiver: {
                         name: "Jennifer Chen",
                         role: "Registered Nurse",
                    },
                    patient: {
                         name: "Margaret Chen",
                         meta: "Age 78",
                         conditions: [],
                         emergencyContact: "Coming soon",
                         emergencyPhone: "—",
                    },
                    stats: [],
                    recentActivity: [],
                    todaysMeds: [],
                    upcomingAppointments: [],
               },
               loading: false,
               error: null,
          });

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
          expect(
               screen.getByRole("button", { name: /Go to Task Manager/i }),
          ).toBeInTheDocument();
          expect(
               screen.getByRole("button", { name: /Go to Medication Tracker/i }),
          ).toBeInTheDocument();
          expect(
               screen.getByRole("button", { name: /Go to Patient Profile/i }),
          ).toBeInTheDocument();
     });
});