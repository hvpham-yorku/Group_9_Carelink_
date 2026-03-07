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

    // Fallback: pick the most recently joined team using timestamptz ordering.
    const { data: member, error: teamError } = await supabase
      .from("careTeamMembers")
      .select("careTeamId, dateAssigned")
      .eq("caregiverId", caregiverId)
      .order("dateAssigned", { ascending: false }) // fixed bug here maybe, i hope...
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

  // Fetch full profile details
  async getFullProfile(patientId: string) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("patientId", patientId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile fields
  async updateProfile(patientId: string, updates: JSON) {
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
