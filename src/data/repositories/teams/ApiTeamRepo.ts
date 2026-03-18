import type { TeamRepo } from "./TeamRepo";
import type { CaregiverInfo, PatientInfo } from "../../../types/teams";
import { supabase } from "../../../lib/supabase";

export class ApiTeamRepo implements TeamRepo {
  async getName(teamId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("careTeams")
      .select("teamName")
      .eq("careTeamId", teamId)
      .single();

    if (error) throw error;

    return data.teamName;
  }

  async getJoinCode(teamId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("careTeams")
      .select("joinCode")
      .eq("careTeamId", teamId)
      .single();

    if (error) throw error;

    return data.joinCode;
  }

  async getCaregivers(teamId: string): Promise<CaregiverInfo[]> {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
            caregiverId,
            role,
            dateAssigned,
            caregivers (firstName, lastName, phoneNumber, email, jobTitle)
        `,
      )
      .eq("careTeamId", teamId)
      .is("patientId", null);

    if (error) throw error;

    const formattedData: CaregiverInfo[] = (data || []).map((item) => ({
      ...(item.caregivers as any),
      caregiverId: item.caregiverId,
      teamRole: item.role,
      teamDateAssigned: item.dateAssigned,
    }));

    return formattedData;
  }

  async getPatients(teamId: string): Promise<PatientInfo[]> {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
            patients (patientId, firstName, lastName, dob, address, phoneNumber)
          `,
      )
      .eq("careTeamId", teamId)
      .is("caregiverId", null);

    if (error) throw error;

    const formattedData: PatientInfo[] = (data || [])
      .filter((item) => item.patients)
      .map((item) => ({
        ...(item.patients as unknown as PatientInfo),
      }));

    return formattedData;
  }

  async joinTeamWithCode(caregiverId: string, joinCode: string) {
    const { data: team, error: teamError } = await supabase
      .from("careTeams")
      .select("careTeamId")
      .eq("joinCode", joinCode)
      .single();

    if (teamError || !team) throw new Error("Invalid Join Code");

    const { data: existing } = await supabase
      .from("careTeamMembers")
      .select("membershipId")
      .eq("careTeamId", team.careTeamId)
      .eq("caregiverId", caregiverId)
      .maybeSingle();

    if (existing) throw new Error("You are already a member of this team");

    const { error: joinError } = await supabase.from("careTeamMembers").insert([
      {
        careTeamId: team.careTeamId,
        caregiverId: caregiverId,
        role: "caregiver",
        dateAssigned: new Date().toISOString(),
      },
    ]);

    if (joinError) throw joinError;

    return team.careTeamId;
  }

  async addPatientToTeam(
    teamId: string,
    patientData: {
      firstName: string;
      lastName: string;
      dob: string;
      address?: string;
      phoneNumber?: string;
    },
  ) {
    const { data, error } = await supabase.rpc("add_patient_to_team", {
      p_first_name: patientData.firstName,
      p_last_name: patientData.lastName,
      p_dob: patientData.dob,
      p_team_id: teamId,
      p_address: patientData.address || null,
      p_phone_number: patientData.phoneNumber || null,
    });

    if (error) throw error;
    return data;
  }
}
