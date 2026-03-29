/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const repoMocks = vi.hoisted(() => ({
  mockGetMeds: vi.fn(),
  mockGetArchived: vi.fn(),
  mockMark: vi.fn(),
  mockUnmark: vi.fn(),
  mockAdd: vi.fn(),
  mockUpdate: vi.fn(),
  mockArchive: vi.fn(),
}));

vi.mock("../../src/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "caregiver-1" },
  }),
}));

vi.mock("../../src/contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

vi.mock("../../src/data", () => ({
  repositories: {
    medication: {
      getMedicationsByPatient: repoMocks.mockGetMeds,
      getArchivedMedications: repoMocks.mockGetArchived,
      markAsTaken: repoMocks.mockMark,
      unmarkAsTaken: repoMocks.mockUnmark,
      addMedication: repoMocks.mockAdd,
      updateMedication: repoMocks.mockUpdate,
      archiveMedication: repoMocks.mockArchive,
    },
  },
}));

import MedicationTracker from "../../src/pages/MedicationTracker";

const activeMedication = {
  medicationId: "med-1",
  careTeamId: "team-1",
  patientId: "patient-1",
  name: "Metformin",
  dosage: "500 mg",
  frequency: "Twice a day",
  purpose: "Manage blood sugar levels",
  instructions: "Take with meals",
  prescribedBy: "Dr. Smith",
  warnings: "May cause dizziness",
  isActive: true,
  scheduledAt: ["2099-01-01T08:00:00", "2099-01-01T20:00:00"],
};

const completedMedication = {
  medicationId: "med-2",
  careTeamId: "team-1",
  patientId: "patient-1",
  name: "Aspirin",
  dosage: "100 mg",
  frequency: "Once a day",
  purpose: "Prevent blood clots",
  instructions: "Take with water",
  prescribedBy: "Dr. Brown",
  warnings: "May cause stomach upset",
  isActive: true,
  scheduledAt: ["2099-01-01T09:00:00"],
  medicationLog: {
    caregiverId: "caregiver-1",
    firstName: "Alice",
    lastName: "Johnson",
    takenAt: "2026-03-13T09:00:00",
    isCompleted: true,
  },
};

const archivedMedication = {
  medicationId: "med-3",
  careTeamId: "team-1",
  patientId: "patient-1",
  name: "Lisinopril",
  dosage: "10 mg",
  frequency: "Once a day",
  purpose: "Manage blood pressure",
  instructions: "Take in the morning",
  prescribedBy: "Dr. Johnson",
  warnings: "May cause dizziness",
  isActive: false,
  scheduledAt: ["2099-01-01T07:00:00"],
};

describe("MedicationTracker (Integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    repoMocks.mockGetMeds.mockResolvedValue([
      activeMedication,
      completedMedication,
    ]);
    repoMocks.mockGetArchived.mockResolvedValue([archivedMedication]);
    repoMocks.mockMark.mockResolvedValue(undefined);
    repoMocks.mockUnmark.mockResolvedValue(undefined);
    repoMocks.mockAdd.mockResolvedValue(undefined);
    repoMocks.mockUpdate.mockResolvedValue(undefined);
    repoMocks.mockArchive.mockResolvedValue(undefined);

    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page and loads medications", async () => {
    render(<MedicationTracker />);

    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(repoMocks.mockGetMeds).toHaveBeenCalledWith("patient-1");
      expect(repoMocks.mockGetArchived).toHaveBeenCalledWith("patient-1");
    });

    expect(await screen.findAllByText("Metformin")).not.toHaveLength(0);
    expect(screen.getAllByText("Aspirin")).not.toHaveLength(0);
  });

  it("shows stat cards correctly", async () => {
    render(<MedicationTracker />);

    expect(await screen.findByText(/currently prescribed/i)).toBeInTheDocument();
    expect(screen.getByText(/marked as completed/i)).toBeInTheDocument();
    expect(screen.getByText(/still left for today/i)).toBeInTheDocument();
  });

  it("toggles an incomplete medication as taken", async () => {
    render(<MedicationTracker />);

    const checkbox = await screen.findByLabelText(/mark metformin as taken/i);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(repoMocks.mockMark).toHaveBeenCalledWith("med-1", "caregiver-1");
    });
  });

  it("opens add medication modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /add medication/i }));

    expect(await screen.findByText(/save medication/i)).toBeInTheDocument();
  });

  it("opens archived medications modal", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /view archived/i }));

    expect(
      await screen.findByRole("heading", { name: /archived medications/i }),
    ).toBeInTheDocument();

    expect(screen.getByText("Lisinopril")).toBeInTheDocument();
  });

  it("shows medication details for the selected medication", async () => {
    render(<MedicationTracker />);

    expect(await screen.findByText(/manage blood sugar levels/i)).toBeInTheDocument();
    expect(screen.getByText(/take with meals/i)).toBeInTheDocument();
    expect(screen.getByText(/dr\. smith/i)).toBeInTheDocument();
  });

  it("opens edit modal from the active medication card", async () => {
    render(<MedicationTracker />);

    const medCard = await screen.findByRole("button", {
      name: /select metformin/i,
    });

    const editButton = medCard.querySelector("button");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton!);

    expect(await screen.findByText(/edit medication/i)).toBeInTheDocument();
  });

  it("saves a new medication", async () => {
    render(<MedicationTracker />);

    fireEvent.click(screen.getByRole("button", { name: /add medication/i }));

    expect(await screen.findByText(/save medication/i)).toBeInTheDocument();

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "Vitamin D" } });
    fireEvent.change(textboxes[1], { target: { value: "1000 IU" } });
    fireEvent.change(textboxes[2], { target: { value: "Once daily" } });

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    await waitFor(() => {
      expect(repoMocks.mockAdd).toHaveBeenCalled();
    });
  });

  it("saves an edited medication", async () => {
    render(<MedicationTracker />);

    const medCard = await screen.findByRole("button", {
      name: /select metformin/i,
    });

    const editButton = medCard.querySelector("button");
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton!);

    expect(await screen.findByText(/edit medication/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    await waitFor(() => {
      expect(repoMocks.mockUpdate).toHaveBeenCalled();
    });
  });

  it("archives the selected medication", async () => {
    render(<MedicationTracker />);

    const medCard = await screen.findByRole("button", {
      name: /select metformin/i,
    });
    fireEvent.click(medCard);

    const archiveButton = await screen.findByRole("button", {
      name: /^archive$/i,
    });
    fireEvent.click(archiveButton);

    await waitFor(() => {
      expect(repoMocks.mockArchive).toHaveBeenCalledWith("med-1");
    });
  });
});