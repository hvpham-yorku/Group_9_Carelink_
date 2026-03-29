/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ActiveMedicationCard from "../../../src/components/medication/ActiveMedicationCard";
import MedicationDetailsCard from "../../../src/components/medication/MedicationDetailsCard";
import MedicationFormModal from "../../../src/components/medication/MedicationFormModal";
import MedicationScheduleItem from "../../../src/components/medication/MedicationScheduleItem";

describe("Medication component tests", () => {
  it("renders ActiveMedicationCard and responds to click", () => {
    const handleClick = vi.fn();

    render(
      <ActiveMedicationCard
        name="Metformin"
        dosage="500mg"
        frequency="Twice daily"
        isSelected={false}
        isCompleted={false}
        onClick={handleClick}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /select metformin/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders taken badge when medication is completed", () => {
    render(
      <ActiveMedicationCard
        name="Aspirin"
        dosage="81mg"
        frequency="Once daily"
        isSelected={false}
        isCompleted={true}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/taken/i)).toBeInTheDocument();
  });

  it("renders MedicationDetailsCard empty state", () => {
    render(<MedicationDetailsCard medication={null} />);

    expect(
      screen.getByText(
        /select a medication from the list above to view more details\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders MedicationDetailsCard data", () => {
    render(
      <MedicationDetailsCard
        medication={{
          prescriptionId: "rx-1",
          careTeamId: "team-1",
          patientId: "patient-1",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          scheduledAt: "2026-03-13T08:00:00.000Z",
          isActive: true,
        }}
      />,
    );

    expect(screen.getByText(/metformin/i)).toBeInTheDocument();
    expect(screen.getByText(/500mg/i)).toBeInTheDocument();
    expect(screen.getByText(/twice daily/i)).toBeInTheDocument();
    expect(screen.getByText(/purpose/i)).toBeInTheDocument();
    expect(screen.getAllByText(/not available/i).length).toBeGreaterThan(0);
  });

  it("renders MedicationFormModal and submits entered data", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <MedicationFormModal
        isOpen={true}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/enter medication name/i), {
      target: { value: "Vitamin D" },
    });

    fireEvent.change(screen.getByPlaceholderText(/example: 500mg/i), {
      target: { value: "1000 IU" },
    });

    fireEvent.change(screen.getByPlaceholderText(/example: twice daily/i), {
      target: { value: "Once daily" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    expect(onSave).toHaveBeenCalledWith({
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      scheduledAt: "",
    });
  });

  it("does not submit modal when required fields are empty", () => {
    const onSave = vi.fn();

    render(
      <MedicationFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onToggle when schedule checkbox is clicked", () => {
    const onToggle = vi.fn();

    render(
      <MedicationScheduleItem
        prescriptionId="rx-1"
        careTeamId="team-1"
        patientId="patient-1"
        name="Metformin"
        dosage="500mg"
        frequency="Twice daily"
        scheduledAt="2026-03-13T08:00:00.000Z"
        isActive={true}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(
      screen.getByRole("checkbox", { name: /mark metformin as taken/i }),
    );

    expect(onToggle).toHaveBeenCalledWith("rx-1", false);
  });

  it("shows taken information when medication has a completed log", () => {
    const onToggle = vi.fn();

    render(
      <MedicationScheduleItem
        prescriptionId="rx-2"
        careTeamId="team-1"
        patientId="patient-1"
        name="Aspirin"
        dosage="81mg"
        frequency="Once daily"
        scheduledAt="2026-03-13T09:00:00.000Z"
        isActive={true}
        medicationLog={{
          caregiverId: "cg-1",
          firstName: "Saneea",
          lastName: "Khalid",
          takenAt: "2026-03-13T09:00:00.000Z",
          isCompleted: true,
        }}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByText(/taken at:/i)).toBeInTheDocument();
    expect(screen.getByText(/by:/i)).toBeInTheDocument();
    expect(screen.getByText(/saneea khalid/i)).toBeInTheDocument();
  });
});