import { useEffect, useMemo, useState } from "react";
import { Pill, CheckCircle2, AlertCircle, Clock, Plus } from "lucide-react";

import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";
import ActiveMedicationCard from "../components/medication/ActiveMedicationCard";
import MedicationDetailsCard from "../components/medication/MedicationDetailsCard";

import CustomSection from "../components/ui/CustomSection";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";

import { medicationService } from "../services/medicationService";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import type { MedicationScheduleItemProps } from "../types/Types";

type Prescription = Omit<MedicationScheduleItemProps, "onToggle">;

const MedicationTracker = () => {
  const { user } = useAuth();
  const { selectedPatientId, loading: contextLoading } = usePatient();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);

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

        const selectedStillExists = mapped.some(
          (item) => item.prescriptionId === currentSelectedId,
        );

        if (selectedStillExists) return currentSelectedId;

        return mapped[0].prescriptionId;
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

  const takenCount = prescriptions.filter(
    (p) => p.medicationLog?.isCompleted,
  ).length;

  const totalCount = prescriptions.length;
  const remainingCount = totalCount - takenCount;
  const adherencePercentage =
    totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  const selectedMedication = useMemo(() => {
    return (
      prescriptions.find(
        (item) => item.prescriptionId === selectedPrescriptionId,
      ) ?? null
    );
  }, [prescriptions, selectedPrescriptionId]);

  const isLoading = contextLoading || loadingMeds;

  return (
    <div className="container py-3">
      <CustomTitleBanner
        title="Medication Tracker"
        subheader="Track today's medication schedule for your patient"
      >
        <Button color="primary" icon={<Plus size={16} />}>
          Add Medication
        </Button>
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

          <div className="row g-3">
            <div className="col-12 col-xl-7">
              <CustomSection
                title="Today's Medication Schedule"
                subheader={`${takenCount} of ${totalCount} taken`}
              >
                {isLoading ? (
                  <div className="text-muted">Loading medications…</div>
                ) : prescriptions.length === 0 ? (
                  <div className="text-muted">
                    No active prescriptions found for this patient.
                  </div>
                ) : (
                  prescriptions.map((med) => (
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
              <div style={{ position: "sticky", top: 20 }}>
                <CustomSection
                  title="Active Medications"
                  subheader={`${totalCount} prescribed`}
                >
                  {isLoading ? (
                    <div className="text-muted">Loading medications…</div>
                  ) : prescriptions.length === 0 ? (
                    <div className="text-muted">
                      No medications available to display.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {prescriptions.map((med) => (
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
                  <MedicationDetailsCard medication={selectedMedication} />
                </CustomSection>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MedicationTracker;