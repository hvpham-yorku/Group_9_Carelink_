import type { TeamRepo } from "./TeamRepo";
import type { CaregiverInfo, PatientInfo } from "../../../types/Types";

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

  async getCaregivers(
    teamId: string,
    caregiverId: string,
  ): Promise<CaregiverInfo[]> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    const caregivers = team
      ? team.caregivers.filter((c) => c.caregiverId === caregiverId)
      : [];

    return caregivers ? caregivers : [];
  }

  async getPatients(teamId: string, patientId: string): Promise<PatientInfo[]> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    const patients = team
      ? team.patients.filter((p) => p.patientId === patientId)
      : [];

    return patients ? patients : [];
  }
}
