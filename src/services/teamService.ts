// services/teamService.ts
import { supabase } from "../lib/supabase";

export const teamService = {
  // Fetching the join code for a team
  async getTeamJoinCode(teamId: string) {
    const { data, error } = await supabase
      .from("careTeams")
      .select("joinCode")
      .eq("careTeamId", teamId)
      .single();

    if (error) throw error;
    return data.joinCode;
  },

  // Fetch only Caregivers (where patientId is null)
  async getCaregivers(teamId: string) {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
        caregiverId,
        role,
        caregivers (firstName, lastName, email)
      `,
      )
      .eq("careTeamId", teamId)
      .is("patientId", null);

    if (error) throw error;

    return data;
  },

  // Fetch only Patients (using the 'Patient' role)
  async getPatients(teamId: string) {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
        patientId,
        patients (firstName, lastName, dob)
      `,
      )
      .eq("careTeamId", teamId)
      .eq("role", "Patient");

    if (error) throw error;

    return data;
  },

  // Fetch careTeamId for a selected patient
  async getCareTeamIdByPatient(patientId: string) {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select("careTeamId")
      .eq("patientId", patientId)
      .eq("role", "Patient")
      .single();

    if (error) throw error;
    return data.careTeamId;
  },

  // Allow a caregiver to join a team using a code
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
  },

  // Add a new patient to the team
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
  },
};