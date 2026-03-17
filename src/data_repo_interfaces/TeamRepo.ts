import type { CaregiverInfo, PatientInfo } from "../types/Types";

export interface TeamRepo {
  getName(teamId: string): Promise<string>;
  getJoinCode(teamId: string): Promise<string>;
  getCaregivers(teamId: string, caregiverId: string): Promise<CaregiverInfo[]>;
  getPatients(teamId: string, patientId: string): Promise<PatientInfo[]>;
}
