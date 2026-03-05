/**
 * useDashboardData.ts
 * Persistence layer, Data Repository, Data Access Object (DAO)
 */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New state

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch Team
        const { data: teamData, error: teamError } = await supabase
          .from("careTeamMembers")
          .select(`"careTeamId", "careTeams" ("teamName", "joinCode")`)
          .eq("caregiverId", user.id);

        if (teamError) throw teamError;

        const teamId = teamData[0]?.careTeamId;
        if (!teamId) throw new Error("No team found for this user.");

        // Fetch Patients for this team
        const { data: patients, error: patientError } = await supabase
          .from("patients")
          .select("*")
          // join query
          .filter("careTeamMembers.careTeamId", "eq", teamId);

        if (patientError) throw patientError;

        setData({ team: teamData[0], patients });
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  return { data, loading, error }; // Expose error to the UI
};
