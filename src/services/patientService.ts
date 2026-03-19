// services/patientService.ts
import { supabase } from "../lib/supabase";

export const patientService = {
  // Connected to TaskManager.tsx
  // preferredTeamId: pass a stored value (e.g. from localStorage) to pin a
  // specific team. Membership is validated before use, so stale values are safe.
  async getInitialContext(
    caregiverId: string,
    preferredTeamId?: string | null,
  ) {
    // If a preferred team is provided, validate the user is still a member and use it.
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

    // Fallback: pick the most recently joined team using timestamptz ordering.
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

  // Fetch full profile details
  async getFullProfile(patientId: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patient_id", patientId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile fields
  async updateProfile(patientId: string, updates: any) {
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
