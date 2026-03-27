import type {
  CaregiverInfo,
  PatientInfo,
  Category,
} from "../../../types/teams";

export interface NewPatientData {
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string;
}

export interface TeamRepo {
  getName(teamId: string): Promise<string | null>;
  getJoinCode(teamId: string): Promise<string | null>;
  getCaregivers(teamId: string): Promise<CaregiverInfo[]>;
  getPatients(teamId: string): Promise<PatientInfo[]>;
  getCategories(teamId: string): Promise<Category[]>;
  joinTeamWithCode(caregiverId: string, joinCode: string): Promise<string>;

  // editing team info methods
  addPatientToTeam(
    teamId: string,
    patientData: NewPatientData,
  ): Promise<unknown>;

  updateTeamName(teamId: string, newName: string): Promise<void>;
  addCategory(
    teamId: string,
    categoryName: string,
    color: string,
  ): Promise<void>;
  // removeCategory(teamId: string, categoryName: string): Promise<void>;
  editCaregiverRole(
    teamId: string,
    caregiverId: string,
    newRole: string,
  ): Promise<void>;
  removeCaregiver(teamId: string, caregiverId: string): Promise<void>;
}
