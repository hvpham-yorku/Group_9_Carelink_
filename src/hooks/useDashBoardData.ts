import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import { authService } from "../services/authService";
import { patientService } from "../services/patientService";
import { taskService } from "../services/taskService";
import { medicationService } from "../services/medicationService";
import { noteService } from "../services/noteService";
import { appointmentService } from "../services/appointmentService";
import { calculateAge, formatToTime } from "../utils/formatters";

type StatCard = {
  title: string;
  primary: string;
  secondary: string;
  route?: string;
};

type ActivityItem = {
  icon: string;
  text: string;
  time?: string;
};

type MedItem = {
  time: string;
  name: string;
  dose: string;
  taken: boolean;
};

type AppointmentItem = {
  day: string;
  title: string;
  location: string;
  time?: string;
};

type DashboardPatient = {
  name: string;
  meta: string;
  conditions: string[];
  emergencyContact: string;
  emergencyPhone: string;
};

type DashboardCaregiver = {
  name: string;
  role: string;
};

type DashboardDataShape = {
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
          prescriptionsRaw,
          notesRaw,
          appointmentsRaw,
        ] = await Promise.all([
          authService.getProfile(user.id),
          patientService.getFullProfile(selectedPatientId),
          taskService.getTasksByPatient(selectedPatientId),
          medicationService.getPrescriptionsByPatient(selectedPatientId),
          noteService.getNotesByPatient(selectedPatientId),
          appointmentService.getAppointmentsByPatient(selectedPatientId),
        ]);

        const tasks = tasksRaw ?? [];
        const prescriptions = prescriptionsRaw ?? [];
        const notes = notesRaw ?? [];
        const appointments = appointmentsRaw ?? [];

        const caregiverName =
          `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
          user.email?.split("@")[0] ||
          "Caregiver";

        const caregiverRole = profile?.jobTitle || "Caregiver";

        const patientName =
          `${patientProfile?.firstName ?? ""} ${patientProfile?.lastName ?? ""}`.trim() ||
          "Selected Patient";

        const age = patientProfile?.dob ? calculateAge(patientProfile.dob) : null;
        const patientMeta = age !== null ? `Age ${age}` : "Patient";

        const completedTasks = tasks.filter((task: any) =>
          task.taskLogs?.some((log: any) => log.isCompleted)
        ).length;

        const totalTasks = tasks.length;
        const remainingTasks = totalTasks - completedTasks;

        const takenMeds = prescriptions.filter((prescription: any) =>
          prescription.medicationLogs?.some((log: any) => log.isCompleted)
        ).length;

        const totalMeds = prescriptions.length;
        const remainingMeds = totalMeds - takenMeds;

        const recentNotesCount = notes.length;

        const upcomingAppointments: AppointmentItem[] = appointments
          .filter((appointment: any) => {
            const isCompleted = !!appointment.completedTime;
            const isFuture = new Date(appointment.scheduledAt).getTime() >= Date.now();
            return !isCompleted && isFuture;
          })
          .sort(
            (a: any, b: any) =>
              new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
          )
          .slice(0, 4)
          .map((appointment: any) => {
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
                appointment.description?.trim() || "Upcoming appointment",
              location: "",
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
            primary: upcomingAppointments.length > 0 ? upcomingAppointments[0].day : "—",
            secondary:
              upcomingAppointments.length > 0
                ? upcomingAppointments[0].title
                : "No data yet",
            route: "/appointments",
          },
          {
            title: "Care Notes",
            primary: `${recentNotesCount}`,
            secondary:
              recentNotesCount > 0 ? "recent notes" : "No notes yet",
            route: "/notes",
          },
        ];

        const recentActivity: ActivityItem[] = tasks
          .filter((task: any) =>
            task.taskLogs?.some((log: any) => log.isCompleted)
          )
          .slice(0, 4)
          .map((task: any) => ({
            icon: "✅",
            text: `Task completed: ${task.title}`,
            time:
              task.taskLogs?.find((log: any) => log.isCompleted)?.completedAt ??
              task.updatedAt ??
              task.createdAt ??
              "",
          }));

        const recentNotes: ActivityItem[] = notes.slice(0, 4).map((note: any) => ({
          icon: "📝",
          text: `${note.title || note.description || "Untitled note"}${note.caregivers?.firstName ? ` by ${note.caregivers.firstName}` : ""
            }`,
          time: note.createdAt ?? note.updatedAt ?? "",
        }));

        const todaysMeds: MedItem[] = prescriptions.slice(0, 5).map((prescription: any) => {
          const taken = prescription.medicationLogs?.some(
            (log: any) => log.isCompleted
          );

          return {
            time: formatToTime(prescription.scheduledAt) || "—",
            name: prescription.name ?? prescription.medicationName ?? "Medication",
            dose: prescription.dosage ?? "",
            taken: !!taken,
          };
        });

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
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
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