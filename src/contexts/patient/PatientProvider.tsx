import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { careTeams } from "../../data/data";
import { repositories } from "../../data/index";

import { PatientContext } from "./PatientContext";
import type { Patient, Team } from "./PatientContext";

const STUB_MODE = import.meta.env.VITE_STUB_MODE === "stub";

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [careTeamId, setCareTeamId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const initialTeamSet = useRef(false);

  useEffect(() => {
    if (STUB_MODE) {
      const stubTeams: Team[] = careTeams.map((t) => ({
        id: t.careTeamId,
        name: t.teamName,
      }));
      setTeams(stubTeams);
      if (stubTeams.length > 0 && !initialTeamSet.current) {
        initialTeamSet.current = true;
        setCareTeamId(stubTeams[0].id);
      }
      setLoading(false);
      return;
    }

    async function loadTeams() {
      if (!user) return;

      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("team_members")
          .select(`team_id, teams(team_name)`)
          .eq("caregiver_id", user.id)
          .order("date_assigned", { ascending: false });

        if (error) throw error;

        const formattedTeams: Team[] = data.map((item: any) => ({
          id: item.team_id,
          name: item.teams.team_name,
        }));

        setTeams(formattedTeams);

        if (formattedTeams.length > 0 && !initialTeamSet.current) {
          initialTeamSet.current = true;
          setCareTeamId(formattedTeams[0].id);
        }
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [user]);

  useEffect(() => {
    if (!careTeamId) {
      setPatients([]);
      setSelectedPatientId(null);
      return;
    }

    let isActive = true;

    repositories.team
      .getPatients(careTeamId)
      .then((patientData) => {
        if (!isActive) return;
        const mapped: Patient[] = patientData.map((p) => ({
          patientId: p.patientId,
          firstName: p.firstName,
          lastName: p.lastName,
        }));
        setPatients(mapped);
        setSelectedPatientId(mapped.length > 0 ? mapped[0].patientId : null);
      })
      .catch((err) => {
        console.error("Error loading patients:", err);
      });

    return () => {
      isActive = false;
    };
  }, [careTeamId]);

  return (
    <PatientContext.Provider
      value={{
        teams,
        careTeamId,
        setCareTeamId,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        loading,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
