import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Pill,
  UserRound,
  AlertTriangle,
  FileText,
  StickyNote,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashBoardData";

type StatCard = {
  title: string;
  primary: string;
  secondary: string;
  route?: string;
};

type ActivityItem = {
  icon?: string;
  text?: string;
  message?: string;
  title?: string;
  description?: string;
  time?: string;
  timestamp?: string;
  createdAt?: string;
};

type MedItem = {
  time: string;
  name: string;
  dose: string;
  taken: boolean;
};

type AppointmentItem = {
  day?: string;
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

type DashboardData = {
  caregiver: DashboardCaregiver;
  patient: DashboardPatient;
  stats: StatCard[];
  recentActivity: ActivityItem[];
  recentNotes: ActivityItem[];
  todaysMeds: MedItem[];
  upcomingAppointments: AppointmentItem[];
};



const styles = {
  pageBg: {
    minHeight: "100vh",
    width: "100%",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #f3f6fb 45%, #eef2f7 100%)",
  } as React.CSSProperties,

  containerMax: {
    maxWidth: "1180px",
  } as React.CSSProperties,

  cardLike: {
    borderRadius: "20px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    background: "#FFFFFF",
  } as React.CSSProperties,

  hero: {
    borderRadius: "24px",
    background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 55%, #f8fafc 100%)",
    border: "1px solid #E5E7EB",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  } as React.CSSProperties,

  softPanel: {
    borderRadius: "16px",
    background: "#F8FAFC",
    border: "1px solid #E5E7EB",
  } as React.CSSProperties,
};

function iconWrap(bg: string): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: bg,
    flexShrink: 0,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData() as {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
  };

  const goTasks = () => navigate("/task-manager");
  const goMeds = () => navigate("/medication-tracker");
  const goProfile = () => navigate("/patient-profile");
  const goNotes = () => navigate("/notes");

  const stats = data?.stats ?? [];
  const meds = data?.todaysMeds ?? [];
  const taskOnlyActivity = data?.recentActivity ?? [];
  const recentNotes = data?.recentNotes ?? [];
  const appointments = data?.upcomingAppointments ?? [];

  const completedMeds = meds.filter((med) => med.taken).length;
  const pendingMeds = meds.filter((med) => !med.taken).length;

  const fallbackStats: StatCard[] = [
    {
      title: "Today’s Tasks",
      primary: stats[0]?.primary ?? "0",
      secondary: stats[0]?.secondary ?? "Tasks to manage today",
      route: "/task-manager",
    },
    {
      title: "Medications",
      primary: meds.length > 0 ? `${completedMeds}/${meds.length}` : "0/0",
      secondary:
        meds.length > 0
          ? `${pendingMeds} not taken yet`
          : "No medications scheduled",
      route: "/medication-tracker",
    },
    {
      title: "Next Appointment",
      primary: appointments.length > 0 ? getAppointmentPrimary(appointments[0]) : "—",
      secondary:
        appointments.length > 0
          ? getAppointmentSecondary(appointments[0])
          : "No data yet",
      route: "/patient-profile",
    },
    {
      title: "Care Notes",
      primary: `${recentNotes.length}`,
      secondary: recentNotes.length > 0 ? "recent notes" : "No notes yet",
      route: "/notes",
    },
  ];

  const displayStats = stats.length >= 4 ? stats.slice(0, 4) : fallbackStats;

  if (loading) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4 px-3 px-md-4" style={styles.containerMax}>
          <div className="p-5 text-center" style={styles.cardLike}>
            <div className="spinner-border text-primary mb-3" role="status" />
            <h4 className="fw-bold mb-2">Loading dashboard...</h4>
            <p className="text-secondary mb-0">
              Fetching patient care overview and activity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4 px-3 px-md-4" style={styles.containerMax}>
          <div className="p-4 p-md-5" style={styles.cardLike}>
            <div className="d-flex align-items-start gap-3">
              <div style={iconWrap("rgba(239, 68, 68, 0.12)")}>
                <AlertTriangle size={22} className="text-danger" />
              </div>
              <div>
                <h4 className="fw-bold mb-2">Unable to load dashboard</h4>
                <p className="text-secondary mb-0">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4 px-3 px-md-4" style={styles.containerMax}>
          <div className="alert alert-info mb-0">
            No patient selected. Please choose a patient from the sidebar.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBg}>
      <div className="container py-4 px-3 px-md-4" style={styles.containerMax}>
        <section className="p-4 p-md-5 mb-4" style={styles.hero}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4">
            <div>
              <div className="text-uppercase text-primary fw-semibold small mb-2">
                CareLink Overview
              </div>
              <h1 className="fw-bold mb-2" style={{ letterSpacing: "-0.02em" }}>
                Dashboard
              </h1>
              <p className="text-secondary mb-0">
                Overview of today’s care activity, medications, appointments,
                and updates.
              </p>
            </div>

            <div className="ms-lg-auto w-100 w-lg-auto">
              <div
                className="p-3 p-md-4"
                style={{
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  minWidth: "280px",
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div style={iconWrap("rgba(37, 99, 235, 0.12)")}>
                    <UserRound size={22} className="text-primary" />
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">
                      {data.patient?.name ?? "Selected Patient"}
                    </div>
                    <div className="text-secondary small">
                      {data.patient?.meta ?? "Patient information"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 d-flex flex-wrap gap-2">
                  <span className="badge text-bg-primary px-3 py-2 rounded-pill fw-medium">
                    Active Care Plan
                  </span>
                  <span className="badge text-bg-light border text-secondary px-3 py-2 rounded-pill fw-medium">
                    {formatFullDate(new Date())}
                  </span>
                </div>

                <div className="mt-3 small text-secondary">
                  <span className="fw-semibold text-dark">Caregiver:</span>{" "}
                  {data.caregiver?.name ?? "Unknown"}
                  {data.caregiver?.role ? ` • ${data.caregiver.role}` : ""}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-3 g-md-4 mb-4">
          {displayStats.map((stat, index) => (
            <div className="col-12 col-sm-6 col-xl-3" key={`${stat.title}-${index}`}>
              <button
                type="button"
                className="w-100 text-start p-4 border-0"
                style={{
                  ...styles.cardLike,
                  cursor: stat.route ? "pointer" : "default",
                }}
                onClick={() => stat.route && navigate(stat.route)}
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <div className="text-secondary fw-medium small mb-2">
                      {stat.title}
                    </div>
                    <div className="display-6 fw-bold text-dark mb-1">
                      {stat.primary}
                    </div>
                    <div className="small text-secondary">{stat.secondary}</div>
                  </div>
                  <div>{getStatIcon(index)}</div>
                </div>
              </button>
            </div>
          ))}
        </section>

        <section className="row g-4 mb-4">
          <div className="col-12 col-xl-8">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Today’s Med Schedule</h4>
                  <p className="text-secondary mb-0 small">
                    Medication times and completion status for the selected patient.
                  </p>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={goMeds}>
                  Medication Tracker
                </button>
              </div>

              {meds.length === 0 ? (
                <EmptyState
                  icon={<Pill size={20} className="text-secondary" />}
                  title="No medications scheduled yet"
                  subtitle="Medication entries for today will appear here."
                />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {meds.map((med, index) => (
                    <div
                      key={`${med.name}-${index}`}
                      className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-3"
                      style={{
                        borderRadius: "16px",
                        background: med.taken ? "#F0FDF4" : "#FFFFFF",
                        border: med.taken
                          ? "1px solid #BBF7D0"
                          : "1px solid #E5E7EB",
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          style={iconWrap(
                            med.taken
                              ? "rgba(34,197,94,0.14)"
                              : "rgba(59,130,246,0.12)",
                          )}
                        >
                          {med.taken ? (
                            <CheckCircle2 size={20} className="text-success" />
                          ) : (
                            <Clock3 size={20} className="text-primary" />
                          )}
                        </div>

                        <div>
                          <div className="fw-semibold text-dark">
                            {med.time} — {med.name}
                            {med.dose ? ` (${med.dose})` : ""}
                          </div>
                          <div className="small text-secondary">
                            {med.taken ? "Marked as taken" : "Pending administration"}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`badge rounded-pill px-3 py-2 ${med.taken
                          ? "text-bg-success"
                          : "text-bg-light border text-secondary"
                          }`}
                      >
                        {med.taken ? "Taken" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Upcoming Appointments</h4>
                  <p className="text-secondary mb-0 small">
                    Scheduled visits and upcoming care events.
                  </p>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={goProfile}>
                  Patient Profile
                </button>
              </div>

              {appointments.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays size={20} className="text-secondary" />}
                  title="No upcoming appointments yet"
                  subtitle="Future appointments and visits will appear here."
                />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {appointments.map((appointment, index) => (
                    <div
                      key={`${appointment.title}-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div style={iconWrap("rgba(99,102,241,0.12)")}>
                          <CalendarDays className="text-primary" size={20} />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold text-dark">{appointment.title}</div>
                          <div className="small text-secondary mt-1">
                            {getAppointmentLabel(appointment)}
                          </div>
                          {appointment.location && (
                            <div className="small text-secondary mt-1">
                              {appointment.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Recent Activity</h4>
                  <p className="text-secondary mb-0 small">
                    Recently completed task activity only.
                  </p>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={goTasks}>
                  View Tasks
                </button>
              </div>

              {taskOnlyActivity.length === 0 ? (
                <EmptyState
                  icon={<Activity size={20} className="text-secondary" />}
                  title="No recent task activity yet"
                  subtitle="Completed task activity will appear here."
                />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {taskOnlyActivity.map((item, index) => (
                    <div
                      key={`${getActivityText(item)}-${index}`}
                      className="d-flex align-items-start gap-3 p-3"
                      style={styles.softPanel}
                    >
                      <div style={iconWrap("rgba(59,130,246,0.12)")}>
                        <FileText size={18} className="text-primary" />
                      </div>

                      <div className="flex-grow-1">
                        <div className="fw-medium text-dark">
                          {getActivityText(item)}
                        </div>
                        {getActivityTime(item) && (
                          <div className="small text-secondary mt-1">
                            {getActivityTime(item)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1">Recent Notes</h4>
                  <p className="text-secondary mb-0 small">
                    Latest notes added for this patient.
                  </p>
                </div>
                <button className="btn btn-outline-primary btn-sm" onClick={goNotes}>
                  Open Notes
                </button>
              </div>

              {recentNotes.length === 0 ? (
                <EmptyState
                  icon={<StickyNote size={20} className="text-secondary" />}
                  title="No recent notes yet"
                  subtitle="New notes will appear here."
                />
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recentNotes.map((item, index) => (
                    <div
                      key={`${getActivityText(item)}-${index}`}
                      className="d-flex align-items-start gap-3 p-3"
                      style={styles.softPanel}
                    >
                      <div style={iconWrap("rgba(245,158,11,0.12)")}>
                        <StickyNote size={18} className="text-warning" />
                      </div>

                      <div className="flex-grow-1">
                        <div className="fw-medium text-dark">
                          {cleanNoteText(getActivityText(item))}
                        </div>
                        {getActivityTime(item) && (
                          <div className="small text-secondary mt-1">
                            {getActivityTime(item)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function getStatIcon(index: number) {
  switch (index) {
    case 0:
      return (
        <div style={iconWrap("rgba(37,99,235,0.12)")}>
          <CheckCircle2 className="text-primary" size={20} />
        </div>
      );
    case 1:
      return (
        <div style={iconWrap("rgba(16,185,129,0.12)")}>
          <Pill className="text-success" size={20} />
        </div>
      );
    case 2:
      return (
        <div style={iconWrap("rgba(99,102,241,0.12)")}>
          <CalendarDays className="text-primary" size={20} />
        </div>
      );
    default:
      return (
        <div style={iconWrap("rgba(245,158,11,0.12)")}>
          <StickyNote className="text-warning" size={20} />
        </div>
      );
  }
}

function getActivityText(item: ActivityItem): string {
  return (
    item.text ??
    item.message ??
    item.title ??
    item.description ??
    "Care activity recorded"
  );
}

function getActivityTime(item: ActivityItem): string {
  return item.time ?? item.timestamp ?? item.createdAt ?? "";
}

function cleanNoteText(text: string): string {
  return text.replace(/^note added:\s*/i, "");
}

function getAppointmentPrimary(item: AppointmentItem): string {
  return item.day ?? item.time ?? "—";
}

function getAppointmentSecondary(item: AppointmentItem): string {
  return item.title ?? "Upcoming appointment";
}

function getAppointmentLabel(item: AppointmentItem): string {
  const day = item.day ?? item.time ?? "Time not set";
  return item.location ? `${day} • ${item.location}` : day;
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className="text-center p-4"
      style={{
        borderRadius: "16px",
        border: "1px dashed #D1D5DB",
        background: "#F8FAFC",
      }}
    >
      <div
        className="mx-auto mb-3"
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EEF2F7",
        }}
      >
        {icon}
      </div>
      <div className="fw-semibold text-dark mb-1">{title}</div>
      <div className="small text-secondary">{subtitle}</div>
    </div>
  );
}