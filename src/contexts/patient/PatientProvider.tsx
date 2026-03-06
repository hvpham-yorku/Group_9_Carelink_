import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { patientService } from "../../services/patientService";
import { supabase } from "../../lib/supabase";

import { PatientContext } from "./PatientContext";
import type { Patient } from "./PatientContext";

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [careTeamId, setCareTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const TEAM_KEY = "carelink_selectedTeamId";

  useEffect(() => {
    async function loadPatientData() {
      if (!user) {
        // Clear state and stored preference when user logs out
        localStorage.removeItem(TEAM_KEY);
        setCareTeamId(null);
        setSelectedPatientId(null);
        setPatients([]);
        return;
      }

      try {
        setLoading(true);
        // Pass any stored preference so the last-joined team is restored on refresh
        const storedTeamId = localStorage.getItem(TEAM_KEY);
        const contextData = await patientService.getInitialContext(
          user.id,
          storedTeamId,
        );

        // Check specifically if we have a team ID
        if (contextData?.careTeamId) {
          // Persist the resolved team so next refresh returns the same one
          localStorage.setItem(TEAM_KEY, contextData.careTeamId);
          setCareTeamId(contextData.careTeamId);
          setSelectedPatientId(contextData.patientId);

          // Fetch ALL patients for this team
          const { data, error: patientError } = await supabase
            .from("careTeamMembers")
            .select(`patientId, patients(firstName, lastName)`)
            .eq("careTeamId", contextData.careTeamId)
            .not("patientId", "is", null);

          if (patientError) throw patientError;

          const formattedPatients =
            data?.map((item: any) => ({
              patientId: item.patientId,
              firstName: item.patients.firstName,
              lastName: item.patients.lastName,
            })) || [];

          setPatients(formattedPatients);
        } else {
          // IMPORTANT: Reset state for users with no team (like your new test account)
          localStorage.removeItem(TEAM_KEY);
          setCareTeamId(null);
          setSelectedPatientId(null);
          setPatients([]);
        }
      } catch (err) {
        console.error("Error loading patient context:", err);
        // Reset state on error to avoid "stuck" UI
        localStorage.removeItem(TEAM_KEY);
        setCareTeamId(null);
        setSelectedPatientId(null);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }
    loadPatientData();
  }, [user]);

  return (
    <PatientContext.Provider
      value={{
        selectedPatientId,
        setSelectedPatientId,
        patients,
        careTeamId,
        loading,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
