/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const repoMocks = vi.hoisted(() => ({
  mockGetPatientDetails: vi.fn(),
  mockUpdatePatientContactInfo: vi.fn(),
  mockUpdatePatientMedicalInfo: vi.fn(),
  mockUpdatePatientInsuranceInfo: vi.fn(),
  mockUpdatePatientPhysicianInfo: vi.fn(),
  mockUpdatePatientConditions: vi.fn(),
  mockUpdatePatientEmergencyContact: vi.fn(),
  mockUpdatePatientNotes: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock("../../src/contexts/patient/usePatient", () => ({
  usePatient: () => ({
    selectedPatientId: "patient-1",
    careTeamId: "team-1",
    loading: false,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../src/data", async () => {
  const actual = await vi.importActual<typeof import("../../src/data")>(
    "../../src/data"
  );

  return {
    ...actual,
    repositories: {
      ...actual.repositories,
      patient: {
        getPatientDetails: repoMocks.mockGetPatientDetails,
        updatePatientContactInfo: repoMocks.mockUpdatePatientContactInfo,
        updatePatientMedicalInfo: repoMocks.mockUpdatePatientMedicalInfo,
        updatePatientInsuranceInfo: repoMocks.mockUpdatePatientInsuranceInfo,
        updatePatientPhysicianInfo: repoMocks.mockUpdatePatientPhysicianInfo,
        updatePatientConditions: repoMocks.mockUpdatePatientConditions,
        updatePatientEmergencyContact: repoMocks.mockUpdatePatientEmergencyContact,
        updatePatientNotes: repoMocks.mockUpdatePatientNotes,
      },
    },
  };
});

import PatientProfile from "../../src/pages/PatientProfile";
import { patients } from "../../src/data/data";

const mockPatient = {
  ...patients[0],
  patientId: "patient-1",
  address: "123 Main Street",
  phoneNumber: "(555) 111-2222",
  email: "john.doe@example.com",
  dietaryRequirements: "Low sodium diet",
  physicianName: "Dr. Smith",
  physicianSpecialty: "Cardiology",
  physicianPhone: "(555) 999-8888",
  physicianAddress: "456 Clinic Ave",
  groupNumber: "GRP-001",
  careNotes: "Needs help with morning routine.",
  allergies: ["Penicillin"],
  conditions: ["Diabetes"],
};

describe("PatientProfile (Integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    repoMocks.mockGetPatientDetails.mockResolvedValue({ ...mockPatient });
    repoMocks.mockUpdatePatientContactInfo.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientMedicalInfo.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientInsuranceInfo.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientPhysicianInfo.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientConditions.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientEmergencyContact.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
    repoMocks.mockUpdatePatientNotes.mockImplementation(
      async (patientId, updates) => ({
        ...mockPatient,
        patientId,
        ...updates,
      }),
    );
  });

  it("renders page and loads patient details", async () => {
    render(<PatientProfile />);

expect(screen.getByText(/patient profile/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(repoMocks.mockGetPatientDetails).toHaveBeenCalledWith("patient-1");
    });

    expect(await screen.findByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main Street")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("opens contact section in edit mode and saves updated contact info", async () => {
    render(<PatientProfile />);

    await screen.findByText("John");

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const firstNameInputs = await screen.findAllByDisplayValue("John");
    fireEvent.change(firstNameInputs[0], { target: { value: "Johnny" } });

    const lastNameInputs = screen.getAllByDisplayValue("Doe");
    fireEvent.change(lastNameInputs[0], { target: { value: "Dorian" } });

    fireEvent.change(screen.getByDisplayValue("123 Main Street"), {
      target: { value: "789 New Address" },
    });

    fireEvent.change(screen.getByDisplayValue("(555) 111-2222"), {
      target: { value: "(555) 000-1111" },
    });

    fireEvent.change(screen.getByDisplayValue("john.doe@example.com"), {
      target: { value: "johnny@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(repoMocks.mockUpdatePatientContactInfo).toHaveBeenCalledWith(
        "patient-1",
        {
          firstName: "Johnny",
          lastName: "Dorian",
          address: "789 New Address",
          phoneNumber: "(555) 000-1111",
          email: "johnny@example.com",
        },
      );
    });

    expect(await screen.findByText("Johnny")).toBeInTheDocument();
    expect(screen.getByText("Dorian")).toBeInTheDocument();
  });

  it("cancels editing without saving changes", async () => {
    render(<PatientProfile />);

    await screen.findByText("John");

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);

    const firstNameInputs = await screen.findAllByDisplayValue("John");
    fireEvent.change(firstNameInputs[0], { target: { value: "Changed Name" } });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    expect(
      repoMocks.mockUpdatePatientContactInfo,
    ).not.toHaveBeenCalled();
  });

it("saves updated medical information including allergies", async () => {
  render(<PatientProfile />);

  await screen.findByText("John");

  const editButtons = screen.getAllByRole("button", { name: /edit/i });
  fireEvent.click(editButtons[1]);

  await screen.findByDisplayValue("1950-01-01");

  fireEvent.change(screen.getByDisplayValue("1950-01-01"), {
    target: { value: "1951-02-02" },
  });

  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "Other" },
  });

  fireEvent.change(screen.getByDisplayValue("A+"), {
    target: { value: "B+" },
  });

  fireEvent.change(screen.getByDisplayValue("180 cm"), {
    target: { value: "182 cm" },
  });

  fireEvent.change(screen.getByDisplayValue("80 kg"), {
    target: { value: "81 kg" },
  });

  fireEvent.change(screen.getByDisplayValue("Low sodium diet"), {
    target: { value: "Diabetic diet" },
  });

  fireEvent.change(screen.getByDisplayValue("Penicillin"), {
    target: { value: "Dust" },
  });

  const saveButton = await screen.findByRole("button", { name: /save/i });
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(repoMocks.mockUpdatePatientMedicalInfo).toHaveBeenCalledWith(
      "patient-1",
      expect.objectContaining({
        dob: "1951-02-02",
        gender: "Other",
        bloodType: "B+",
        height: "182 cm",
        weight: "81 kg",
        dietaryRequirements: "Diabetic diet",
        allergies: ["Dust"],
      }),
    );
  });
});

  it("adds and saves medical conditions", async () => {
    render(<PatientProfile />);

    await screen.findByText("John");

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[5]);

    expect(await screen.findByDisplayValue("Diabetes")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /add condition/i }));

    const conditionInputs = screen.getAllByPlaceholderText(/enter condition/i);
    fireEvent.change(conditionInputs[1], { target: { value: "Asthma" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(repoMocks.mockUpdatePatientConditions).toHaveBeenCalledWith(
        "patient-1",
        {
          conditions: ["Diabetes", "Asthma"],
        },
      );
    });
  });

  it("saves updated emergency contact information", async () => {
    render(<PatientProfile />);

    await screen.findByText("John");

    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[3]);

    fireEvent.change(screen.getByDisplayValue("Mary Doe"), {
      target: { value: "Sarah Doe" },
    });

    fireEvent.change(screen.getByDisplayValue("Spouse"), {
      target: { value: "Daughter" },
    });

    fireEvent.change(screen.getByDisplayValue("(555) 123-4567"), {
      target: { value: "(555) 444-3333" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(repoMocks.mockUpdatePatientEmergencyContact).toHaveBeenCalledWith(
        "patient-1",
        {
          emergencyContactName: "Sarah Doe",
          emergencyContactPhone: "(555) 444-3333",
          emergencyContactRelationship: "Daughter",
        },
      );
    });
  });

  it("navigates to notes page when View Notes is clicked", async () => {
    render(<PatientProfile />);

    await screen.findByText("John");

    fireEvent.click(screen.getByRole("button", { name: /view notes/i }));

    expect(navigateMock).toHaveBeenCalledWith("/notes");
  });
  });
