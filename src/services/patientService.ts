import { supabase } from "../lib/supabase";
import type { PatientInfo } from "../types/Types";

export const patientService = {
  async getInitialContext(
    caregiverId: string,
    preferredTeamId?: string | null,
  ) {
    if (preferredTeamId) {
      const { data: pref } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("caregiver_id", caregiverId)
        .eq("team_id", preferredTeamId)
        .maybeSingle();

      if (pref) {
        const { data: patientLink } = await supabase
          .from("team_members")
          .select("patient_id")
          .eq("team_id", preferredTeamId)
          .not("patient_id", "is", null)
          .limit(1)
          .maybeSingle();

        return {
          careTeamId: preferredTeamId,
          patientId: patientLink?.patient_id || null,
        };
      }
    }

    const { data: member, error: teamError } = await supabase
      .from("team_members")
      .select("team_id, date_assigned")
      .eq("caregiver_id", caregiverId)
      .order("date_assigned", { ascending: false }) // fixed bug here maybe, i hope...

      .limit(1)
      .maybeSingle();

    if (teamError) {
      console.error("Database error fetching team:", teamError);
      return { careTeamId: null, patientId: null };
    }

    if (!member) return { careTeamId: null, patientId: null };

    const { data: patientLink } = await supabase
      .from("team_members")
      .select("patient_id")
      .eq("team_id", member.team_id)
      .not("patient_id", "is", null)
      .limit(1)
      .maybeSingle();

    return {
      careTeamId: member.team_id,
      patientId: patientLink?.patient_id || null,
    };
  },

  async getFullProfile(patientId: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(patientId: string, updates: Partial<PatientInfo>) {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("patient_id", patientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
