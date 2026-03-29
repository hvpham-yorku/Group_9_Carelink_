import { useEffect, useMemo, useState } from "react";
import {
  Pill,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Archive,
} from "lucide-react";

// Medication-specific UI components
import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";
import ActiveMedicationCard from "../components/medication/ActiveMedicationCard";
import MedicationDetailsCard from "../components/medication/MedicationDetailsCard";
import MedicationFormModal from "../components/medication/MedicationFormModal";
import ArchivedMedicationsModal from "../components/medication/ArchivedMedicationsModal";
import AdherenceOverviewChart from "../components/medication/AdherenceOverviewChart";

// Shared UI components
import CustomSection from "../components/ui/CustomSection";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";

// Data + app context
import { repositories } from "../data";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import type { Medication } from "../types/medication";

const MedicationTracker = () => {
  // Current logged-in user
  const { user } = useAuth();

  // Current selected patient + care team context
  const {
    selectedPatientId,
    careTeamId,
    loading: contextLoading,
  } = usePatient();

  // Main page state
  const [medications, setMedications] = useState<Medication[]>([]);
  const [archivedMedications, setArchivedMedications] = useState<Medication[]>(
    [],
  );
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<
    string | null
  >(null);

  // Modal state for add/edit form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(
    null,
  );

  // Modal state for archived medications
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);

  // Fetch both active and archived medications for the selected patient
  const fetchMedications = async (patientId: string) => {
    setLoadingMeds(true);

    try {
      const [active, archived] = await Promise.all([
        repositories.medication.getMedicationsByPatient(patientId),
        repositories.medication.getArchivedMedications(patientId),
      ]);

      setMedications(active);
      setArchivedMedications(archived);

      // Keep the selected medication valid after refresh
      setSelectedMedicationId((currentSelectedId) => {
        if (!active.length) return null;

        const selectedStillExists = active.some(
          (item) => item.medicationId === currentSelectedId,
        );

        if (selectedStillExists) return currentSelectedId;

        return active[0].medicationId;
      });
    } catch (err) {
      console.error("Failed to load medications:", err);
    } finally {
      setLoadingMeds(false);
    }
  };

  // Reload medications whenever the selected patient changes
  useEffect(() => {
    if (!selectedPatientId) {
      setMedications([]);
      setArchivedMedications([]);
      setSelectedMedicationId(null);
      return;
    }

    fetchMedications(selectedPatientId);
  }, [selectedPatientId]);

  // Mark medication as taken / untaken, then refresh the list
  const handleToggle = async (medicationId: string, isCompleted: boolean) => {
    if (!user) return;

    try {
      if (isCompleted) {
        await repositories.medication.unmarkAsTaken(medicationId);
      } else {
        await repositories.medication.markAsTaken(medicationId, user.id);
      }

      if (selectedPatientId) {
        await fetchMedications(selectedPatientId);
      }
    } catch (err) {
      console.error("Failed to toggle medication:", err);
    }
  };

  // Open modal in "add" mode
  const handleAddMedication = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  // Open modal in "edit" mode for the selected medication
  const handleEditMedication = (medicationId: string) => {
    const medicationToEdit =
      medications.find((med) => med.medicationId === medicationId) ?? null;

    setEditingMedication(medicationToEdit);
    setIsModalOpen(true);
  };

  // Close add/edit modal and clear editing state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  // Save either a new medication or updates to an existing one
  const handleSaveMedication = async (data: {
    name: string;
    dosage: string;
    frequency: string;
    scheduledAt: string[];
    purpose?: string;
    instructions?: string;
    prescribedBy?: string;
    warnings?: string;
  }) => {
    if (!selectedPatientId) return;

    try {
      if (editingMedication) {
        await repositories.medication.updateMedication(
          editingMedication.medicationId,
          {
            name: data.name,
            dosage: data.dosage,
            frequency: data.frequency,
            scheduledAt: data.scheduledAt,
            purpose: data.purpose,
            instructions: data.instructions,
            prescribedBy: data.prescribedBy,
            warnings: data.warnings,
          },
        );
      } else {
        await repositories.medication.addMedication({
          patientId: selectedPatientId,
          careTeamId: medications[0]?.careTeamId ?? careTeamId ?? "",
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          scheduledAt: data.scheduledAt,
          purpose: data.purpose,
          instructions: data.instructions,
          prescribedBy: data.prescribedBy,
          warnings: data.warnings,
        });
      }

      await fetchMedications(selectedPatientId);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save medication:", err);
    }
  };

  // Archive the currently selected medication
  const handleArchiveMedication = async () => {
    if (!selectedMedication || !selectedPatientId) return;

    const confirmed = window.confirm(
      `Archive ${selectedMedication.name}? This will remove it from active medications.`,
    );

    if (!confirmed) return;

    try {
      await repositories.medication.archiveMedication(
        selectedMedication.medicationId,
      );
      await fetchMedications(selectedPatientId);
      setSelectedMedicationId(null);
    } catch (err) {
      console.error("Failed to archive medication:", err);
    }
  };

  // Derived lists used by the page
  const activeMedications = useMemo(() => medications, [medications]);

  const todaySchedule = useMemo(() => activeMedications, [activeMedications]);

  // Summary stats for cards + section headers
  const takenCount = activeMedications.filter(
    (p) => p.medicationLog?.isCompleted,
  ).length;

  const totalCount = activeMedications.length;
  const remainingCount = totalCount - takenCount;
  const adherencePercentage =
    totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  // Currently selected medication for the details panel
  const selectedMedication = useMemo(() => {
    return (
      activeMedications.find(
        (item) => item.medicationId === selectedMedicationId,
      ) ?? null
    );
  }, [activeMedications, selectedMedicationId]);

  // Build 7-day adherence chart data
  const adherenceChartData = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));

      const day = date.toLocaleDateString(undefined, { weekday: "short" });

      if (index === 6) {
        return {
          day,
          taken: takenCount,
          total: totalCount,
        };
      }

      const mockTotal = totalCount || 4;
      const mockTaken = Math.max(
        0,
        Math.min(mockTotal, Math.round(mockTotal * (0.55 + index * 0.06))),
      );

      return {
        day,
        taken: mockTaken,
        total: mockTotal,
      };
    });
  }, [takenCount, totalCount]);

  // Overall loading state combines patient context + medication fetch state
  const isLoading = contextLoading || loadingMeds;

  return (
    <div className="container py-3">
      {/* Page title + top action buttons */}
      <CustomTitleBanner
        title="Medication Tracker"
        subheader="Track today's medication schedule for your patient"
      >
        <div className="d-flex gap-2 flex-wrap">
          <Button
            color="outline-secondary"
            icon={<Archive size={16} />}
            onClick={() => setIsArchivedModalOpen(true)}
          >
            View Archived
          </Button>

          <Button
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleAddMedication}
          >
            Add Medication
          </Button>
        </div>
      </CustomTitleBanner>

      {/* Empty state when no patient is selected */}
      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info rounded-4">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Today's Adherence"
                value={`${adherencePercentage}%`}
                description={`${takenCount} of ${totalCount} medications taken`}
                icon={<CheckCircle2 size={20} color="#198754" />}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Active Medications"
                value={totalCount}
                description="Currently prescribed"
                icon={<Pill size={20} color="#6f42c1" />}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Taken Today"
                value={takenCount}
                description="Marked as completed"
                icon={<Clock size={20} color="#0d6efd" />}
              />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <StatCard
                title="Remaining"
                value={remainingCount}
                description="Still left for today"
                icon={<AlertCircle size={20} color="#fd7e14" />}
              />
            </div>
          </div>

          {/* Weekly adherence chart */}
          <CustomSection
            title="7-Day Adherence Overview"
            subheader="Daily medication completion trends"
          >
            <AdherenceOverviewChart data={adherenceChartData} />
          </CustomSection>

          <div className="row g-3 mt-1">
            {/* Left column: today's schedule */}
            <div className="col-12 col-xl-7">
              <CustomSection
                title="Today's Medication Schedule"
                subheader={`${takenCount} of ${totalCount} taken`}
              >
                {isLoading ? (
                  <div className="text-muted">Loading medications…</div>
                ) : todaySchedule.length === 0 ? (
                  <div className="text-muted">
                    No active prescriptions found for this patient.
                  </div>
                ) : (
                  todaySchedule.map((med) => (
                    <MedicationScheduleItem
                      key={med.medicationId}
                      {...med}
                      onToggle={handleToggle}
                    />
                  ))
                )}
              </CustomSection>
            </div>

            {/* Right column: active medications + selected medication details */}
            <div className="col-12 col-xl-5">
              <div className="d-flex flex-column gap-3">
                <CustomSection
                  title="Active Medications"
                  subheader={`${totalCount} prescribed`}
                >
                  {isLoading ? (
                    <div className="text-muted">Loading medications…</div>
                  ) : activeMedications.length === 0 ? (
                    <div className="text-muted">
                      No medications available to display.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {activeMedications.map((med) => (
                        <ActiveMedicationCard
                          key={med.medicationId}
                          name={med.name ?? ""}
                          dosage={med.dosage ?? ""}
                          frequency={med.frequency ?? undefined}
                          isSelected={selectedMedicationId === med.medicationId}
                          isCompleted={!!med.medicationLog?.isCompleted}
                          onClick={() =>
                            setSelectedMedicationId(med.medicationId)
                          }
                          onEdit={() =>
                            handleEditMedication(med.medicationId ?? "")
                          }
                        />
                      ))}
                    </div>
                  )}
                </CustomSection>

                <CustomSection
                  title="Medication Details"
                  subheader={
                    selectedMedication
                      ? "Selected medication information"
                      : "Select a medication to view details"
                  }
                >
                  <MedicationDetailsCard
                    medication={selectedMedication}
                    onArchive={
                      selectedMedication ? handleArchiveMedication : undefined
                    }
                  />
                </CustomSection>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add/edit medication modal */}
      <MedicationFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMedication}
        initialData={
          editingMedication
            ? {
                name: editingMedication.name,
                dosage: editingMedication.dosage,
                frequency: editingMedication.frequency,
                scheduledAt: editingMedication.scheduledAt,
                purpose: editingMedication.purpose,
                instructions: editingMedication.instructions,
                prescribedBy: editingMedication.prescribedBy,
                warnings: editingMedication.warnings,
              }
            : undefined
        }
      />

      {/* Archived medications modal */}
      <ArchivedMedicationsModal
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
        medications={archivedMedications}
      />
    </div>
  );
};

export default MedicationTracker;