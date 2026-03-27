import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle } from "lucide-react";

import PatientInfoBanner from "../components/ui/PatientInfoBanner";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import StatCard from "../components/ui/StatCard";

import PatientContactSection from "../components/patientProfile/PatientContactSection";
import PatientMedicalSection from "../components/patientProfile/PatientMedicalSection";
import PatientInsuranceSection from "../components/patientProfile/PatientInsuranceSection";
import PatientPhysicianSection from "../components/patientProfile/PatientPhysicianSection";
import PatientNotesSection from "../components/patientProfile/PatientNotesSection";
import PatientConditionsSection from "../components/patientProfile/PatientConditionsSection";
import EmergencyContactsSection from "../components/patientProfile/EmergencyContactsSection";

import type { PatientInfo } from "../types/Types";
import { usePatient } from "../contexts/patient/usePatient";
import { patientService } from "../services/patientService";

type EditableSection =
  | "contact"
  | "medical"
  | "insurance"
  | "physician"
  | "notes"
  | "conditions"
  | "emergency"
  | null;

const PatientProfile = () => {
  const { selectedPatientId } = usePatient();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientInfo | null>(null);
  const [draftPatient, setDraftPatient] = useState<PatientInfo | null>(null);
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
        const data = await patientService.getFullProfile(selectedPatientId);
        const typedData = data as PatientInfo;
        setPatient(typedData);
        setDraftPatient(typedData);
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
      let updates: Partial<PatientInfo> = {};

      if (section === "contact") {
        updates = {
          firstName: draftPatient.firstName,
          lastName: draftPatient.lastName,
          address: draftPatient.address,
          phoneNumber: draftPatient.phoneNumber,
          email: draftPatient.email,
        };
      }

      if (section === "medical") {
        updates = {
          dob: draftPatient.dob,
          gender: draftPatient.gender,
          bloodType: draftPatient.bloodType,
          height: draftPatient.height,
          weight: draftPatient.weight,
          allergies: draftPatient.allergies,
          mobility: draftPatient.mobility,
          diet: draftPatient.diet,
        };
      }

      if (section === "insurance") {
        updates = {
          insuranceProvider: draftPatient.insuranceProvider,
          insurancePolicyNumber: draftPatient.insurancePolicyNumber,
        };
      }

      if (section === "physician") {
        updates = {
          physicianName: draftPatient.physicianName,
          physicianPhone: draftPatient.physicianPhone,
          physicianAddress: draftPatient.physicianAddress,
          physicianSpecialty: draftPatient.physicianSpecialty,
        };
      }

      if (section === "notes") {
        updates = {
          careNotes: draftPatient.careNotes,
        };
      }

      if (section === "conditions") {
        updates = {
          conditions: draftPatient.conditions,
        };
      }

      if (section === "emergency") {
        updates = {
          emergencyContactName: draftPatient.emergencyContactName,
          emergencyContactPhone: draftPatient.emergencyContactPhone,
          emergencyContactRelationship: draftPatient.emergencyContactRelationship,
          secondaryEmergencyContactName: draftPatient.secondaryEmergencyContactName,
          secondaryEmergencyContactPhone: draftPatient.secondaryEmergencyContactPhone,
          secondaryEmergencyContactRelationship:
            draftPatient.secondaryEmergencyContactRelationship,
        };
      }

      const updated = await patientService.updateProfile(
        patient.patientId,
        updates,
      );

      const updatedPatient = updated as PatientInfo;
      setPatient(updatedPatient);
      setDraftPatient(updatedPatient);
      setEditingSection(null);
    } catch (err) {
      console.error(`Failed to save ${section} section:`, err);
    } finally {
      setSavingSection(null);
    }
  };

  const handleFieldChange = (field: keyof PatientInfo, value: string) => {
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

  const renderCareHistorySummary = () => (
    <CustomSection
      title="Care History Summary"
      rightAction={
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-none"
          style={{ fontSize: "0.88rem", color: "#2563eb" }}
        >
          View Full History →
        </button>
      }
    >
      <div className="row g-3">
        <div className="col-md-4">
          <StatCard
            title="Care Days"
            value="—"
            description="Total care days"
            icon={<Calendar size={16} color="#2563eb" />}
            backgroundColor="#e0ecff"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Tasks Completed"
            value="—"
            description="Completed care tasks"
            icon={<CheckCircle size={16} color="#16a34a" />}
            backgroundColor="#dcfce7"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            title="Appointments"
            value="—"
            description="Scheduled appointments"
            icon={<Calendar size={16} color="#9333ea" />}
            backgroundColor="#f3e8ff"
          />
        </div>
      </div>
    </CustomSection>
  );

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

          {renderCareHistorySummary()}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;