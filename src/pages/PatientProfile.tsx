import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";

import PatientContactSection from "../components/patientProfile/PatientContactSection";
import PatientMedicalSection from "../components/patientProfile/PatientMedicalSection";
import PatientInsuranceSection from "../components/patientProfile/PatientInsuranceSection";
import PatientPhysicianSection from "../components/patientProfile/PatientPhysicianSection";
import PatientNotesSection from "../components/patientProfile/PatientNotesSection";
import PatientConditionsSection from "../components/patientProfile/PatientConditionsSection";
import EmergencyContactsSection from "../components/patientProfile/EmergencyContactsSection";

import type { AllPatientInfo } from "../types/patient";
import { usePatient } from "../contexts/patient/usePatient";
import { repositories } from "../data";

const patientRepo = repositories.patient;

type EditableSection =
  | "contact"
  | "medical"
  | "insurance"
  | "physician"
  | "conditions"
  | "emergency"
  | null;

const PatientProfile = () => {
  const { selectedPatientId } = usePatient();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<AllPatientInfo | null>(null);
  const [draftPatient, setDraftPatient] = useState<AllPatientInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingSection, setSavingSection] = useState<EditableSection>(null);
  const [editingSection, setEditingSection] = useState<EditableSection>(null);

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
        setDraftPatient(data);
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

  const startEditing = (section: EditableSection) => {
    if (!patient) return;
    setDraftPatient({ ...patient });
    setEditingSection(section);
  };

  const cancelEditing = () => {
    setDraftPatient(patient ? { ...patient } : null);
    setEditingSection(null);
  };

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
            allergies: draftPatient.allergies,
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
          conditions: draftPatient.conditions,
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
      } else {
        return;
      }

      setPatient(updated);
      setDraftPatient(updated);
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

  const handleFieldChange = (field: keyof AllPatientInfo, value: string) => {
    if (!draftPatient) return;

    setDraftPatient({
      ...draftPatient,
      [field]: value,
    });
  };

  const handleAllergyChange = (value: string) => {
    if (!draftPatient) return;

    const allergyArray = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setDraftPatient({
      ...draftPatient,
      allergies: allergyArray,
    });
  };

  const handleConditionChange = (index: number, value: string) => {
    if (!draftPatient) return;

    const updatedConditions = [...(draftPatient.conditions || [])];
    updatedConditions[index] = value;

    setDraftPatient({
      ...draftPatient,
      conditions: updatedConditions,
    });
  };

  const addCondition = () => {
    if (!draftPatient) return;

    setDraftPatient({
      ...draftPatient,
      conditions: [...(draftPatient.conditions || []), ""],
    });
  };

  const removeCondition = (index: number) => {
    if (!draftPatient) return;

    const updatedConditions = [...(draftPatient.conditions || [])];
    updatedConditions.splice(index, 1);

    setDraftPatient({
      ...draftPatient,
      conditions: updatedConditions,
    });
  };

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <span className="spinner-border spinner-border-sm me-2" />
        Loading patient profile...
      </div>
    );
  }

  if (!patient || !draftPatient) {
    return (
      <div className="container py-4 text-center text-muted">
        No patient selected.
      </div>
    );
  }

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

          <PatientNotesSection onViewNotes={() => navigate("/notes")} />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;