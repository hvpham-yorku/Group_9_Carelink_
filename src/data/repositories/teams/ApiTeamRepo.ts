import type { TeamRepo } from "./TeamRepo";
import type { CaregiverInfo, PatientInfo } from "../../../types/teams";
import { supabase } from "../../../lib/supabase";

export class ApiTeamRepo implements TeamRepo {
  async getName(teamId: string): Promise<string> {
    const { data, error } = await supabase
      .from("careTeams")
      .select("teamName")
      .eq("careTeamId", teamId)
      .single();

    if (error) throw error;

    return data.teamName;
  }

  async getJoinCode(teamId: string): Promise<string> {
    const { data, error } = await supabase
      .from("careTeams")
      .select("joinCode")
      .eq("careTeamId", teamId)
      .single();

    if (error) throw error;

    return data.joinCode;
  }

  async getCaregivers(
    teamId: string,
    caregiverId: string,
  ): Promise<CaregiverInfo[]> {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
            caregivers (caregiverId, firstName, lastName, phoneNumber, email, jobTitle, teamRole, teamDateAssigned)
        `,
      )
      .eq("careTeamId", teamId)
      .is("patientId", null)
      .eq("caregiverId", caregiverId);

    if (error) throw error;

    return (data ?? [])
      .map((row) => row.caregivers)
      .filter(Boolean) as CaregiverInfo[];
  }

  async getPatients(teamId: string, patientId: string): Promise<PatientInfo[]> {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
            patientId,
            role,
            patients (firstName, lastName, email, dateOfBirth, gender, medicalConditions)
          `,
      )
      .eq("careTeamId", teamId)
      .is("caregiverId", null)
      .eq("patientId", patientId);

    if (error) throw error;

    return data;
  }
}
