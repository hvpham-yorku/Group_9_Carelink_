// services/patientService.ts
import { supabase } from "../lib/supabase";

export const patientService = {
  // Connected to TaskManager.tsx
  async getInitialContext(caregiverId: string) {
    // Get Team ID
    const { data: member, error: teamError } = await supabase
      .from("careTeamMembers")
      .select("careTeamId")
      .eq("caregiverId", caregiverId)
      .maybeSingle();

    if (teamError || !member) throw new Error("No team found for user");

    // Get the first Patient ID linked to that team
    const { data: patientLink, error: patientError } = await supabase
      .from("careTeamMembers")
      .select("patientId")
      .eq("careTeamId", member.careTeamId)
      .not("patientId", "is", null)
      .limit(1)
      .maybeSingle();

    if (patientError) throw patientError;

    return {
      careTeamId: member.careTeamId,
      patientId: patientLink?.patientId || null,
    };
  },
};
