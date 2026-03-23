import { useEffect, useMemo, useState } from "react";
import {
  Pill,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Archive,
} from "lucide-react";

import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";
import ActiveMedicationCard from "../components/medication/ActiveMedicationCard";
import MedicationDetailsCard from "../components/medication/MedicationDetailsCard";
import MedicationFormModal from "../components/medication/MedicationFormModal";
import ArchivedMedicationsModal from "../components/medication/ArchivedMedicationsModal";
import AdherenceOverviewChart from "../components/medication/AdherenceOverviewChart";

import CustomSection from "../components/ui/CustomSection";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";

import { medicationService } from "../services/medicationService";
import { teamService } from "../services/teamService";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import type { MedicationScheduleItemProps } from "../types/Types";

type Prescription = Omit<MedicationScheduleItemProps, "onToggle"> & {
  purpose?: string;
  instructions?: string;
  warnings?: string;
  prescribedBy?: string;
  startDate?: string;
};

const MedicationTracker = () => {
  const { user } = useAuth();
  const { selectedPatientId, loading: contextLoading } = usePatient();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] =
    useState<Prescription | null>(null);

  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false);

  const fetchPrescriptions = async (patientId: string) => {
    setLoadingMeds(true);

    try {
      const data = await medicationService.getPrescriptionsByPatient(patientId);

      const mapped: Prescription[] = (data ?? []).map((row: any) => {
        const activeLog =
          (row.medicationLogs as any[])?.find(
            (l: any) => l.isCompleted === true,
          ) ?? null;

        return {
          prescriptionId: row.prescriptionId,
          careTeamId: row.careTeamId ?? "",
          patientId: row.patientId,
          name: row.name ?? "",
          dosage: row.dosage ?? "",
          frequency: row.frequency ?? "",
          scheduledAt: row.scheduledAt ?? "",
          isActive: row.isActive ?? true,
          purpose: row.purpose ?? "",
          instructions: row.instructions ?? "",
          warnings: row.warnings ?? "",
          prescribedBy: row.prescribedBy ?? "",
          startDate: row.startDate ?? "",
          medicationLog: activeLog
            ? {
                caregiverId: activeLog.caregiverId,
                takenAt: activeLog.takenAt,
                isCompleted: true,
                firstName: activeLog.caregivers?.firstName ?? "",
                lastName: activeLog.caregivers?.lastName ?? "",
              }
            : undefined,
        };
      });

      setPrescriptions(mapped);

      setSelectedPrescriptionId((currentSelectedId) => {
        if (!mapped.length) return null;

        const activeMapped = mapped.filter((item) => item.isActive);
        if (!activeMapped.length) return null;

        const selectedStillExists = activeMapped.some(
          (item) => item.prescriptionId === currentSelectedId,
        );

        if (selectedStillExists) return currentSelectedId;

        return activeMapped[0].prescriptionId;
      });
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
    } finally {
      setLoadingMeds(false);
    }
  };

  useEffect(() => {
    if (!selectedPatientId) {
      setPrescriptions([]);
      setSelectedPrescriptionId(null);
      return;
    }

    fetchPrescriptions(selectedPatientId);
  }, [selectedPatientId]);

  const handleToggle = async (prescriptionId: string, isCompleted: boolean) => {
    if (!user) return;

    try {
      if (isCompleted) {
        await medicationService.unmarkAsTaken(prescriptionId);
      } else {
        await medicationService.markAsTaken(prescriptionId, user.id);
      }

      if (selectedPatientId) {
        await fetchPrescriptions(selectedPatientId);
      }
    } catch (err) {
      console.error("Failed to toggle medication:", err);
    }
  };

  const handleAddMedication = () => {
    setEditingMedication(null);
    setIsModalOpen(true);
  };

  const handleEditMedication = (prescriptionId: string) => {
    const medicationToEdit =
      prescriptions.find((med) => med.prescriptionId === prescriptionId) ??
      null;

    setEditingMedication(medicationToEdit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  const handleSaveMedication = async (data: any) => {
    if (!selectedPatientId) return;

    try {
      if (editingMedication) {
        await medicationService.updatePrescription(
          editingMedication.prescriptionId,
          {
            name: data.name,
            dosage: data.dosage,
            frequency: data.frequency,
            scheduledAt: data.scheduledAt,
          },
        );
      } else {
        const resolvedCareTeamId =
          prescriptions[0]?.careTeamId ||
          (await teamService.getCareTeamIdByPatient(selectedPatientId));

        await medicationService.addPrescription({
          patientId: selectedPatientId,
          careTeamId: resolvedCareTeamId,
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          scheduledAt: data.scheduledAt,
        });
      }

      await fetchPrescriptions(selectedPatientId);
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save medication:", err);
    }
  };

  const handleArchiveMedication = async () => {
    if (!selectedMedication || !selectedPatientId) return;

    const confirmed = window.confirm(
      `Archive ${selectedMedication.name}? This will remove it from active medications.`,
    );

    if (!confirmed) return;

    try {
      await medicationService.archivePrescription(
        selectedMedication.prescriptionId,
      );
      await fetchPrescriptions(selectedPatientId);
      setSelectedPrescriptionId(null);
    } catch (err) {
      console.error("Failed to archive medication:", err);
    }
  };

  const activeMedications = useMemo(() => {
    return prescriptions.filter((p) => p.isActive);
  }, [prescriptions]);

  const archivedMedications = useMemo(() => {
    return prescriptions.filter((p) => !p.isActive);
  }, [prescriptions]);

  const todaySchedule = useMemo(() => {
    return activeMedications;
  }, [activeMedications]);

  const takenCount = activeMedications.filter(
    (p) => p.medicationLog?.isCompleted,
  ).length;

  const totalCount = activeMedications.length;
  const remainingCount = totalCount - takenCount;
  const adherencePercentage =
    totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const selectedMedication = useMemo(() => {
    return (
      activeMedications.find(
        (item) => item.prescriptionId === selectedPrescriptionId,
      ) ?? null
    );
  }, [activeMedications, selectedPrescriptionId]);

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

  const isLoading = contextLoading || loadingMeds;

  return (
    <div className="container py-3">
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

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info rounded-4">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <>
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

          <CustomSection
  title="7-Day Adherence Overview"
  subheader="Daily medication completion trends"
>
  <AdherenceOverviewChart data={adherenceChartData} />
</CustomSection>

          <div className="row g-3 mt-1">
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
                      key={med.prescriptionId}
                      {...med}
                      onToggle={handleToggle}
                    />
                  ))
                )}
              </CustomSection>
            </div>

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
                          key={med.prescriptionId}
                          name={med.name}
                          dosage={med.dosage}
                          frequency={med.frequency}
                          isSelected={
                            selectedPrescriptionId === med.prescriptionId
                          }
                          isCompleted={!!med.medicationLog?.isCompleted}
                          onClick={() =>
                            setSelectedPrescriptionId(med.prescriptionId)
                          }
                          onEdit={() =>
                            handleEditMedication(med.prescriptionId)
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
                startDate: editingMedication.startDate,
              }
            : undefined
        }
      />

      <ArchivedMedicationsModal
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
        medications={archivedMedications}
      />
    </div>
  );
};

export default MedicationTracker;