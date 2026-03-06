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

  // Fetch the everyone on the team (caregivers and patients)
  async getTeamMembers(teamId: string) {
    const { data, error } = await supabase
      .from("careTeamMembers")
      .select(
        `
        caregiverId,
        patientId,
        caregiverRole,
        caregivers (firstName, lastName, email),
        patients (firstName, lastName)
      `,
      )
      .eq("careTeamId", teamId);

    if (error) throw error;
    return data;
  },

  // Allow a caregiver to join a team using a code
  async joinTeamWithCode(caregiverId: string, joinCode: string) {
    // finding the team with the code
    const { data: team, error: teamError } = await supabase
      .from("careTeams")
      .select("careTeamId")
      .eq("joinCode", joinCode)
      .single();

    if (teamError || !team) throw new Error("Invalid Join Code");

    // Add the caregiver to the team
    const { error: joinError } = await supabase.from("careTeamMembers").insert([
      {
        careTeamId: team.careTeamId,
        caregiverId: caregiverId,
        caregiverRole: "Member",
      },
    ]);

    if (joinError) throw joinError;
    return team.careTeamId;
  },

  // Add a new patient to the team
  async addPatientToTeam(
    teamId: string,
    patientData: { firstName: string; lastName: string; dob: string },
  ) {
    // Create the patient record
    const { data: patient, error: pError } = await supabase
      .from("patients")
      .insert([patientData])
      .select()
      .single();

    if (pError) throw pError;

    // Link the patient to the team
    const { error: linkError } = await supabase.from("careTeamMembers").insert([
      {
        careTeamId: teamId,
        patientId: patient.patientId,
      },
    ]);

    if (linkError) throw linkError;
    return patient;
  },
};
