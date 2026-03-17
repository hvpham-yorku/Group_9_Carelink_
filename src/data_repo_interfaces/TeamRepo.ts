import type { CaregiverInfo, PatientInfo } from "../types/Types";

export interface TeamRepo {
  getName(careTeamId: string): Promise<string>;
  getJoinCode(careTeamId: string): Promise<string>;
  getCaregivers(careTeamId: string): Promise<CaregiverInfo[]>;
  getPatients(careTeamId: string): Promise<PatientInfo[]>;
}
