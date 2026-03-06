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

  useEffect(() => {
    async function loadPatientData() {
      if (!user) return;
      try {
        setLoading(true);
        // Get Initial Context (Team and First Patient ID)
        const contextData = await patientService.getInitialContext(user.id);

        if (contextData) {
          setCareTeamId(contextData.careTeamId);
          setSelectedPatientId(contextData.patientId);

          // Fetch ALL patients for this team (for the switcher)
          const { data } = await supabase
            .from("careTeamMembers")
            .select(`patientId, patients(firstName, lastName)`)
            .eq("careTeamId", contextData.careTeamId)
            .not("patientId", "is", null);

          const formattedPatients =
            data?.map((item: any) => ({
              patientId: item.patientId,
              firstName: item.patients.firstName,
              lastName: item.patients.lastName,
            })) || [];

          setPatients(formattedPatients);
        }
      } catch (err) {
        console.error("Error loading patient context:", err);
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
