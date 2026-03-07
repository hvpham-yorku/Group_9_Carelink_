/**
 * ============================================================
 * CareLink — Dashboard Page
 * File: src/pages/Dashboard.tsx
 *
 * Author: Neha
 * Iteration: 2 (connected to backend)
 *
 * PURPOSE:
 * - Acts as the central hub of the CareLink app
 * - Displays patient summary, stats, activity, and today’s plan
 * - Uses real backend data through useDashboardData()
 *
 * ============================================================
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";

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

const styles = {
  pageBg: {
    backgroundColor: "#F8FAFC",
    minHeight: "100vh",
    width: "100%",
  } as React.CSSProperties,

  containerMax: {
    maxWidth: "1100px",
  } as React.CSSProperties,

  cardLike: {
    borderRadius: "18px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
  } as React.CSSProperties,

  banner: {
    borderRadius: "18px",
    color: "#fff",
    background: "linear-gradient(90deg, #2F6FED 0%, #2D62F0 100%)",
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.10)",
  } as React.CSSProperties,

  pill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.95)",
  } as React.CSSProperties,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading, error } = useDashboardData();

  const goTasks = () => navigate("/task-manager");
  const goMeds = () => navigate("/medication-tracker");
  const goProfile = () => navigate("/patient-profile");

  if (loading) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4" style={styles.containerMax}>
          <div className="bg-white p-4" style={styles.cardLike}>
            <div className="d-flex align-items-center gap-2 text-muted">
              <span className="spinner-border spinner-border-sm" />
              Loading dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4" style={styles.containerMax}>
          <div className="alert alert-danger mb-0">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.pageBg}>
        <div className="container py-4" style={styles.containerMax}>
          <div className="alert alert-info mb-0">
            No patient selected. Please choose a patient from the sidebar.
          </div>
        </div>
      </div>
    );
  }

  const {
    caregiver,
    patient,
    stats,
    recentActivity,
    todaysMeds,
    upcomingAppointments,
  }: {
    caregiver: { name: string; role: string };
    patient: {
      name: string;
      meta: string;
      conditions: string[];
      emergencyContact: string;
      emergencyPhone: string;
    };
    stats: StatCard[];
    recentActivity: ActivityItem[];
    todaysMeds: MedItem[];
    upcomingAppointments: AppointmentItem[];
  } = data;

  return (
    <div style={styles.pageBg}>
      <div className="container py-4" style={styles.containerMax}>
        <div className="mb-4">
          <h1 className="fw-bold" style={{ fontSize: "3rem", lineHeight: 1.05 }}>
            CareLink
          </h1>
          <div className="text-muted" style={{ fontSize: "1.1rem" }}>
            Home Care Dashboard
          </div>
        </div>

        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="mb-3">
            <div className="fw-semibold" style={{ fontSize: "1.15rem" }}>
              {caregiver.name}
            </div>
            <div className="text-muted">{caregiver.role}</div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-light border" onClick={goTasks}>
              Tasks
            </button>

            <button type="button" className="btn btn-light border" onClick={goMeds}>
              Medications
            </button>

            <button type="button" className="btn btn-light border" onClick={goProfile}>
              Patient Profile
            </button>
          </div>
        </div>

        <div className="p-4 mb-4" style={styles.banner}>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <div>
              <div className="fw-bold" style={{ fontSize: "2.6rem", lineHeight: 1.1 }}>
                {patient.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.85)" }}>{patient.meta}</div>

              <div className="mt-3 d-flex flex-wrap gap-2">
                {patient.conditions.length > 0 ? (
                  patient.conditions.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-pill"
                      style={styles.pill}
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 rounded-pill" style={styles.pill}>
                    No conditions listed
                  </span>
                )}
              </div>
            </div>

            <div
              className="p-3"
              style={{
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                minWidth: "240px",
                alignSelf: "flex-start",
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>
                Emergency Contact
              </div>
              <div className="fw-semibold mt-1">{patient.emergencyContact}</div>
              <div className="mt-1" style={{ color: "rgba(255,255,255,0.9)" }}>
                {patient.emergencyPhone}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {stats.map((s) => {
            const clickable = Boolean(s.route);
            return (
              <div className="col-12 col-md-6 col-lg-3" key={s.title}>
                <div
                  role={clickable ? "button" : undefined}
                  onClick={() => (s.route ? navigate(s.route) : null)}
                  className="bg-white p-4 h-100"
                  style={{
                    ...styles.cardLike,
                    cursor: clickable ? "pointer" : "default",
                    transition: "transform 120ms ease, box-shadow 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!clickable) return;
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 6px 18px rgba(15, 23, 42, 0.10)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 10px rgba(15, 23, 42, 0.06)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(0px)";
                  }}
                >
                  <div className="fw-semibold" style={{ fontSize: "1.15rem" }}>
                    {s.title}
                  </div>

                  <div className="fw-bold mt-3" style={{ fontSize: "2.1rem" }}>
                    {s.primary}
                  </div>

                  <div className="text-muted mt-1">{s.secondary}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="fw-bold" style={{ fontSize: "2rem" }}>
            Quick Actions
          </div>
          <div className="text-muted mt-1">
            Use these shortcuts to navigate through the app.
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="button" className="btn btn-light border" onClick={goTasks}>
              Go to Task Manager
            </button>
            <button type="button" className="btn btn-light border" onClick={goMeds}>
              Go to Medication Tracker
            </button>
            <button type="button" className="btn btn-light border" onClick={goProfile}>
              Go to Patient Profile
            </button>
          </div>
        </div>

        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="fw-bold" style={{ fontSize: "2rem" }}>
            Recent Activity
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-muted mt-3">No recent activity yet.</div>
          ) : (
            <ul className="list-unstyled mt-3 mb-0 d-grid gap-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="d-flex align-items-start gap-3">
                  <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                  <span style={{ fontSize: "1.05rem" }}>{a.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="bg-white p-4 h-100" style={styles.cardLike}>
              <div className="fw-bold" style={{ fontSize: "1.75rem" }}>
                Today’s Med Schedule
              </div>
              <div className="text-muted mt-1">Linked to Medication Tracker</div>

              <div className="d-grid gap-3 mt-3">
                {todaysMeds.length > 0 ? (
                  todaysMeds.map((m, i) => (
                    <label
                      key={i}
                      className="d-flex gap-3 align-items-start p-3"
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#fff",
                        cursor: "default",
                      }}
                    >
                      <input
                        className="form-check-input mt-1"
                        type="checkbox"
                        checked={m.taken}
                        readOnly
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {m.time} — {m.name} ({m.dose})
                        </div>
                        <div className="text-muted" style={{ fontSize: "0.95rem" }}>
                          Status: {m.taken ? "taken" : "not taken yet"}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div
                    className="p-3 text-muted"
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#fff",
                    }}
                  >
                    No medications scheduled yet.
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button type="button" className="btn btn-light border" onClick={goMeds}>
                  Open Medication Tracker
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="bg-white p-4 h-100" style={styles.cardLike}>
              <div className="fw-bold" style={{ fontSize: "1.75rem" }}>
                Upcoming Appointments
              </div>
              <div className="text-muted mt-1">Will show real data when added</div>

              <div className="d-grid gap-3 mt-3">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((a, i) => (
                    <div
                      key={i}
                      className="p-3"
                      style={{
                        borderRadius: "14px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        className="d-flex justify-content-between text-muted"
                        style={{ fontSize: "0.95rem" }}
                      >
                        <span className="fw-semibold">{a.day}</span>
                        <span>{a.location}</span>
                      </div>
                      <div className="mt-2 fw-semibold" style={{ fontSize: "1.05rem" }}>
                        {a.title}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className="p-3 text-muted"
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#fff",
                    }}
                  >
                    No upcoming appointments yet.
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button type="button" className="btn btn-light border" onClick={goTasks}>
                  Open Task Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}