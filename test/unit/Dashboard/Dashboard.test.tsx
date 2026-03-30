/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ IMPORTANT: declare mocks INSIDE vi.mock (not outside)

vi.mock("../../../src/hooks/useDashBoardData", () => {
     return {
          useDashboardData: vi.fn(),
     };
});

vi.mock("react-router-dom", async () => {
     const actual = await vi.importActual<any>("react-router-dom");
     return {
          ...actual,
          useNavigate: () => vi.fn(),
     };
});

// AFTER mocks → import
import Dashboard from "../../../src/pages/Dashboard";
import { useDashboardData } from "../../../src/hooks/useDashBoardData";

describe("Dashboard Unit Tests", () => {
     beforeEach(() => {
          vi.clearAllMocks();
     });

     it("renders loading state", () => {
          (useDashboardData as any).mockReturnValue({
               data: null,
               loading: true,
               error: null,
          });

          render(<Dashboard />);

          expect(screen.getByRole("status")).toBeInTheDocument();
     });

     it("renders error state", () => {
          (useDashboardData as any).mockReturnValue({
               data: null,
               loading: false,
               error: "Error",
          });

          render(<Dashboard />);

          expect(screen.getByText(/unable to load dashboard/i)).toBeInTheDocument();
     });

     it("renders patient info when data exists", () => {
          (useDashboardData as any).mockReturnValue({
               loading: false,
               error: null,
               data: {
                    patient: { name: "John Doe", meta: "Room 1" },
                    caregiver: { name: "Neha", role: "Caregiver" },
                    stats: [],
                    todaysMeds: [],
                    recentActivity: [],
                    recentNotes: [],
                    upcomingAppointments: [],
               },
          });

          render(<Dashboard />);

          expect(screen.getByText("John Doe")).toBeInTheDocument();
          expect(screen.getByText("Neha")).toBeInTheDocument();
     });
});