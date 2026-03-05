// services/patientService.ts
import { supabase } from "../lib/supabase";

export const patientService = {
  // Connected to TaskManager.tsx
  async getInitialContext(caregiverId: string) {
    // Get Team ID
    const { data: member } = await supabase
      .from("careTeamMembers")
      .select("careTeamId")
      .eq("caregiverId", caregiverId)
      .maybeSingle();

    if (!member) return null;

    // Get the first Patient ID linked to that team
    const { data: memberPatient } = await supabase
      .from("careTeamMembers")
      .select("patientId")
      .eq("careTeamId", member.careTeamId)
      .not("patientId", "is", null)
      .limit(1)
      .maybeSingle();

    return {
      careTeamId: member.careTeamId,
      patientId: memberPatient?.patientId || null,
    };
  },
};
