import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../src/pages/Dashboard";

vi.mock("../../src/hooks/useDashBoardData", () => ({
     useDashboardData: vi.fn(),
}));

import { useDashboardData } from "../../src/hooks/useDashBoardData";

const mockedUseDashboardData = vi.mocked(useDashboardData);

describe("Dashboard", () => {
     beforeEach(() => {
          mockedUseDashboardData.mockReset();
     });

     it("renders loading state", () => {
          mockedUseDashboardData.mockReturnValue({
               data: null,
               loading: true,
               error: null,
          } as any);

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
          } as any);

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/Unable to load dashboard/i)).toBeInTheDocument();
          expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
     });

     it("renders main dashboard sections", () => {
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
          } as any);

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
          expect(screen.getByText(/Today’s Med Schedule/i)).toBeInTheDocument();
          expect(screen.getByText(/Upcoming Appointments/i)).toBeInTheDocument();
          expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
          expect(screen.getByText(/Schedule Overview/i)).toBeInTheDocument();
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
          } as any);

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
          } as any);

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(
               screen.getByText(/No upcoming appointments yet/i),
          ).toBeInTheDocument();
     });

     it("does not render quick actions panel", () => {
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
          } as any);

          render(
               <MemoryRouter>
                    <Dashboard />
               </MemoryRouter>,
          );

          expect(screen.queryByText(/Quick Actions/i)).not.toBeInTheDocument();
          expect(
               screen.queryByRole("button", { name: /Go to Task Manager/i }),
          ).not.toBeInTheDocument();
          expect(
               screen.queryByRole("button", { name: /Go to Medication Tracker/i }),
          ).not.toBeInTheDocument();
          expect(
               screen.queryByRole("button", { name: /Go to Patient Profile/i }),
          ).not.toBeInTheDocument();
     });
});