import type { TeamRepo, NewPatientData } from "./TeamRepo";
import type {
  CaregiverInfo,
  PatientInfo,
  Category,
} from "../../../types/teams";

import { careTeams, teamPatients, categories } from "../../data";

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
    const code = joinCode;
    const caregiver = caregiverId;

    throw new Error(
      `joinTeamWithCode not supported in stub mode {code: ${code}, caregiverId: ${caregiver}}`,
    );
  }

  /*
   * Team Editing Methods ----------------------------------------------------------------
   */

  async addPatientToTeam(
    teamId: string,
    patientData: NewPatientData,
  ): Promise<unknown> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    if (team) {
      const newPatient: PatientInfo = {
        patientId: crypto.randomUUID(),
        ...patientData,
      };
      team.patients.push(newPatient);
      teamPatients.push(newPatient);
      return newPatient;
    }
    throw new Error(`Team not found {teamId: ${teamId}}`);
  }

  async updateTeamName(teamId: string, newName: string): Promise<void> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    if (team) {
      team.teamName = newName;
    } else {
      throw new Error(`Team not found {teamId: ${teamId}}`);
    }
  }

  async getCategories(teamId: string): Promise<Category[]> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    return team ? [...categories] : [];
  }

  async addCategory(teamId: string, categoryName: string): Promise<void> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    if (team) {
      const newCategory = {
        categoryId: crypto.randomUUID(),
        name: categoryName,
      };
      categories.push(newCategory);
    } else {
      throw new Error(`Team not found {teamId: ${teamId}}`);
    }
  }

  async editCaregiverRole(
    teamId: string,
    caregiverId: string,
    newRole: string,
  ): Promise<void> {
    const team = careTeams.find((t) => t.careTeamId === teamId);

    if (team) {
      const caregiver = team.caregivers.find(
        (c) => c.caregiverId === caregiverId,
      );
      if (caregiver) {
        caregiver.teamRole = newRole;
      } else {
        throw new Error(`Caregiver not found {caregiverId: ${caregiverId}}`);
      }
    } else {
      throw new Error(`Team not found {teamId: ${teamId}}`);
    }
  }

  async removeCaregiver(teamId: string, caregiverId: string): Promise<void> {
    const team = careTeams.find((t) => t.careTeamId === teamId);
    if (team) {
      const caregiverIndex = team.caregivers.findIndex(
        (c) => c.caregiverId === caregiverId,
      );
      if (caregiverIndex !== -1) {
        team.caregivers.splice(caregiverIndex, 1);
      } else {
        throw new Error(`Caregiver not found {caregiverId: ${caregiverId}}`);
      }
    } else {
      throw new Error(`Team not found {teamId: ${teamId}}`);
    }
  }
}
