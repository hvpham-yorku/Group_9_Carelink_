/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ✅ DEFINE MOCKS INSIDE vi.mock (IMPORTANT)

vi.mock("../../src/data", () => {
  const mockGetMeds = vi.fn();
  const mockGetArchived = vi.fn();
  const mockMark = vi.fn();
  const mockUnmark = vi.fn();
  const mockAdd = vi.fn();
  const mockUpdate = vi.fn();
  const mockArchive = vi.fn();

  return {
    repositories: {
      medication: {
        getMedicationsByPatient: mockGetMeds,
        getArchivedMedications: mockGetArchived,
        markAsTaken: mockMark,
        unmarkAsTaken: mockUnmark,
        addMedication: mockAdd,
        updateMedication: mockUpdate,
        archiveMedication: mockArchive,
      },
    },

    // 👇 expose mocks so tests can use them
    __mocks__: {
      mockGetMeds,
      mockGetArchived,
      mockMark,
      mockUnmark,
      mockAdd,
      mockUpdate,
      mockArchive,
    },
  };
});

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1" },
  }),
}));

vi.mock("../../src/contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

// import AFTER mocks
import MedicationTracker from "../../src/pages/MedicationTracker";
import { repositories } from "../../src/data";

// grab mocks
const {
  mockGetMeds,
  mockGetArchived,
  mockMark,
  mockUnmark,
  mockAdd,
  mockUpdate,
  mockArchive,
} = (repositories as any).__mocks__;

// ---- MOCK DATA ----
const mockMedication = {
  medicationId: "med-1",
  careTeamId: "team-1",
  patientId: "patient-1",
  name: "Aspirin",
  dosage: "500mg",
  frequency: "Daily",
  purpose: "Pain relief",
  instructions: "Take with food",
  prescribedBy: "Dr. Smith",
  warnings: "Do not exceed dosage",
  scheduledAt: ["2099-01-01T08:00:00"],
  medicationLog: {
    caregiverId: "c1",
    firstName: "John",
    lastName: "Doe",
    takenAt: "2026-01-01T08:00:00",
    isCompleted: false,
  },
};

describe("MedicationTracker (Integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetMeds.mockResolvedValue([mockMedication]);
    mockGetArchived.mockResolvedValue([]);
    mockMark.mockResolvedValue(undefined);
    mockUnmark.mockResolvedValue(undefined);
    mockAdd.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(undefined);
    mockArchive.mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders and loads medications", async () => {
    render(<MedicationTracker />);

    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetMeds).toHaveBeenCalled();
    });

    expect(await screen.findAllByText("Aspirin")).not.toHaveLength(0);
  });

  it("toggles medication", async () => {
    render(<MedicationTracker />);

    const checkbox = await screen.findByLabelText(/mark aspirin/i);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockMark).toHaveBeenCalled();
    });
  });

  it("opens add modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByText(/add medication/i));

    expect(await screen.findByText(/save medication/i)).toBeInTheDocument();
  });

  it("opens archived modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByText(/view archived/i));

    expect(
      await screen.findByText(/archived medications/i),
    ).toBeInTheDocument();
  });

  it("archives medication", async () => {
    render(<MedicationTracker />);

    const archiveButton = await screen.findByText(/archive/i);
    fireEvent.click(archiveButton);

    await waitFor(() => {
      expect(mockArchive).toHaveBeenCalled();
    });
  });
});