import type {
  AppRepo,
  NewAppointment,
  UpdateAppointmentInput,
} from "./AppRepo";
import type { AppointmentRecord } from "../../../types/appointment";
import { appointments } from "../../data";

export class StubAppRepo implements AppRepo {
  async getAppointmentsByPatient(
    patientId: string,
  ): Promise<AppointmentRecord[]> {
    return appointments.filter((a) => a.patientId === patientId);
  }

  async addAppointment(
    appointment: NewAppointment,
  ): Promise<AppointmentRecord> {
    const newRecord: AppointmentRecord = {
      appointmentId: crypto.randomUUID(),
      teamId: appointment.teamId,
      caregiverId: appointment.caregiverId,
      patientId: appointment.patientId,
      title: appointment.title?.trim() || null,
      scheduledAt: appointment.scheduledAt,
      description: appointment.description?.trim() || null,
      location: appointment.location?.trim() || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      isCompleted: false,
    };
    appointments.push(newRecord);
    return newRecord;
  }

  async updateAppointment(
    appointmentId: string,
    updates: UpdateAppointmentInput,
  ): Promise<AppointmentRecord> {
    const index = appointments.findIndex(
      (a) => a.appointmentId === appointmentId,
    );
    if (index === -1) throw new Error("Appointment not found");

    appointments[index] = {
      ...appointments[index],
      ...(updates.scheduledAt !== undefined && {
        scheduledAt: updates.scheduledAt,
      }),
      ...(updates.title !== undefined && {
        title: updates.title?.trim() || null,
      }),
      ...(updates.description !== undefined && {
        description: updates.description,
      }),
      ...(updates.location !== undefined && {
        location: updates.location?.trim() || null,
      }),
    };
    return appointments[index];
  }

  async markAppointmentComplete(
    appointmentId: string,
  ): Promise<AppointmentRecord> {
    const index = appointments.findIndex(
      (a) => a.appointmentId === appointmentId,
    );
    if (index === -1) throw new Error("Appointment not found");

    appointments[index] = {
      ...appointments[index],
      completedAt: new Date().toISOString(),
      isCompleted: true,
    };
    return appointments[index];
  }

  async markAppointmentIncomplete(
    appointmentId: string,
  ): Promise<AppointmentRecord> {
    const index = appointments.findIndex(
      (a) => a.appointmentId === appointmentId,
    );
    if (index === -1) throw new Error("Appointment not found");

    appointments[index] = {
      ...appointments[index],
      completedAt: null,
      isCompleted: false,
    };
    return appointments[index];
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    const index = appointments.findIndex(
      (a) => a.appointmentId === appointmentId,
    );
    if (index === -1) throw new Error("Appointment not found");
    appointments.splice(index, 1);
  }
}
