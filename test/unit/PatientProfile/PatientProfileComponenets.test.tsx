/**
 * @vitest-environment jsdom
 */

import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import PatientContactSection from "../../../src/components/patientProfile/PatientContactSection";
import PatientMedicalSection from "../../../src/components/patientProfile/PatientMedicalSection";
import PatientInsuranceSection from "../../../src/components/patientProfile/PatientInsuranceSection";
import PatientPhysicianSection from "../../../src/components/patientProfile/PatientPhysicianSection";
import PatientNotesSection from "../../../src/components/patientProfile/PatientNotesSection";
import PatientConditionsSection from "../../../src/components/patientProfile/PatientConditionsSection";
import EmergencyContactsSection from "../../../src/components/patientProfile/EmergencyContactsSection";
import SectionEditActions from "../../../src/components/patientProfile/SectionEditActions";
import { patients } from "../../../src/data/data";

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

describe("Patient Profile component tests", () => {
  it("renders PatientContactSection in read mode", () => {
    render(
      <PatientContactSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("123 Main Street")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders PatientContactSection in edit mode and calls onChange", () => {
    const onChange = vi.fn();

    render(
      <PatientContactSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("John"), {
      target: { value: "Johnny" },
    });

    expect(onChange).toHaveBeenCalledWith("firstName", "Johnny");
  });

  it("renders PatientMedicalSection in read mode", () => {
    render(
      <PatientMedicalSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
        onAllergyChange={vi.fn()}
        onAddAllergy={vi.fn()}
        onRemoveAllergy={vi.fn()}
      />,
    );

    expect(screen.getByText(/medical information/i)).toBeInTheDocument();
    expect(screen.getByText("1950-01-01")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("A+")).toBeInTheDocument();
    expect(screen.getByText("180 cm")).toBeInTheDocument();
    expect(screen.getByText("80 kg")).toBeInTheDocument();
    expect(screen.getByText("Low sodium diet")).toBeInTheDocument();
    expect(screen.getByText("Penicillin")).toBeInTheDocument();
  });

  it("calls onAllergyChange in PatientMedicalSection", () => {
    const onAllergyChange = vi.fn();

    render(
      <PatientMedicalSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
        onAllergyChange={onAllergyChange}
        onAddAllergy={vi.fn()}
        onRemoveAllergy={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("Penicillin"), {
      target: { value: "Dust" },
    });

    expect(onAllergyChange).toHaveBeenCalledWith(0, "Dust");
  });

  it("calls onAddAllergy in PatientMedicalSection", () => {
    const onAddAllergy = vi.fn();

    render(
      <PatientMedicalSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
        onAllergyChange={vi.fn()}
        onAddAllergy={onAddAllergy}
        onRemoveAllergy={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /add allergy/i }));
    expect(onAddAllergy).toHaveBeenCalledTimes(1);
  });

  it("calls onRemoveAllergy in PatientMedicalSection", () => {
    const onRemoveAllergy = vi.fn();

    render(
      <PatientMedicalSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
        onAllergyChange={vi.fn()}
        onAddAllergy={vi.fn()}
        onRemoveAllergy={onRemoveAllergy}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /remove allergy 1/i }));
    expect(onRemoveAllergy).toHaveBeenCalledWith(0);
  });

  it("renders PatientInsuranceSection and calls onChange in edit mode", () => {
    const onChange = vi.fn();

    render(
      <PatientInsuranceSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("HealthCare Inc."), {
      target: { value: "Better Health" },
    });

    expect(onChange).toHaveBeenCalledWith("insuranceProvider", "Better Health");
  });

  it("renders PatientPhysicianSection in read mode", () => {
    render(
      <PatientPhysicianSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/primary care physician/i)).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("(555) 999-8888")).toBeInTheDocument();
    expect(screen.getByText("456 Clinic Ave")).toBeInTheDocument();
  });

  it("renders PatientNotesSection and calls onViewNotes", () => {
    const onViewNotes = vi.fn();

    render(
      <PatientNotesSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
        onViewNotes={onViewNotes}
      />,
    );

    expect(screen.getByText(/care notes & preferences/i)).toBeInTheDocument();
    expect(
      screen.getByText("Needs help with morning routine."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /view notes/i }));
    expect(onViewNotes).toHaveBeenCalledTimes(1);
  });

  it("renders PatientConditionsSection in read mode", () => {
    render(
      <PatientConditionsSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onConditionChange={vi.fn()}
        onAddCondition={vi.fn()}
        onRemoveCondition={vi.fn()}
      />,
    );

    expect(screen.getByText(/medical conditions/i)).toBeInTheDocument();
    expect(screen.getByText("Diabetes")).toBeInTheDocument();
  });

  it("calls add and remove condition handlers", () => {
    const onAddCondition = vi.fn();
    const onRemoveCondition = vi.fn();
    const onConditionChange = vi.fn();

    render(
      <PatientConditionsSection
        patient={mockPatient}
        draft={{ ...mockPatient, conditions: ["Diabetes", "Asthma"] }}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onConditionChange={onConditionChange}
        onAddCondition={onAddCondition}
        onRemoveCondition={onRemoveCondition}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /add condition/i }));
    expect(onAddCondition).toHaveBeenCalledTimes(1);

    const conditionInputs = screen.getAllByPlaceholderText(/enter condition/i);
    fireEvent.change(conditionInputs[0], {
      target: { value: "Updated Diabetes" },
    });
    expect(onConditionChange).toHaveBeenCalledWith(0, "Updated Diabetes");

    fireEvent.click(screen.getByRole("button", { name: /remove condition 1/i }));
    expect(onRemoveCondition).toHaveBeenCalledWith(0);
  });

  it("renders EmergencyContactsSection in read mode", () => {
    render(
      <EmergencyContactsSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={false}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/emergency contacts/i)).toBeInTheDocument();
    expect(screen.getByText("Mary Doe")).toBeInTheDocument();
    expect(screen.getByText("Spouse")).toBeInTheDocument();
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("calls onChange in EmergencyContactsSection edit mode", () => {
    const onChange = vi.fn();

    render(
      <EmergencyContactsSection
        patient={mockPatient}
        draft={mockPatient}
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByDisplayValue("Mary Doe"), {
      target: { value: "Sarah Doe" },
    });

    expect(onChange).toHaveBeenCalledWith("emergencyContactName", "Sarah Doe");
  });

  it("renders SectionEditActions in non-editing state", () => {
    const onEdit = vi.fn();

    render(
      <SectionEditActions
        isEditing={false}
        isSaving={false}
        onEdit={onEdit}
        onCancel={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("renders SectionEditActions in editing state and calls save/cancel", () => {
    const onCancel = vi.fn();
    const onSave = vi.fn();

    render(
      <SectionEditActions
        isEditing={true}
        isSaving={false}
        onEdit={vi.fn()}
        onCancel={onCancel}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});