/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ActiveMedicationCard from "../../../src/components/medication/ActiveMedicationCard";
import AdherenceOverviewChart from "../../../src/components/medication/AdherenceOverviewChart";
import ArchivedMedicationsModal from "../../../src/components/medication/ArchivedMedicationsModal";
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

    expect(screen.getByText("Metformin")).toBeInTheDocument();
    expect(screen.getByText(/500mg/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /select metformin/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows selected and taken badges in ActiveMedicationCard", () => {
    render(
      <ActiveMedicationCard
        name="Metformin"
        dosage="500mg"
        frequency="Twice daily"
        isSelected={true}
        isCompleted={true}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Selected")).toBeInTheDocument();
    expect(screen.getByText("Taken")).toBeInTheDocument();
  });

  it("calls onEdit without also calling onClick", () => {
    const handleClick = vi.fn();
    const handleEdit = vi.fn();

    const { container } = render(
      <ActiveMedicationCard
        name="Metformin"
        dosage="500mg"
        frequency="Twice daily"
        isSelected={false}
        isCompleted={false}
        onClick={handleClick}
        onEdit={handleEdit}
      />,
    );

    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[0]);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("supports keyboard interaction in ActiveMedicationCard", () => {
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

    const card = screen.getByRole("button", { name: /select metformin/i });

    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });

    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("renders MedicationDetailsCard placeholder when no medication is selected", () => {
    render(<MedicationDetailsCard medication={null} />);

    expect(
      screen.getByText(/select a medication from the list above/i),
    ).toBeInTheDocument();
  });

  it("renders MedicationDetailsCard data", () => {
    const medication = {
      medicationId: "1",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      scheduledAt: ["2026-01-01T08:00:00", "2026-01-01T20:00:00"],
      purpose: "Bone health",
      instructions: "Take with food",
      prescribedBy: "Dr. Smith",
      warnings: "Do not exceed recommended dosage",
    };

    render(<MedicationDetailsCard medication={medication} onArchive={vi.fn()} />);

    expect(screen.getByText("Vitamin D")).toBeInTheDocument();
    expect(screen.getByText("1000 IU")).toBeInTheDocument();
    expect(screen.getByText("Once daily")).toBeInTheDocument();
    expect(screen.getByText("Bone health")).toBeInTheDocument();
    expect(screen.getByText("Take with food")).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(
      screen.getByText(/do not exceed recommended dosage/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archive/i })).toBeInTheDocument();
  });

  it("calls onArchive from MedicationDetailsCard", () => {
    const onArchive = vi.fn();

    const medication = {
      medicationId: "1",
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      scheduledAt: ["2026-01-01T08:00:00"],
    };

    render(<MedicationDetailsCard medication={medication} onArchive={onArchive} />);

    fireEvent.click(screen.getByRole("button", { name: /archive/i }));
    expect(onArchive).toHaveBeenCalledTimes(1);
  });

  it("renders MedicationFormModal and submits entered data", () => {
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <MedicationFormModal isOpen={true} onClose={onClose} onSave={onSave} />,
    );

    expect(screen.getByText(/add medication/i)).toBeInTheDocument();

    const textboxes = screen.getAllByRole("textbox");
    const nameInput = textboxes[0];
    const dosageInput = textboxes[1];
    const frequencyInput = textboxes[2];
    const purposeInput = textboxes[3];
    const instructionsInput = textboxes[4];
    const prescribedByInput = textboxes[5];
    const warningsInput = textboxes[6];

    fireEvent.change(nameInput, { target: { value: "Vitamin D" } });
    fireEvent.change(dosageInput, { target: { value: "1000 IU" } });
    fireEvent.change(frequencyInput, { target: { value: "Once daily" } });
    fireEvent.change(purposeInput, { target: { value: "Bone health" } });
    fireEvent.change(instructionsInput, {
      target: { value: "Take with food" },
    });
    fireEvent.change(prescribedByInput, {
      target: { value: "Dr. Smith" },
    });
    fireEvent.change(warningsInput, {
      target: { value: "Do not exceed dosage" },
    });

    const timeInputs = document.querySelectorAll(
      'input[type="time"]',
    ) as NodeListOf<HTMLInputElement>;
    fireEvent.change(timeInputs[0], { target: { value: "09:30" } });

    fireEvent.click(screen.getByRole("button", { name: /save medication/i }));

    expect(onSave).toHaveBeenCalledWith({
      name: "Vitamin D",
      dosage: "1000 IU",
      frequency: "Once daily",
      scheduledAt: ["09:30"],
      purpose: "Bone health",
      instructions: "Take with food",
      prescribedBy: "Dr. Smith",
      warnings: "Do not exceed dosage",
    });
  });

  it("prefills MedicationFormModal with initialData", () => {
    render(
      <MedicationFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={{
          name: "Aspirin",
          dosage: "500mg",
          frequency: "Daily",
          scheduledAt: ["08:00", "20:00"],
          purpose: "Pain relief",
          instructions: "After meals",
          prescribedBy: "Dr. Jane",
          warnings: "Avoid overdose",
        }}
      />,
    );

    expect(screen.getByText(/edit medication/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Aspirin")).toBeInTheDocument();
    expect(screen.getByDisplayValue("500mg")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Daily")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pain relief")).toBeInTheDocument();
    expect(screen.getByDisplayValue("After meals")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dr. Jane")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Avoid overdose")).toBeInTheDocument();
    expect(screen.getByDisplayValue("08:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20:00")).toBeInTheDocument();
  });

  it("adds another scheduled time in MedicationFormModal", () => {
    render(
      <MedicationFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(document.querySelectorAll('input[type="time"]')).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: /\+ add time/i }));

    expect(document.querySelectorAll('input[type="time"]')).toHaveLength(2);
  });

  it("calls onClose from MedicationFormModal", () => {
    const onClose = vi.fn();

    render(
      <MedicationFormModal
        isOpen={true}
        onClose={onClose}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render MedicationFormModal when closed", () => {
    render(
      <MedicationFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.queryByText(/add medication/i)).not.toBeInTheDocument();
  });

  it("renders ArchivedMedicationsModal empty state", () => {
    render(
      <ArchivedMedicationsModal
        isOpen={true}
        onClose={vi.fn()}
        medications={[]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /archived medications/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no archived medications found/i),
    ).toBeInTheDocument();
  });

  it("renders ArchivedMedicationsModal medication list", () => {
    render(
      <ArchivedMedicationsModal
        isOpen={true}
        onClose={vi.fn()}
        medications={[
          {
            medicationId: "1",
            name: "Vitamin D",
            dosage: "1000 IU",
            frequency: "Daily",
          },
        ]}
      />,
    );

    expect(screen.getByText("Vitamin D")).toBeInTheDocument();
    expect(screen.getByText(/1000 IU/i)).toBeInTheDocument();
    expect(screen.getAllByText(/archived/i).length).toBeGreaterThan(0);
  });

  it("calls onClose from ArchivedMedicationsModal", () => {
    const onClose = vi.fn();

    render(
      <ArchivedMedicationsModal
        isOpen={true}
        onClose={onClose}
        medications={[]}
      />,
    );

    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    fireEvent.click(closeButtons[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not render ArchivedMedicationsModal when closed", () => {
    render(
      <ArchivedMedicationsModal
        isOpen={false}
        onClose={vi.fn()}
        medications={[]}
      />,
    );

    expect(
      screen.queryByText(/archived medications/i),
    ).not.toBeInTheDocument();
  });

  it("calls onToggle when schedule checkbox is clicked", () => {
    const onToggle = vi.fn();

    render(
      <MedicationScheduleItem
        medicationId="med-1"
        name="Aspirin"
        dosage="500mg"
        frequency="Daily"
        scheduledAt={["2099-01-01T08:00:00", "2099-01-01T20:00:00"]}
        onToggle={onToggle}
      />,
    );

    fireEvent.click(screen.getByLabelText(/mark aspirin as taken/i));

    expect(onToggle).toHaveBeenCalledWith("med-1", false);
  });

  it("shows Taken state and metadata in MedicationScheduleItem", () => {
    render(
      <MedicationScheduleItem
        medicationId="med-1"
        name="Aspirin"
        dosage="500mg"
        frequency="Daily"
        scheduledAt={["2099-01-01T08:00:00"]}
        medicationLog={{
          caregiverId: "c1",
          firstName: "John",
          lastName: "Doe",
          takenAt: "2026-01-01T08:00:00",
          isCompleted: true,
        }}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByText("Taken")).toBeInTheDocument();
    expect(screen.getByText(/completed for today/i)).toBeInTheDocument();
    expect(screen.getByText(/taken at:/i)).toBeInTheDocument();
    expect(screen.getByText(/by:/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });

  it("shows Overdue state in MedicationScheduleItem", () => {
    render(
      <MedicationScheduleItem
        medicationId="med-1"
        name="Aspirin"
        dosage="500mg"
        frequency="Daily"
        scheduledAt={["2000-01-01T08:00:00"]}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText(/this medication is overdue/i)).toBeInTheDocument();
  });

  it("shows Pending state in MedicationScheduleItem", () => {
    render(
      <MedicationScheduleItem
        medicationId="med-1"
        name="Aspirin"
        dosage="500mg"
        frequency="Daily"
        scheduledAt={["2099-01-01T08:00:00"]}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText(/scheduled for today/i)).toBeInTheDocument();
  });

  it("renders AdherenceOverviewChart", () => {
    render(
      <AdherenceOverviewChart
        data={[
          { day: "Mon", taken: 1, total: 2 },
          { day: "Tue", taken: 2, total: 2 },
          { day: "Wed", taken: 0, total: 2 },
        ]}
      />,
    );

    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("2/2")).toBeInTheDocument();
    expect(screen.getByText("0/2")).toBeInTheDocument();
    expect(screen.getByText("Taken")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });
});