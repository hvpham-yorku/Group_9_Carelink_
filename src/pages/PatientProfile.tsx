import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Top banner components
import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";

// Patient profile sections
import PatientContactSection from "../components/patientProfile/PatientContactSection";
import PatientMedicalSection from "../components/patientProfile/PatientMedicalSection";
import PatientInsuranceSection from "../components/patientProfile/PatientInsuranceSection";
import PatientPhysicianSection from "../components/patientProfile/PatientPhysicianSection";
import PatientNotesSection from "../components/patientProfile/PatientNotesSection";
import PatientConditionsSection from "../components/patientProfile/PatientConditionsSection";
import EmergencyContactsSection from "../components/patientProfile/EmergencyContactsSection";

// Types + data/context
import type { AllPatientInfo } from "../types/patient";
import { usePatient } from "../contexts/patient/usePatient";
import { repositories } from "../data";

const patientRepo = repositories.patient;

// Tracks which section is currently being edited or saved
type EditableSection =
  | "contact"
  | "medical"
  | "insurance"
  | "physician"
  | "conditions"
  | "emergency"
  | "notes"
  | null;

const PatientProfile = () => {
  // Selected patient from context
  const { selectedPatientId } = usePatient();
  const navigate = useNavigate();

  // Main page state
  const [patient, setPatient] = useState<AllPatientInfo | null>(null);
  const [draftPatient, setDraftPatient] = useState<AllPatientInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingSection, setSavingSection] = useState<EditableSection>(null);
  const [editingSection, setEditingSection] = useState<EditableSection>(null);

  // Fetch patient details whenever the selected patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setPatient(null);
      setDraftPatient(null);
      return;
    }

    const fetchPatient = async () => {
      setLoading(true);
      try {
        const data = await patientRepo.getPatientDetails(selectedPatientId);
        setPatient(data);
        setDraftPatient({
          ...data,
          allergies: [...(data.allergies || [])],
          conditions: [...(data.conditions || [])],
        });
      } catch (err) {
        console.error("Failed to load patient profile:", err);
        setPatient(null);
        setDraftPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [selectedPatientId]);

  // Start editing one section at a time
  const startEditing = (section: EditableSection) => {
    if (!patient) return;

    setDraftPatient({
      ...patient,
      allergies: [...(patient.allergies || [])],
      conditions: [...(patient.conditions || [])],
    });

    setEditingSection(section);
  };

  // Cancel edits and reset draft back to saved patient data
  const cancelEditing = () => {
    setDraftPatient(
      patient
        ? {
            ...patient,
            allergies: [...(patient.allergies || [])],
            conditions: [...(patient.conditions || [])],
          }
        : null,
    );
    setEditingSection(null);
  };

  // Save only the section currently being edited
  const saveSection = async (section: EditableSection) => {
    if (!patient || !draftPatient || !section) return;

    setSavingSection(section);

    try {
      let updated: AllPatientInfo;

      if (section === "contact") {
        updated = await patientRepo.updatePatientContactInfo(
          patient.patientId,
          {
            firstName: draftPatient.firstName,
            lastName: draftPatient.lastName,
            address: draftPatient.address,
            phoneNumber: draftPatient.phoneNumber,
            email: draftPatient.email,
          },
        );
      } else if (section === "medical") {
        updated = await patientRepo.updatePatientMedicalInfo(
          patient.patientId,
          {
            dob: draftPatient.dob,
            gender: draftPatient.gender,
            bloodType: draftPatient.bloodType,
            height: draftPatient.height,
            weight: draftPatient.weight,
            dietaryRequirements: draftPatient.dietaryRequirements,
            allergies: (draftPatient.allergies || [])
              .map((allergy) => allergy.trim())
              .filter(Boolean),
          },
        );
      } else if (section === "insurance") {
        updated = await patientRepo.updatePatientInsuranceInfo(
          patient.patientId,
          {
            insuranceProvider: draftPatient.insuranceProvider,
            insurancePolicyNumber: draftPatient.insurancePolicyNumber,
            groupNumber: draftPatient.groupNumber,
          },
        );
      } else if (section === "physician") {
        updated = await patientRepo.updatePatientPhysicianInfo(
          patient.patientId,
          {
            physicianName: draftPatient.physicianName,
            physicianSpecialty: draftPatient.physicianSpecialty,
            physicianPhone: draftPatient.physicianPhone,
            physicianAddress: draftPatient.physicianAddress,
          },
        );
      } else if (section === "conditions") {
        updated = await patientRepo.updatePatientConditions(patient.patientId, {
          conditions: (draftPatient.conditions || [])
            .map((condition) => condition.trim())
            .filter(Boolean),
        });
      } else if (section === "emergency") {
        updated = await patientRepo.updatePatientEmergencyContact(
          patient.patientId,
          {
            emergencyContactName: draftPatient.emergencyContactName,
            emergencyContactPhone: draftPatient.emergencyContactPhone,
            emergencyContactRelationship:
              draftPatient.emergencyContactRelationship,
          },
        );
      } else if (section === "notes") {
        updated = await patientRepo.updatePatientNotes(patient.patientId, {
          careNotes: draftPatient.careNotes,
        });
      } else {
        return;
      }

      // Update both saved data and draft after a successful save
      setPatient(updated);
      setDraftPatient({
        ...updated,
        allergies: [...(updated.allergies || [])],
        conditions: [...(updated.conditions || [])],
      });
      setEditingSection(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`Failed to save ${section} section:`, {
          message: err.message,
          stack: err.stack,
        });
      } else {
        console.error(
          `Failed to save ${section} section - raw error:`,
          JSON.stringify(err, null, 2),
        );
      }
    } finally {
      setSavingSection(null);
    }
  };

  // Generic field change handler for text-based fields
  const handleFieldChange = (field: keyof AllPatientInfo, value: string) => {
    if (!draftPatient) return;

    setDraftPatient({
      ...draftPatient,
      [field]: value,
    });
  };

  // Update one allergy in the allergies list
  const handleAllergyChange = (index: number, value: string) => {
    if (!draftPatient) return;

    const updatedAllergies = [...(draftPatient.allergies || [])];
    updatedAllergies[index] = value;

    setDraftPatient({
      ...draftPatient,
      allergies: updatedAllergies,
    });
  };

  // Add a new empty allergy field
  const addAllergy = () => {
    if (!draftPatient) return;

    setDraftPatient({
      ...draftPatient,
      allergies: [...(draftPatient.allergies || []), ""],
    });
  };

  // Remove an allergy by index
  const removeAllergy = (index: number) => {
    if (!draftPatient) return;

    const updatedAllergies = [...(draftPatient.allergies || [])];
    updatedAllergies.splice(index, 1);

    setDraftPatient({
      ...draftPatient,
      allergies: updatedAllergies,
    });
  };

  // Update one condition in the conditions list
  const handleConditionChange = (index: number, value: string) => {
    if (!draftPatient) return;

    const updatedConditions = [...(draftPatient.conditions || [])];
    updatedConditions[index] = value;

    setDraftPatient({
      ...draftPatient,
      conditions: updatedConditions,
    });
  };

  // Add a new empty condition field
  const addCondition = () => {
    if (!draftPatient) return;

    setDraftPatient({
      ...draftPatient,
      conditions: [...(draftPatient.conditions || []), ""],
    });
  };

  // Remove a condition by index
  const removeCondition = (index: number) => {
    if (!draftPatient) return;

    const updatedConditions = [...(draftPatient.conditions || [])];
    updatedConditions.splice(index, 1);

    setDraftPatient({
      ...draftPatient,
      conditions: updatedConditions,
    });
  };

  // Loading state while patient data is being fetched
  if (loading) {
    return (
      <div className="container py-4 text-center">
        <span className="spinner-border spinner-border-sm me-2" />
        Loading patient profile...
      </div>
    );
  }

  // Empty state if no patient is selected
  if (!patient || !draftPatient) {
    return (
      <div className="container py-4 text-center text-muted">
        No patient selected.
      </div>
    );
  }

  // While editing some sections, show draft values in the top banner
  const bannerPatient =
    editingSection === "medical" ||
    editingSection === "conditions" ||
    editingSection === "contact"
      ? draftPatient
      : patient;

  return (
    <div className="container py-4">
      <CustomTitleBanner
        title="Patient Profile"
        subheader="View and manage patient details"
      />

      <div className="mb-4">
        <PatientInfoBanner patient={bannerPatient} />
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <PatientContactSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "contact"}
            isSaving={savingSection === "contact"}
            onEdit={() => startEditing("contact")}
            onCancel={cancelEditing}
            onSave={() => saveSection("contact")}
            onChange={handleFieldChange}
          />

          <PatientMedicalSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "medical"}
            isSaving={savingSection === "medical"}
            onEdit={() => startEditing("medical")}
            onCancel={cancelEditing}
            onSave={() => saveSection("medical")}
            onChange={handleFieldChange}
            onAllergyChange={handleAllergyChange}
            onAddAllergy={addAllergy}
            onRemoveAllergy={removeAllergy}
          />

          <PatientInsuranceSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "insurance"}
            isSaving={savingSection === "insurance"}
            onEdit={() => startEditing("insurance")}
            onCancel={cancelEditing}
            onSave={() => saveSection("insurance")}
            onChange={handleFieldChange}
          />
        </div>

        <div className="col-lg-8">
          <EmergencyContactsSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "emergency"}
            isSaving={savingSection === "emergency"}
            onEdit={() => startEditing("emergency")}
            onCancel={cancelEditing}
            onSave={() => saveSection("emergency")}
            onChange={handleFieldChange}
          />

          <PatientPhysicianSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "physician"}
            isSaving={savingSection === "physician"}
            onEdit={() => startEditing("physician")}
            onCancel={cancelEditing}
            onSave={() => saveSection("physician")}
            onChange={handleFieldChange}
          />

          <PatientConditionsSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "conditions"}
            isSaving={savingSection === "conditions"}
            onEdit={() => startEditing("conditions")}
            onCancel={cancelEditing}
            onSave={() => saveSection("conditions")}
            onConditionChange={handleConditionChange}
            onAddCondition={addCondition}
            onRemoveCondition={removeCondition}
          />

          <PatientNotesSection
            patient={patient}
            draft={draftPatient}
            isEditing={editingSection === "notes"}
            isSaving={savingSection === "notes"}
            onEdit={() => startEditing("notes")}
            onCancel={cancelEditing}
            onSave={() => saveSection("notes")}
            onChange={handleFieldChange}
            onViewNotes={() => navigate("/notes")}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;