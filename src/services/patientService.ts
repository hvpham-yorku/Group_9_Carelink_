import { supabase } from "../lib/supabase";
import type { PatientInfo } from "../types/Types";

export const patientService = {
  async getInitialContext(
    caregiverId: string,
    preferredTeamId?: string | null,
  ) {
    if (preferredTeamId) {
      const { data: pref } = await supabase
        .from("careTeamMembers")
        .select("careTeamId")
        .eq("caregiverId", caregiverId)
        .eq("careTeamId", preferredTeamId)
        .maybeSingle();

      if (pref) {
        const { data: patientLink } = await supabase
          .from("careTeamMembers")
          .select("patientId")
          .eq("careTeamId", preferredTeamId)
          .not("patientId", "is", null)
          .limit(1)
          .maybeSingle();

        return {
          careTeamId: preferredTeamId,
          patientId: patientLink?.patientId || null,
        };
      }
    }

    const { data: member, error: teamError } = await supabase
      .from("careTeamMembers")
      .select("careTeamId, dateAssigned")
      .eq("caregiverId", caregiverId)
      .order("dateAssigned", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (teamError) {
      console.error("Database error fetching team:", teamError);
      return { careTeamId: null, patientId: null };
    }

    if (!member) return { careTeamId: null, patientId: null };

    const { data: patientLink } = await supabase
      .from("careTeamMembers")
      .select("patientId")
      .eq("careTeamId", member.careTeamId)
      .not("patientId", "is", null)
      .limit(1)
      .maybeSingle();

    return {
      careTeamId: member.careTeamId,
      patientId: patientLink?.patientId || null,
    };
  },

  async getFullProfile(patientId: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patientId", patientId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(patientId: string, updates: Partial<PatientInfo>) {
    const { data, error } = await supabase
      .from("patients")
      .update(updates)
      .eq("patientId", patientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};