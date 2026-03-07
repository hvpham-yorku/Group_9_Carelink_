import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { usePatient } from "../contexts/patient/usePatient";
import { authService } from "../services/authService";
import { patientService } from "../services/patientService";
import { taskService } from "../services/taskService";
import { medicationService } from "../services/medicationService";
import { noteService } from "../services/noteService";
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
      if (!user) {
        setData(null);
        setLoading(false);
        return;
      }

      if (!selectedPatientId) {
        setData(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [profile, patientProfile, tasksRaw, prescriptionsRaw, notesRaw] =
          await Promise.all([
            authService.getProfile(user.id),
            patientService.getFullProfile(selectedPatientId),
            taskService.getTasksByPatient(selectedPatientId),
            medicationService.getPrescriptionsByPatient(selectedPatientId),
            noteService.getNotesByPatient(selectedPatientId),
          ]);

        const tasks = tasksRaw ?? [];
        const prescriptions = prescriptionsRaw ?? [];
        const notes = notesRaw ?? [];

        const caregiverName =
          `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
          user.email?.split("@")[0] ||
          "Caregiver";

        const caregiverRole = profile?.jobTitle || "Caregiver";

        const patientName =
          `${patientProfile?.firstName ?? ""} ${patientProfile?.lastName ?? ""}`.trim() ||
          "Selected Patient";

        const age =
          patientProfile?.dob ? calculateAge(patientProfile.dob) : null;

        const patientMeta = age !== null ? `Age ${age}` : "Patient";

        const completedTasks = tasks.filter(
          (task: any) => task.taskLogs?.some((log: any) => log.isCompleted),
        ).length;

        const totalTasks = tasks.length;
        const remainingTasks = totalTasks - completedTasks;

        const takenMeds = prescriptions.filter((prescription: any) =>
          prescription.medicationLogs?.some((log: any) => log.isCompleted),
        ).length;

        const totalMeds = prescriptions.length;
        const remainingMeds = totalMeds - takenMeds;

        const recentNotesCount = notes.length;

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
            primary: "—",
            secondary: "No data yet",
          },
          {
            title: "Care Notes",
            primary: `${recentNotesCount}`,
            secondary: "recent updates",
            route: "/notes",
          },
        ];

        const noteActivities: ActivityItem[] = notes.slice(0, 2).map((note: any) => ({
          icon: "📝",
          text: `Note added: ${note.title || "Untitled note"}${note.caregivers?.firstName ? ` by ${note.caregivers.firstName}` : ""
            }`,
        }));

        const taskActivities: ActivityItem[] = tasks
          .filter((task: any) => task.taskLogs?.some((log: any) => log.isCompleted))
          .slice(0, 2)
          .map((task: any) => ({
            icon: "✅",
            text: `Task completed: ${task.title}`,
          }));

        const medicationActivities: ActivityItem[] = prescriptions
          .filter((prescription: any) =>
            prescription.medicationLogs?.some((log: any) => log.isCompleted),
          )
          .slice(0, 2)
          .map((prescription: any) => ({
            icon: "💊",
            text: `Medication logged: ${prescription.name ?? prescription.medicationName ?? "Medication"}`,
          }));

        const recentActivity = [
          ...taskActivities,
          ...medicationActivities,
          ...noteActivities,
        ].slice(0, 4);

        const todaysMeds: MedItem[] = prescriptions.slice(0, 5).map((prescription: any) => {
          const taken = prescription.medicationLogs?.some(
            (log: any) => log.isCompleted,
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

        const upcomingAppointments: AppointmentItem[] = [];

        setData({
          caregiver: {
            name: caregiverName,
            role: caregiverRole,
          },
          patient,
          stats,
          recentActivity,
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