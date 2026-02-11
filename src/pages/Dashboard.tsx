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
 * - This file contains NO shared logic
 * - All data here is temporary and local
 * - Safe to modify visuals without affecting other pages
 * - Tailwind classes are used for styling (Bootstrap still supported globally)
 * 
 * 
 * ============================================================
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   TYPE DEFINITIONS
   These define the structure of our mock data.
   Keeping them explicit makes the file easier to understand
   and safer to extend later.
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
   SHARED STYLING CONSTANTS
   These keep the UI consistent and close to Figma.
   If Tailwind is disabled, the page still renders correctly.
   ============================================================ */

const pageBg = "min-h-screen w-full bg-slate-50";
const container = "mx-auto max-w-6xl px-6 py-8";
const sectionGap = "space-y-8";

const card =
  "w-full rounded-2xl border border-slate-200 bg-white shadow-sm";
const cardPad = "p-6";

const titleXL = "text-5xl font-extrabold tracking-tight text-slate-900";
const titleLG = "text-3xl font-bold text-slate-900";
const titleMD = "text-xl font-semibold text-slate-900";
const bodyText = "text-slate-700";

/* ============================================================
   DASHBOARD COMPONENT
   ============================================================ */

export default function Dashboard() {
  const navigate = useNavigate();

  /* ============================================================
     MOCK DATA
     NOTE: This will be replaced by backend data in later iterations.
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
     RENDER
     ============================================================ */

  return (
    <div className={pageBg}>
      <div className={container}>
        <div className={sectionGap}>
          {/* ======================================================
              COMPONENT 1: PAGE TITLE
              ====================================================== */}
          <div>
            <h1 className={titleXL}>CareLink</h1>
            <p className={bodyText}>Home Care Dashboard</p>
          </div>

          {/* ======================================================
              COMPONENT 2: CAREGIVER HEADER CARD
              ====================================================== */}
          <div className={`${card} ${cardPad}`}>
            <div className="space-y-3">
              <div className={titleMD}>{caregiver.name}</div>
              <div className={bodyText}>{caregiver.role}</div>

              {/* Primary navigation buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => navigate("/task-manager")} className="btn">
                  Tasks
                </button>
                <button
                  onClick={() => navigate("/medication-tracker")}
                  className="btn"
                >
                  Medications
                </button>
                <button
                  onClick={() => navigate("/patient-profile")}
                  className="btn"
                >
                  Patient Profile
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================
              COMPONENT 3: PATIENT INFO BANNER (FIGMA STYLE)
              ====================================================== */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white shadow-sm">
            <div className="text-4xl font-extrabold">{patient.name}</div>
            <div className="mt-1 text-blue-100">{patient.meta}</div>

            {/* Condition pills */}
            <div className="mt-4 flex gap-2">
              {patient.conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/20 px-3 py-1 text-sm"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Emergency contact */}
            <div className="mt-6 text-sm text-blue-100">
              Emergency Contact
            </div>
            <div className="font-semibold">{patient.emergencyContact}</div>
            <div>{patient.emergencyPhone}</div>
          </div>

          {/* ======================================================
              COMPONENT 4: STAT CARDS
              ====================================================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.title}
                onClick={() => s.route && navigate(s.route)}
                className={`${card} ${cardPad} ${s.route ? "cursor-pointer hover:shadow-md" : ""
                  }`}
              >
                <div className={titleMD}>{s.title}</div>
                <div className="mt-3 text-2xl font-bold">{s.primary}</div>
                <div className="mt-1 text-slate-600">{s.secondary}</div>
              </div>
            ))}
          </div>

          {/* ======================================================
              COMPONENT 5: QUICK ACTIONS
              ====================================================== */}
          <div className={`${card} ${cardPad}`}>
            <div className={titleLG}>Quick Actions</div>
            <p className={bodyText}>
              Use these shortcuts to navigate through the app.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => navigate("/task-manager")} className="btn">
                Go to Task Manager
              </button>
              <button
                onClick={() => navigate("/medication-tracker")}
                className="btn"
              >
                Go to Medication Tracker
              </button>
              <button
                onClick={() => navigate("/patient-profile")}
                className="btn"
              >
                Go to Patient Profile
              </button>
            </div>
          </div>

          {/* ======================================================
              COMPONENT 6: Notes
              ====================================================== */}
          <div className={`${card} ${cardPad}`}>
            <div className={titleLG}>Notes</div>

            <ul className="mt-4 space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ======================================================
              COMPONENT 7: TODAY'S PLAN
              ====================================================== */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Medication Schedule */}
            <div className={`${card} ${cardPad}`}>
              <div className={titleLG}>Today’s Med Schedule</div>
              <p className={bodyText}>
                (Mock checklist — no data saving yet)
              </p>

              <div className="mt-4 space-y-3">
                {todaysMeds.map((m, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={m.taken}
                      className="h-4 w-4"
                    />
                    <div>
                      <div className="font-semibold">
                        {m.time} — {m.name} ({m.dose})
                      </div>
                      <div className="text-sm text-slate-600">
                        Status: {m.taken ? "taken" : "not taken yet"}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className={`${card} ${cardPad}`}>
              <div className={titleLG}>Upcoming Appointments</div>

              <div className="mt-4 space-y-3">
                {upcomingAppointments.map((a, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>{a.day}</span>
                      <span>{a.location}</span>
                    </div>
                    <div className="mt-2 font-semibold">{a.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================
              FINAL STATUS CARD (DEV CONFIRMATION)
              ====================================================== */}
          <div className={`${card} ${cardPad}`}>
            <div className="flex gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-medium">
                  Components loaded successfully.
                </div>
                <div className="text-slate-600">
                  Dashboard is complete for Iteration 1.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}