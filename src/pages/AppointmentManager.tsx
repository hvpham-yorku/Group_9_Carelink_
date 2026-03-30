// src/pages/AppointmentManager.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import { authService } from "../services/authService";
import { repositories } from "../data";
import type { AppointmentRecord } from "../types/appointment";
import { usePatient } from "../contexts/patient/usePatient";
import { useAuth } from "../hooks/useAuth";

type FormState = {
  scheduledAt: string;
  description: string;
};

const emptyForm: FormState = {
  scheduledAt: "",
  description: "",
};

function toDatetimeLocalValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMonthKey(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
}

function formatDayNumber(value: string) {
  return new Date(value).getDate();
}

function formatWeekday(value: string) {
  return new Date(value).toLocaleDateString([], {
    weekday: "short",
  });
}

export default function AppointmentManager() {
  const { user } = useAuth();
  const {
    selectedPatientId,
    careTeamId,
    loading: patientLoading,
  } = usePatient();

  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const loadAppointments = useCallback(async () => {
    if (!selectedPatientId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data =
        await repositories.appointment.getAppointmentsByPatient(
          selectedPatientId,
        );
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (!patientLoading) {
      loadAppointments();
    }
  }, [selectedPatientId, patientLoading, loadAppointments]);

  const groupedAppointments = useMemo(() => {
    const groups: Record<string, AppointmentRecord[]> = {};

    appointments.forEach((appt) => {
      const key = formatMonthKey(appt.scheduledAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(appt);
    });

    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
    });

    return groups;
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const now = Date.now();
    return appointments
      .filter(
        (appt) =>
          !appt.isCompleted && new Date(appt.scheduledAt).getTime() >= now,
      )
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
  }, [appointments]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (appointment: AppointmentRecord) => {
    setEditingId(appointment.appointmentId);
    setForm({
      scheduledAt: toDatetimeLocalValue(appointment.scheduledAt),
      description: appointment.description || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatientId || !careTeamId || !user?.id) {
      setError("Missing patient, care team, or user information.");
      return;
    }

    if (!form.scheduledAt.trim()) {
      setError("Please choose a date and time.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const caregiver = await authService.getProfile(user.id);
      if (!caregiver?.caregiver_id) {
        throw new Error("Unable to resolve caregiver profile.");
      }

      if (editingId) {
        await repositories.appointment.updateAppointment(editingId, {
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          description: form.description,
        });
      } else {
        await repositories.appointment.addAppointment({
          patientId: selectedPatientId,
          teamId: careTeamId,
          caregiverId: caregiver.caregiver_id,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          description: form.description,
        });
      }

      await loadAppointments();
      resetForm();
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError("Failed to save appointment.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (appointment: AppointmentRecord) => {
    try {
      setError(null);

      if (appointment.isCompleted) {
        await repositories.appointment.markAppointmentIncomplete(
          appointment.appointmentId,
        );
      } else {
        await repositories.appointment.markAppointmentComplete(
          appointment.appointmentId,
        );
      }

      await loadAppointments();

      if (selectedAppointment?.appointmentId === appointment.appointmentId) {
        const refreshed = appointments.find(
          (a) => a.appointmentId === appointment.appointmentId,
        );
        setSelectedAppointment(refreshed || null);
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status.");
    }
  };

  const handleDelete = async (appointmentId: string) => {
    const confirmed = window.confirm("Delete this appointment?");
    if (!confirmed) return;

    try {
      setError(null);
      await repositories.appointment.deleteAppointment(appointmentId);
      if (selectedAppointment?.appointmentId === appointmentId) {
        setSelectedAppointment(null);
      }
      await loadAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment.");
    }
  };

  if (patientLoading || loading) {
    return (
      <div className="container py-4">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h4 className="fw-bold mb-2">Loading appointments...</h4>
          <p className="text-secondary mb-0">
            Fetching the appointment schedule for the selected patient.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedPatientId) {
    return (
      <div className="container py-4">
        <div className="card border-0 shadow-sm rounded-4 p-4">
          <h3 className="fw-bold mb-2">Appointments</h3>
          <p className="text-secondary mb-0">
            Select a patient first to manage appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Appointment Manager</h2>
          <p className="text-secondary mb-0">
            Schedule, review, update, and complete patient appointments.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary rounded-pill px-4 d-inline-flex align-items-center gap-2"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add Appointment
        </button>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <CalendarDays size={20} />
                <h5 className="fw-bold mb-0">Calendar View</h5>
              </div>

              {appointments.length === 0 ? (
                <p className="text-secondary mb-0">
                  No appointments yet. Add the first one to start the schedule.
                </p>
              ) : (
                Object.entries(groupedAppointments).map(
                  ([monthLabel, items]) => (
                    <div key={monthLabel} className="mb-4">
                      <div className="fw-semibold text-primary mb-2">
                        {monthLabel}
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {items.map((appointment) => {
                          const isSelected =
                            selectedAppointment?.appointmentId ===
                            appointment.appointmentId;

                          return (
                            <button
                              key={appointment.appointmentId}
                              type="button"
                              className={`btn text-start border rounded-4 p-3 ${
                                isSelected
                                  ? "border-primary bg-primary bg-opacity-10"
                                  : "bg-white"
                              }`}
                              onClick={() =>
                                setSelectedAppointment(appointment)
                              }
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <div className="small text-secondary">
                                    {formatWeekday(appointment.scheduledAt)}
                                  </div>
                                  <div className="fw-bold fs-4 lh-1">
                                    {formatDayNumber(appointment.scheduledAt)}
                                  </div>
                                </div>

                                <div className="text-end ms-3">
                                  <div className="fw-semibold">
                                    {new Date(
                                      appointment.scheduledAt,
                                    ).toLocaleTimeString([], {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  <div className="small text-secondary">
                                    {appointment.isCompleted
                                      ? "Completed"
                                      : "Scheduled"}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 small">
                                {appointment.description?.trim() ||
                                  "No description provided."}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Upcoming Appointments</h5>

              {upcomingAppointments.length === 0 ? (
                <p className="text-secondary mb-0">
                  No upcoming appointments yet.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.appointmentId}
                      className="border rounded-4 p-3"
                      role="button"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div>
                          <div className="fw-semibold">
                            {formatDateTime(appointment.scheduledAt)}
                          </div>
                          <div className="small text-secondary mt-1">
                            {appointment.description?.trim() ||
                              "No description provided."}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success rounded-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(appointment);
                          }}
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                {showForm
                  ? editingId
                    ? "Edit Appointment"
                    : "Add Appointment"
                  : "Appointment Details"}
              </h5>

              {showForm ? (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="form-control rounded-3"
                      value={form.scheduledAt}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          scheduledAt: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows={5}
                      placeholder="Enter visit details, reason, reminders, or location..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                          ? "Save Changes"
                          : "Create Appointment"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : selectedAppointment ? (
                <>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    {selectedAppointment.isCompleted ? (
                      <CheckCircle2 size={20} className="text-success" />
                    ) : (
                      <Circle size={20} className="text-secondary" />
                    )}
                    <span className="fw-semibold">
                      {selectedAppointment.isCompleted
                        ? "Completed"
                        : "Scheduled"}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="small text-secondary">Scheduled For</div>
                    <div className="fw-semibold">
                      {formatDateTime(selectedAppointment.scheduledAt)}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="small text-secondary">Description</div>
                    <div>
                      {selectedAppointment.description?.trim() ||
                        "No description provided."}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="small text-secondary">Completed Time</div>
                    <div>
                      {selectedAppointment.isCompleted
                        ? formatDateTime(selectedAppointment.completedAt)
                        : "Not completed yet"}
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill d-inline-flex align-items-center gap-2"
                      onClick={() => openEditForm(selectedAppointment)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className={`btn rounded-pill d-inline-flex align-items-center gap-2 ${
                        selectedAppointment.isCompleted
                          ? "btn-outline-warning"
                          : "btn-outline-success"
                      }`}
                      onClick={() => handleToggleComplete(selectedAppointment)}
                    >
                      {selectedAppointment.isCompleted ? (
                        <>
                          <Circle size={16} />
                          Mark Incomplete
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Mark Complete
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger rounded-pill d-inline-flex align-items-center gap-2"
                      onClick={() =>
                        handleDelete(selectedAppointment.appointmentId)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-secondary mb-0">
                  Select an appointment from the calendar or upcoming list, or
                  add a new one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
