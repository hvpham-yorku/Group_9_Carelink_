import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  Pill,
  UserRound,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashBoardData";

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
  day?: string;
  title: string;
  location?: string;
  time?: string;
  primary?: string;
  secondary?: string;
  scheduledAt?: string;
  description?: string;
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
  recentNotes?: ActivityItem[];
  todaysMeds: MedItem[];
  upcomingAppointments: AppointmentItem[];
};

const styles = {
  pageBg: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #F8FBFF 0%, #F3F6FB 45%, #EEF2F7 100%)",
  } as React.CSSProperties,

  containerMax: {
    maxWidth: "1400px",
  } as React.CSSProperties,

  hero: {
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(219,234,254,0.9) 0%, rgba(255,255,255,0.98) 48%, rgba(237,242,247,0.96) 100%)",
    border: "1px solid rgba(226,232,240,0.95)",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  } as React.CSSProperties,

  cardLike: {
    borderRadius: "20px",
    background: "#FFFFFF",
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

function getAppointmentPrimary(appointment: AppointmentItem): string {
  if (appointment.primary) return appointment.primary;
  if (appointment.day) return appointment.day;
  if (appointment.scheduledAt) {
    return new Date(appointment.scheduledAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
  return "—";
}

function getAppointmentSecondary(appointment: AppointmentItem): string {
  if (appointment.secondary) return appointment.secondary;

  const title = appointment.title || appointment.description || "Appointment";
  const time = appointment.time ? ` • ${appointment.time}` : "";

  return `${title}${time}`;
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
  const goAppointments = () => navigate("/appointments");
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
      route: "/appointments",
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
                      {data.patient?.meta ?? "Patient overview"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top">
                  <div className="small text-uppercase text-secondary fw-semibold mb-2">
                    Caregiver
                  </div>
                  <div className="fw-semibold">
                    {data.caregiver?.name ?? "Caregiver"}
                  </div>
                  <div className="text-secondary small">
                    {data.caregiver?.role ?? "Care team member"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-4 mb-4">
          {displayStats.map((stat, index) => (
            <div key={`${stat.title}-${index}`} className="col-12 col-sm-6 col-xl-3">
              <button
                type="button"
                className="w-100 text-start p-4 border-0"
                style={{
                  ...styles.cardLike,
                  cursor: stat.route ? "pointer" : "default",
                }}
                onClick={() => {
                  if (stat.route) navigate(stat.route);
                }}
              >
                <div className="text-secondary small fw-semibold text-uppercase mb-2">
                  {stat.title}
                </div>
                <div className="fw-bold fs-2 text-dark">{stat.primary}</div>
                <div className="text-secondary mt-1">{stat.secondary}</div>
              </button>
            </div>
          ))}
        </section>

        <section className="row g-4">
          <div className="col-12 col-xl-4">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={iconWrap("rgba(34, 197, 94, 0.12)")}>
                    <Pill size={20} className="text-success" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Today’s Med Schedule</h5>
                    <div className="text-secondary small">
                      Track today’s medication plan
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={goMeds}
                >
                  Open
                </button>
              </div>

              {meds.length === 0 ? (
                <div className="text-secondary">No medications scheduled yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {meds.map((med, index) => (
                    <div
                      key={`${med.name}-${med.time}-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">{med.name}</div>
                          <div className="text-secondary small">
                            {med.dose || "Dose not specified"}
                          </div>
                        </div>

                        <span
                          className={`badge rounded-pill ${med.taken ? "text-bg-success" : "text-bg-light"
                            }`}
                        >
                          {med.taken ? "Taken" : "Pending"}
                        </span>
                      </div>

                      <div className="mt-2 d-flex align-items-center gap-2 text-secondary small">
                        <Clock3 size={14} />
                        <span>{med.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={iconWrap("rgba(59, 130, 246, 0.12)")}>
                    <CalendarDays size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Upcoming Appointments</h5>
                    <div className="text-secondary small">
                      Scheduled visits and events
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={goAppointments}
                >
                  Open
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-secondary">No upcoming appointments yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {appointments.map((appointment, index) => (
                    <div
                      key={`${appointment.title}-${appointment.time}-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">
                            {appointment.title || appointment.description || "Appointment"}
                          </div>
                          <div className="text-secondary small">
                            {appointment.location || "Location not specified"}
                          </div>
                        </div>

                        <span className="badge text-bg-light rounded-pill">
                          {appointment.day || appointment.primary || "Upcoming"}
                        </span>
                      </div>

                      <div className="mt-2 d-flex align-items-center gap-2 text-secondary small">
                        <Clock3 size={14} />
                        <span>
                          {appointment.time ||
                            appointment.secondary ||
                            "Time not specified"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={iconWrap("rgba(249, 115, 22, 0.12)")}>
                    <ClipboardList size={20} className="text-warning" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Recent Activity</h5>
                    <div className="text-secondary small">
                      Latest task and care updates
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={goTasks}
                >
                  Open
                </button>
              </div>

              {taskOnlyActivity.length === 0 ? (
                <div className="text-secondary">No recent activity yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {taskOnlyActivity.map((item, index) => (
                    <div
                      key={`${item.text}-${index}`}
                      className="d-flex align-items-start gap-3 p-3"
                      style={styles.softPanel}
                    >
                      <div style={iconWrap("rgba(34, 197, 94, 0.12)")}>
                        <CheckCircle2 size={18} className="text-success" />
                      </div>
                      <div>
                        <div className="fw-semibold">{item.text}</div>
                        <div className="text-secondary small">
                          {item.time || "Recently updated"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="row g-4 mt-1">
          <div className="col-12 col-xl-7">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={iconWrap("rgba(99, 102, 241, 0.12)")}>
                    <CalendarDays size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Schedule Overview</h5>
                    <div className="text-secondary small">
                      Combined view of medication and appointment timing
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={goAppointments}
                >
                  View Appointments
                </button>
              </div>

              {meds.length === 0 && appointments.length === 0 ? (
                <div className="text-secondary">No schedule items available yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {appointments.map((appointment, index) => (
                    <div
                      key={`schedule-appt-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div style={iconWrap("rgba(59, 130, 246, 0.12)")}>
                          <CalendarDays size={18} className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">
                            {appointment.title || appointment.description || "Appointment"}
                          </div>
                          <div className="text-secondary small">
                            {appointment.day || "Upcoming"}
                            {appointment.time ? ` • ${appointment.time}` : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {meds.map((med, index) => (
                    <div
                      key={`schedule-med-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div style={iconWrap("rgba(34, 197, 94, 0.12)")}>
                          <Pill size={18} className="text-success" />
                        </div>
                        <div>
                          <div className="fw-semibold">{med.name}</div>
                          <div className="text-secondary small">
                            {med.time}
                            {med.dose ? ` • ${med.dose}` : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="p-4 h-100" style={styles.cardLike}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div style={iconWrap("rgba(168, 85, 247, 0.12)")}>
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Recent Notes</h5>
                    <div className="text-secondary small">
                      Latest care documentation
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill"
                  onClick={goNotes}
                >
                  Open
                </button>
              </div>

              {recentNotes.length === 0 ? (
                <div className="text-secondary">No notes yet.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {recentNotes.map((note, index) => (
                    <div
                      key={`${note.text}-${index}`}
                      className="p-3"
                      style={styles.softPanel}
                    >
                      <div className="fw-semibold">{note.text}</div>
                      <div className="text-secondary small mt-1">
                        {note.time || "Recently updated"}
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