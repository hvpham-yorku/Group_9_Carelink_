/**
 * ============================================================
 * CareLink — Dashboard Page
 * File: src/pages/Dashboard.tsx
 *
 * Author: Neha
 * Iteration: 1 (UI-only, no backend)
 *
 * PURPOSE:
 * - Acts as the central hub of the CareLink app
 * - Displays patient summary, stats, activity, and today’s plan
 * - Provides navigation to other pages using React Router
 *
 * IMPORTANT NOTES FOR TEAM:
 * - This file contains NO shared logic and does not affect other pages.
 * - All data here is mock data (temporary) for Iteration 1.
 * - In Iteration 2, mock data can move to /data and later be replaced by backend.
 * - Styling in THIS version is Bootstrap-only (no Tailwind required).
 *
 * ============================================================
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   TYPE DEFINITIONS
   These define the structure of our mock data.
   ============================================================ */

type StatCard = {
  title: string;
  primary: string;
  secondary: string;
  route?: string; // optional route for navigation
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

/* ============================================================
   SMALL STYLE HELPERS (Bootstrap-safe)
   - We keep Bootstrap as the main styling system.
   - We use minimal inline styles ONLY for Figma-like details
     (gradient banner + larger rounded corners + soft shadows).
   ============================================================ */

const styles = {
  pageBg: {
    backgroundColor: "#F8FAFC", // similar to slate-50
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

/* ============================================================
   DASHBOARD COMPONENT
   ============================================================ */

export default function Dashboard() {
  const navigate = useNavigate();

  /* ============================================================
     MOCK DATA (Iteration 1)
     NOTE: Replace with real data / API in later iterations.
     ============================================================ */

  const caregiver = {
    name: "Jennifer Chen",
    role: "Primary Caregiver",
  };

  const patient = {
    name: "Margaret Chen",
    meta: "Mother • Age 78",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    emergencyContact: "Jennifer Chen",
    emergencyPhone: "(555) 987-6543",
  };

  const stats: StatCard[] = [
    {
      title: "Today's Tasks",
      primary: "3 / 8",
      secondary: "5 remaining",
      route: "/task-manager",
    },
    {
      title: "Medications",
      primary: "3 / 4",
      secondary: "1 missed",
      route: "/medication-tracker",
    },
    {
      title: "Next Appointment",
      primary: "5",
      secondary: "days away",
    },
    {
      title: "Care Notes",
      primary: "3",
      secondary: "recent updates",
      route: "/notes",
    },
  ];

  const recentActivity: ActivityItem[] = [
    { icon: "✅", text: "Task completed: Morning medication check" },
    { icon: "💊", text: "Medication logged: Metformin" },
    { icon: "📅", text: "Appointment scheduled: GP visit (Next week)" },
    { icon: "📝", text: "Care note added by caregiver" },
  ];

  const todaysMeds: MedItem[] = [
    { time: "08:00", name: "Metformin", dose: "500mg", taken: true },
    { time: "12:00", name: "Vitamin D", dose: "1000 IU", taken: true },
    { time: "18:00", name: "Amlodipine", dose: "5mg", taken: false },
  ];

  const upcomingAppointments: AppointmentItem[] = [
    { day: "Mon", title: "Physio Session", location: "Clinic A" },
    { day: "Wed", title: "Blood Test", location: "Lab - Main St" },
    { day: "Fri", title: "GP Follow-up", location: "Family Doctor" },
  ];

  /* ============================================================
     UI ACTIONS (Routing)
     - These buttons connect to other routes in the app.
     - No backend saving in Iteration 1.
     ============================================================ */

  const goTasks = () => navigate("/task-manager");
  const goMeds = () => navigate("/medication-tracker");
  const goProfile = () => navigate("/patient-profile");

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div style={styles.pageBg}>
      <div className="container py-4" style={styles.containerMax}>
        {/* ======================================================
            COMPONENT 1: PAGE TITLE
           ====================================================== */}
        <div className="mb-4">
          <h1 className="fw-bold" style={{ fontSize: "3rem", lineHeight: 1.05 }}>
            CareLink
          </h1>
          <div className="text-muted" style={{ fontSize: "1.1rem" }}>
            Home Care Dashboard
          </div>
        </div>

        {/* ======================================================
            COMPONENT 2: CAREGIVER HEADER CARD
           ====================================================== */}
        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="mb-3">
            <div className="fw-semibold" style={{ fontSize: "1.15rem" }}>
              {caregiver.name}
            </div>
            <div className="text-muted">{caregiver.role}</div>
          </div>

          {/* Primary navigation buttons */}
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

        {/* ======================================================
            COMPONENT 3: PATIENT INFO BANNER (Figma-like)
           ====================================================== */}
        <div className="p-4 mb-4" style={styles.banner}>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <div>
              <div className="fw-bold" style={{ fontSize: "2.6rem", lineHeight: 1.1 }}>
                {patient.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.85)" }}>{patient.meta}</div>

              {/* Condition pills */}
              <div className="mt-3 d-flex flex-wrap gap-2">
                {patient.conditions.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-pill"
                    style={styles.pill}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency contact (right side card) */}
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

        {/* ======================================================
            COMPONENT 4: STAT CARDS (4 across on large screens)
           ====================================================== */}
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
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 2px 10px rgba(15, 23, 42, 0.06)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
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

        {/* ======================================================
            COMPONENT 5: QUICK ACTIONS
           ====================================================== */}
        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="fw-bold" style={{ fontSize: "2rem" }}>
            Quick Actions
          </div>
          <div className="text-muted mt-1">
            Use these shortcuts to navigate through the app (Iteration 1 demo flow).
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

        {/* ======================================================
            COMPONENT 6: RECENT ACTIVITY
           ====================================================== */}
        <div className="bg-white p-4 mb-4" style={styles.cardLike}>
          <div className="fw-bold" style={{ fontSize: "2rem" }}>
            Recent Activity
          </div>

          <ul className="list-unstyled mt-3 mb-0 d-grid gap-3">
            {recentActivity.map((a, i) => (
              <li key={i} className="d-flex align-items-start gap-3">
                <span style={{ fontSize: "1.25rem" }}>{a.icon}</span>
                <span style={{ fontSize: "1.05rem" }}>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ======================================================
            COMPONENT 7: TODAY'S PLAN (2-column)
           ====================================================== */}
        <div className="row g-3 mb-4">
          {/* Left: Med schedule */}
          <div className="col-12 col-md-6">
            <div className="bg-white p-4 h-100" style={styles.cardLike}>
              <div className="fw-bold" style={{ fontSize: "1.75rem" }}>
                Today’s Med Schedule
              </div>
              <div className="text-muted mt-1">
                (Mock checklist — no data saving yet)
              </div>

              <div className="d-grid gap-3 mt-3">
                {todaysMeds.map((m, i) => (
                  <label
                    key={i}
                    className="d-flex gap-3 align-items-start p-3"
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      className="form-check-input mt-1"
                      type="checkbox"
                      defaultChecked={m.taken}
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
                ))}
              </div>

              <div className="mt-3">
                <button type="button" className="btn btn-light border" onClick={goMeds}>
                  Open Medication Tracker
                </button>
              </div>
            </div>
          </div>

          {/* Right: Upcoming appointments */}
          <div className="col-12 col-md-6">
            <div className="bg-white p-4 h-100" style={styles.cardLike}>
              <div className="fw-bold" style={{ fontSize: "1.75rem" }}>
                Upcoming Appointments
              </div>
              <div className="text-muted mt-1">(Mock list — routing only)</div>

              <div className="d-grid gap-3 mt-3">
                {upcomingAppointments.map((a, i) => (
                  <div
                    key={i}
                    className="p-3"
                    style={{
                      borderRadius: "14px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "#fff",
                    }}
                  >
                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.95rem" }}>
                      <span className="fw-semibold">{a.day}</span>
                      <span>{a.location}</span>
                    </div>
                    <div className="mt-2 fw-semibold" style={{ fontSize: "1.05rem" }}>
                      {a.title}
                    </div>
                  </div>
                ))}
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