/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MedicationTracker from "../../src/pages/MedicationTracker";

const mockGetMeds = vi.fn();
const mockGetArchived = vi.fn();
const mockMark = vi.fn();
const mockUnmark = vi.fn();
const mockAdd = vi.fn();
const mockUpdate = vi.fn();
const mockArchive = vi.fn();

vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "user-1" },
  }),
}));

vi.mock("../../../src/contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

vi.mock("../../../src/data", () => ({
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
}));

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
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("renders page and loads medications", async () => {
    render(<MedicationTracker />);

    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetMeds).toHaveBeenCalledWith("patient-1");
      expect(mockGetArchived).toHaveBeenCalledWith("patient-1");
    });

    expect(await screen.findAllByText("Aspirin")).not.toHaveLength(0);
  });

  it("shows stat cards correctly", async () => {
    render(<MedicationTracker />);

    expect(await screen.findByText(/currently prescribed/i)).toBeInTheDocument();
    expect(screen.getByText(/marked as completed/i)).toBeInTheDocument();
    expect(screen.getByText(/still left for today/i)).toBeInTheDocument();
  });

  it("toggles medication checkbox", async () => {
    render(<MedicationTracker />);

    const checkbox = await screen.findByLabelText(/mark aspirin as taken/i);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockMark).toHaveBeenCalledWith("med-1", "user-1");
    });
  });

  it("opens add medication modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /add medication/i }));

    expect(
      await screen.findByRole("heading", { name: /add medication/i }),
    ).toBeInTheDocument();
  });

  it("opens archived medications modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /view archived/i }));

    expect(
      await screen.findByRole("heading", { name: /archived medications/i }),
    ).toBeInTheDocument();
  });

  it("shows medication details", async () => {
    render(<MedicationTracker />);

    expect(await screen.findByText(/pain relief/i)).toBeInTheDocument();
    expect(screen.getByText(/take with food/i)).toBeInTheDocument();
    expect(screen.getByText(/dr. smith/i)).toBeInTheDocument();
  });

  it("opens edit modal from active medication card", async () => {
    render(<MedicationTracker />);

    const editButton = await screen.findByRole("button", {
      name: /edit aspirin/i,
    });

    fireEvent.click(editButton);

    expect(
      await screen.findByRole("heading", { name: /edit medication/i }),
    ).toBeInTheDocument();
  });

  it("saves a new medication", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /add medication/i }));

    expect(
      await screen.findByRole("heading", { name: /add medication/i }),
    ).toBeInTheDocument();

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "Vitamin D" } });
    fireEvent.change(textboxes[1], { target: { value: "1000 IU" } });
    fireEvent.change(textboxes[2], { target: { value: "Once daily" } });

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  it("saves an edited medication", async () => {
    render(<MedicationTracker />);

    const editButton = await screen.findByRole("button", {
      name: /edit aspirin/i,
    });

    fireEvent.click(editButton);

    expect(
      await screen.findByRole("heading", { name: /edit medication/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  it("archives selected medication", async () => {
    render(<MedicationTracker />);

    const archiveButton = await screen.findByRole("button", {
      name: /archive/i,
    });

    fireEvent.click(archiveButton);

    await waitFor(() => {
      expect(mockArchive).toHaveBeenCalledWith("med-1");
    });
  });
});