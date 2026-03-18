import type { CaregiverInfo, PatientInfo } from "../../../types/teams";

export interface NewPatientData {
  firstName: string;
  lastName: string;
  dob: string;
  address?: string;
  phoneNumber?: string;
}

export interface TeamRepo {
  getName(teamId: string): Promise<string | null>;
  getJoinCode(teamId: string): Promise<string | null>;
  getCaregivers(teamId: string): Promise<CaregiverInfo[]>;
  getPatients(teamId: string): Promise<PatientInfo[]>;
  joinTeamWithCode(caregiverId: string, joinCode: string): Promise<string>;
  addPatientToTeam(
    teamId: string,
    patientData: NewPatientData,
  ): Promise<unknown>;
}
