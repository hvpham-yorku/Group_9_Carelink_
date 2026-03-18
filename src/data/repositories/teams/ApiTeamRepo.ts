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
            caregiverId,
            role,
            dateAssigned,
            caregivers (firstName, lastName, phoneNumber, email, jobTitle)
        `,
      )
      .eq("careTeamId", teamId)
      .is("patientId", null)
      .eq("caregiverId", caregiverId);

    if (error) throw error;

    // const formattedData = data as unknown as CaregiverInfo[];
    const formattedData: CaregiverInfo[] = data.map((item) => ({
      caregiverId: item.caregiverId,
      firstName: item.caregivers[0].firstName,
      lastName: item.caregivers[0].lastName,
      phoneNumber: item.caregivers[0].phoneNumber,
      email: item.caregivers[0].email,
      jobTitle: item.caregivers[0].jobTitle,
      teamRole: item.role,
      teamDateAssigned: item.dateAssigned,
    }));

    return formattedData;
  }

  async getPatients(teamId: string, patientId: string): Promise<PatientInfo[]> {
    const { data, error } = await supabase
      .from("careTeamMembers")
      // add in blood_type when switching to new schema
      .select(
        `
            patientId,
            role,
            patients (firstName, lastName, gender)
          `,
      )
      .eq("careTeamId", teamId)
      .is("caregiverId", null)
      .eq("patientId", patientId);

    if (error) throw error;

    // const formattedData = data as unknown as PatientInfo[];
    const formattedData: PatientInfo[] = data.map((item) => ({
      patientId: item.patientId,
      firstName: item.patients[0].firstName,
      lastName: item.patients[0].lastName,
      gender: item.patients[0].gender,
      // bloodType: item.patients[0].bloodType,
      teamRole: item.role,
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
