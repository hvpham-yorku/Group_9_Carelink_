import type { TeamRepo, NewPatientData } from "./TeamRepo";
import type { CaregiverInfo, PatientInfo } from "../../../types/teams";

import { careTeams } from "../../data";

export class StubTeamRepo implements TeamRepo {
  async getName(teamId: string): Promise<string> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    // team.teamName! asserts that teamName is not null
    return team ? team.teamName! : "Team Name Not Found";
  }

  async getJoinCode(teamId: string): Promise<string> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    return team ? team.joinCode : "Join Code Not Found";
  }

  async getCaregivers(teamId: string): Promise<CaregiverInfo[]> {
    const team = careTeams.find((t) => t.careTeamId === teamId);

    return team ? team.caregivers : [];
  }

  async getPatients(teamId: string): Promise<PatientInfo[]> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    return team ? team.patients : [];
  }

  async joinTeamWithCode(
    caregiverId: string,
    joinCode: string,
  ): Promise<string> {
    throw new Error("joinTeamWithCode not supported in stub mode");
  }

  async addPatientToTeam(
    teamId: string,
    patientData: NewPatientData,
  ): Promise<unknown> {
    throw new Error("addPatientToTeam not supported in stub mode");
  }
}
