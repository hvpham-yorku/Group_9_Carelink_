import { useEffect, useState } from "react";
import MedicationScheduleItem from "../components/medication/MedicationScheduleItem";
import CustomSection from "../components/ui/CustomSection";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";

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

  const fetchPrescriptions = async (patientId: string) => {
    setLoadingMeds(true);
    try {
      const data = await medicationService.getPrescriptionsByPatient(patientId);
      // Supabase returns medicationLogs as an array with nested caregivers.
      // Map to the flat Prescription shape the component expects.
      const mapped: Prescription[] = (data ?? []).map((row: any) => {
        const activeLog =
          (row.medicationLogs as any[])?.find(
            (l: any) => l.isCompleted === true,
          ) ?? null;
        return {
          prescriptionId: row.prescriptionId,
          careTeamId: row.careTeamId ?? "",
          patientId: row.patientId,
          name: row.name ?? row.medicationName ?? "",
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
    } catch (err) {
      console.error("Failed to load prescriptions:", err);
    } finally {
      setLoadingMeds(false);
    }
  };

  useEffect(() => {
    if (!selectedPatientId) {
      setPrescriptions([]);
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
      if (selectedPatientId) await fetchPrescriptions(selectedPatientId);
    } catch (err) {
      console.error("Failed to toggle medication:", err);
    }
  };

  const takenCount = prescriptions.filter(
    (p) => p.medicationLog?.isCompleted,
  ).length;

  const isLoading = contextLoading || loadingMeds;

  return (
    <div className="container py-3">
      <CustomTitleBanner
        title="Medication Tracker"
        subheader="Track today's medication schedule for your patient"
      />

      {!selectedPatientId && !contextLoading ? (
        <div className="alert alert-info">
          No patient selected. Please select a patient from the sidebar.
        </div>
      ) : (
        <div className="row g-3">
          {/* LEFT: Schedule */}
          <div className="col-12 col-lg-8">
            <CustomSection
              title="Today's Medication Schedule"
              subheader={`${takenCount} of ${prescriptions.length} taken`}
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

          {/* RIGHT: Summary */}
          <div className="col-12 col-lg-4">
            <div style={{ position: "sticky", top: 20 }}>
              <CustomSection
                title="Active Medications"
                subheader={`${prescriptions.length} prescribed`}
              >
                <ul className="list-group list-group-flush">
                  {prescriptions.map((m) => (
                    <li
                      key={m.prescriptionId}
                      className={`list-group-item d-flex justify-content-between align-items-center ${
                        m.medicationLog?.isCompleted ? "text-muted" : ""
                      }`}
                    >
                      <span
                        className={
                          m.medicationLog?.isCompleted
                            ? "text-decoration-line-through"
                            : ""
                        }
                      >
                        {m.name} ({m.dosage})
                      </span>
                      {m.medicationLog?.isCompleted && (
                        <span className="badge text-bg-success">Taken</span>
                      )}
                    </li>
                  ))}
                </ul>
              </CustomSection>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
