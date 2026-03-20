import type { TeamRepo, NewPatientData } from "./TeamRepo";
import type {
  CaregiverInfo,
  PatientInfo,
  Category,
} from "../../../types/teams";

import { supabase } from "../../../lib/supabase";
import { formatToDateTimeLocal } from "../../../utils/formatters";

export class ApiTeamRepo implements TeamRepo {
  async getName(teamId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("teams")
      .select("team_name")
      .eq("team_id", teamId)
      .single();

    if (error) throw error;

    return data.team_name;
  }

  async getJoinCode(teamId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("teams")
      .select("join_code")
      .eq("team_id", teamId)
      .single();

    if (error) throw error;

    return data.join_code;
  }

  async getCaregivers(teamId: string): Promise<CaregiverInfo[]> {
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
        caregiver_id,
        role,
        date_assigned,
        caregivers (first_name, last_name, email, job_title)
    `,
      )
      .eq("team_id", teamId)
      .is("patient_id", null);

    if (error) throw error;

    const formattedData: CaregiverInfo[] = (data || []).map((item) => {
      const cg = item.caregivers as any;
      return {
        caregiverId: item.caregiver_id!,
        firstName: cg.first_name,
        lastName: cg.last_name,

        email: cg.email,
        jobTitle: cg.job_title,
        teamRole: item.role,
        teamDateAssigned: formatToDateTimeLocal(item.date_assigned),
      };
    });

    return formattedData;
  }

  async getPatients(teamId: string): Promise<PatientInfo[]> {
    const { data, error } = await supabase
      .from("team_members")
      .select(
        `
            patient_id,
            patients (patient_id, first_name, last_name, dob, gender)
          `,
      )
      .eq("team_id", teamId)
      .not("patient_id", "is", null);

    if (error) throw error;

    const formattedData: PatientInfo[] = (data || [])
      .filter((item) => item.patients)
      .map((item) => {
        const p = item.patients as any;
        return {
          patientId: p.patient_id,
          firstName: p.first_name,
          lastName: p.last_name,
          dob: p.dob,
          gender: p.gender,
        };
      });

    return formattedData;
  }

  async getCategories(teamId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("category_id, name")
      .eq("team_id", teamId)
      .order("name", { ascending: true });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      categoryId: row.category_id,
      name: row.name,
    }));
  }

  async joinTeamWithCode(
    caregiverId: string,
    joinCode: string,
  ): Promise<string> {
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("team_id")
      .eq("join_code", joinCode)
      .single();

    if (teamError || !team) throw new Error("Invalid Join Code");

    const { data: existing } = await supabase
      .from("team_members")
      .select("member_id")
      .eq("team_id", team.team_id)
      .eq("caregiver_id", caregiverId)
      .maybeSingle();

    if (existing) throw new Error("You are already a member of this team");

    const { error: joinError } = await supabase.from("team_members").insert([
      {
        team_id: team.team_id,
        caregiver_id: caregiverId,
        role: "caregiver",
        date_assigned: new Date().toISOString(),
      },
    ]);

    if (joinError) throw joinError;

    return team.team_id;
  }

  /*
   * Team Editing Methods ------------------------------------------------
   */

  async addPatientToTeam(
    teamId: string,
    patientData: NewPatientData,
  ): Promise<unknown> {
    const { data, error } = await supabase.rpc("add_patient_to_team", {
      p_first_name: patientData.firstName,
      p_last_name: patientData.lastName,
      p_dob: patientData.dob,
      p_gender: patientData.gender, // Add this line
      p_team_id: teamId,
    });

    if (error) throw error;
    return data;
  }

  async updateTeamName(teamId: string, newName: string): Promise<void> {
    const { error } = await supabase
      .from("teams")
      .update({ team_name: newName })
      .eq("team_id", teamId);

    if (error) throw error;
  }

  async addCategory(teamId: string, categoryName: string): Promise<void> {
    const { error } = await supabase
      .from("categories")
      .insert({ team_id: teamId, name: categoryName, color: "#000000" });

    if (error) throw error;
  }

  async editCaregiverRole(
    teamId: string,
    caregiverId: string,
    newRole: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("team_members")
      .update({ role: newRole })
      .eq("team_id", teamId)
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }

  async removeCaregiver(teamId: string, caregiverId: string): Promise<void> {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", teamId)
      .eq("caregiver_id", caregiverId);

    if (error) throw error;
  }
}
