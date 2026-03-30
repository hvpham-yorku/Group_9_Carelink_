import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import { authService } from "../services/authService";
import type { AppointmentRecord } from "../types/appointment";
import { repositories } from "../data";
import type { Task, TaskLogEntry } from "../types/task";
import type { Medication } from "../types/medication";
import type { Note } from "../types/note";
import { calculateAge, formatToTime } from "../utils/formatters";

export type StatCard = {
  title: string;
  primary: string;
  secondary: string;
  route?: string;
};

export type ActivityItem = {
  icon: string;
  text: string;
  time?: string;
};

export type MedItem = {
  time: string;
  name: string;
  dose: string;
  taken: boolean;
};

export type AppointmentItem = {
  day: string;
  title: string;
  location: string;
  time?: string;
};

export type DashboardPatient = {
  name: string;
  meta: string;
  conditions: string[];
  emergencyContact: string;
  emergencyPhone: string;
};

export type DashboardCaregiver = {
  name: string;
  role: string;
};

export type DashboardDataShape = {
  caregiver: DashboardCaregiver;
  patient: DashboardPatient;
  stats: StatCard[];
  recentActivity: ActivityItem[];
  recentNotes: ActivityItem[];
  todaysMeds: MedItem[];
  upcomingAppointments: AppointmentItem[];
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const { selectedPatientId, loading: patientContextLoading } = usePatient();

  const [data, setData] = useState<DashboardDataShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user || !selectedPatientId) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [
          profile,
          patientProfile,
          tasksRaw,
          medicationsRaw,
          notesRaw,
          appointmentsRaw,
        ] = await Promise.all([
          authService.getProfile(user.id),
          repositories.patient.getPatientDetails(selectedPatientId),
          repositories.task.getTasksByPatient(selectedPatientId),
          repositories.medication.getMedicationsByPatient(selectedPatientId),
          repositories.note.getNotesByPatient(selectedPatientId),
          repositories.appointment.getAppointmentsByPatient(selectedPatientId),
        ]);

        const tasks = tasksRaw ?? [];
        const medications = medicationsRaw ?? [];
        const notes = notesRaw ?? [];
        const appointments = appointmentsRaw ?? [];

        const caregiverName =
          `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
          user.email?.split("@")[0] ||
          "Caregiver";

        const caregiverRole = profile?.job_title || "Caregiver";

        const patientName =
          `${patientProfile?.firstName ?? ""} ${patientProfile?.lastName ?? ""}`.trim() ||
          "Selected Patient";

        const age = patientProfile?.dob
          ? calculateAge(patientProfile.dob)
          : null;
        const patientMeta = age !== null ? `Age ${age}` : "Patient";

        const completedTasks = tasks.filter((task: Task) =>
          task.taskLogs?.some((log: TaskLogEntry) => log.isCompleted),
        ).length;

        const totalTasks = tasks.length;
        const remainingTasks = totalTasks - completedTasks;

        const takenMeds = medications.filter(
          (med: Medication) => med.medicationLog?.isCompleted,
        ).length;

        const totalMeds = medications.length;
        const remainingMeds = totalMeds - takenMeds;

        const recentNotesCount = notes.length;

        const upcomingAppointments: AppointmentItem[] = appointments
          .filter((appointment: AppointmentRecord) => {
            const isCompleted = !!appointment.isCompleted;
            const isFuture =
              new Date(appointment.scheduledAt).getTime() >= Date.now();
            return !isCompleted && isFuture;
          })
          .sort(
            (a: AppointmentRecord, b: AppointmentRecord) =>
              new Date(a.scheduledAt).getTime() -
              new Date(b.scheduledAt).getTime(),
          )
          .slice(0, 4)
          .map((appointment: AppointmentRecord) => {
            const date = new Date(appointment.scheduledAt);

            return {
              day: date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
              time: date.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              }),
              title:
                appointment.title?.trim() ||
                appointment.description?.trim() ||
                "Upcoming appointment",
              location: appointment.location ?? "",
            };
          });

        const stats: StatCard[] = [
          {
            title: "Today's Tasks",
            primary: `${completedTasks} / ${totalTasks}`,
            secondary: `${remainingTasks} remaining`,
            route: "/task-manager",
          },
          {
            title: "Medications",
            primary: `${takenMeds} / ${totalMeds}`,
            secondary:
              remainingMeds > 0
                ? `${remainingMeds} not taken yet`
                : "All taken",
            route: "/medication-tracker",
          },
          {
            title: "Next Appointment",
            primary:
              upcomingAppointments.length > 0
                ? upcomingAppointments[0].day
                : "—",
            secondary:
              upcomingAppointments.length > 0
                ? upcomingAppointments[0].title
                : "No data yet",
            route: "/appointments",
          },
          {
            title: "Care Notes",
            primary: `${recentNotesCount}`,
            secondary: recentNotesCount > 0 ? "recent notes" : "No notes yet",
            route: "/notes",
          },
        ];

        const recentActivity: ActivityItem[] = tasks
          .filter((task: Task) =>
            task.taskLogs?.some((log: TaskLogEntry) => log.isCompleted),
          )
          .slice(0, 4)
          .map((task: Task) => ({
            icon: "✅",
            text: `Task completed: ${task.title}`,
            time:
              task.taskLogs?.find((log: TaskLogEntry) => log.isCompleted)
                ?.completedAt ?? "",
          }));

        const recentNotes: ActivityItem[] = notes
          .slice(0, 4)
          .map((note: Note) => ({
            icon: "📝",
            text: `${note.title || note.description || "Untitled note"}${
              note.caregivers?.firstName
                ? ` by ${note.caregivers.firstName}`
                : ""
            }`,
            time: note.createdAt ?? note.updatedAt ?? "",
          }));

        const todaysMeds: MedItem[] = medications
          .slice(0, 5)
          .map((med: Medication) => ({
            time: formatToTime(med.scheduledAt?.[0] ?? null) || "—",
            name: med.name ?? "Medication",
            dose: med.dosage ?? "",
            taken: !!med.medicationLog?.isCompleted,
          }));

        const patient: DashboardPatient = {
          name: patientName,
          meta: patientMeta,
          conditions: [],
          emergencyContact: "Coming soon",
          emergencyPhone: "—",
        };

        setData({
          caregiver: {
            name: caregiverName,
            role: caregiverRole,
          },
          patient,
          stats,
          recentActivity,
          recentNotes,
          todaysMeds,
          upcomingAppointments,
        });
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data.",
        );
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!patientContextLoading) {
      fetchDashboard();
    }
  }, [user, selectedPatientId, patientContextLoading]);

  return { data, loading, error };
};
