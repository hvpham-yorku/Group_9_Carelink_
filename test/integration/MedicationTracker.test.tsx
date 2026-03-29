/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MedicationTracker from "../../../src/pages/MedicationTracker";
import { useAuth } from "../../../src/hooks/useAuth";
import { usePatient } from "../../../src/contexts/patient/usePatient";
import { medicationService } from "../../../src/services/medicationService";
import { teamService } from "../../../src/services/teamService";

vi.mock("../../../src/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../src/contexts/patient/usePatient", () => ({
  usePatient: vi.fn(),
}));

vi.mock("../../../src/services/medicationService", () => ({
  medicationService: {
    getPrescriptionsByPatient: vi.fn(),
    markAsTaken: vi.fn(),
    unmarkAsTaken: vi.fn(),
    addPrescription: vi.fn(),
    updatePrescription: vi.fn(),
    archivePrescription: vi.fn(),
  },
}));

vi.mock("../../../src/services/teamService", () => ({
  teamService: {
    getCareTeamIdByPatient: vi.fn(),
  },
}));

const mockedUseAuth = vi.mocked(useAuth);
const mockedUsePatient = vi.mocked(usePatient);
const mockedMedicationService = vi.mocked(medicationService);
const mockedTeamService = vi.mocked(teamService);

const mockPrescriptions = [
  {
    prescriptionId: "rx-1",
    careTeamId: "team-1",
    patientId: "patient-1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    scheduledAt: "2026-03-13T08:00:00.000Z",
    isActive: true,
    medicationLogs: [],
  },
  {
    prescriptionId: "rx-2",
    careTeamId: "team-1",
    patientId: "patient-1",
    name: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    scheduledAt: "2026-03-13T09:00:00.000Z",
    isActive: true,
    medicationLogs: [
      {
        caregiverId: "cg-1",
        takenAt: "2026-03-13T09:00:00.000Z",
        isCompleted: true,
        caregivers: {
          firstName: "Saneea",
          lastName: "Khalid",
        },
      },
    ],
  },
];

describe("MedicationTracker integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: { id: "caregiver-1" },
    } as any);

    mockedUsePatient.mockReturnValue({
      selectedPatientId: "patient-1",
      loading: false,
    } as any);

    mockedMedicationService.getPrescriptionsByPatient.mockResolvedValue(
      mockPrescriptions as any,
    );
  });

  it("renders fetched medications and main sections", async () => {
    render(<MedicationTracker />);

    expect(
      screen.getByRole("heading", { name: /medication tracker/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    expect(
      screen.getByRole("heading", { name: /today's medication schedule/i }),
    ).toBeInTheDocument();

    expect(screen.getAllByText(/active medications/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/medication details/i)).toBeInTheDocument();
  });

  it("shows no patient selected message when no patient is selected", () => {
    mockedUsePatient.mockReturnValue({
      selectedPatientId: null,
      loading: false,
    } as any);

    render(<MedicationTracker />);

    expect(
      screen.getByText(
        /no patient selected\. please select a patient from the sidebar\./i,
      ),
    ).toBeInTheDocument();
  });

  it("shows empty states when there are no prescriptions", async () => {
    mockedMedicationService.getPrescriptionsByPatient.mockResolvedValue([] as any);

    render(<MedicationTracker />);

    await waitFor(() => {
      expect(
        screen.getByText(/no active prescriptions found for this patient\./i),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/no medications available to display\./i),
    ).toBeInTheDocument();
  });

  it("opens the add medication modal", async () => {
    const user = userEvent.setup();

    render(<MedicationTracker />);

    await waitFor(() => {
      expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: /add medication/i }));

    expect(
      screen.getByRole("heading", { name: /add medication/i }),
    ).toBeInTheDocument();
  });

  it("adds a new medication", async () => {
    const user = userEvent.setup();

    mockedMedicationService.addPrescription.mockResolvedValue({} as any);
    mockedTeamService.getCareTeamIdByPatient.mockResolvedValue("team-1" as any);

    render(<MedicationTracker />);

    await waitFor(() => {
      expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: /add medication/i }));

    await user.type(
      screen.getByPlaceholderText(/enter medication name/i),
      "Vitamin D",
    );
    await user.type(
      screen.getByPlaceholderText(/example: 500mg/i),
      "1000 IU",
    );
    await user.type(
      screen.getByPlaceholderText(/example: twice daily/i),
      "Once daily",
    );

    const timeInput = screen.getByDisplayValue("") as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: "10:30" } });

    await user.click(screen.getByRole("button", { name: /save medication/i }));

    await waitFor(() => {
      expect(mockedMedicationService.addPrescription).toHaveBeenCalled();
    });

    expect(mockedMedicationService.addPrescription).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: "patient-1",
        careTeamId: "team-1",
        name: "Vitamin D",
        dosage: "1000 IU",
        frequency: "Once daily",
      }),
    );
  });

  it("toggles medication as taken", async () => {
    mockedMedicationService.markAsTaken.mockResolvedValue({} as any);

    render(<MedicationTracker />);

    await waitFor(() => {
      expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    fireEvent.click(
      screen.getByRole("checkbox", { name: /mark metformin as taken/i }),
    );

    await waitFor(() => {
      expect(mockedMedicationService.markAsTaken).toHaveBeenCalledWith(
        "rx-1",
        "caregiver-1",
      );
    });
  });

  it("archives the selected medication after confirmation", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    mockedMedicationService.archivePrescription.mockResolvedValue(true as any);

    render(<MedicationTracker />);

    await waitFor(() => {
      expect(screen.getAllByText(/metformin/i).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: /select metformin/i }));
    await user.click(screen.getByRole("button", { name: /archive/i }));

    await waitFor(() => {
      expect(mockedMedicationService.archivePrescription).toHaveBeenCalledWith(
        "rx-1",
      );
    });

    confirmSpy.mockRestore();
  });
});