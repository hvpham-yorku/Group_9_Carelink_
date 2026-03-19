import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { careTeams } from "../../data/data";

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

  useEffect(() => {
    if (STUB_MODE) {
      const stubTeams: Team[] = careTeams.map((t) => ({
        id: t.careTeamId,
        name: t.teamName,
      }));
      setTeams(stubTeams);
      if (stubTeams.length > 0 && !careTeamId) {
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
          .from("careTeamMembers")
          .select(`careTeamId, careTeams(teamName)`)
          .eq("caregiverId", user.id)
          .order("dateAssigned", { ascending: false });

        if (error) throw error;

        const formattedTeams: Team[] = data.map((item: any) => ({
          id: item.careTeamId,
          name: item.careTeams.teamName,
        }));

        setTeams(formattedTeams);

        if (formattedTeams.length > 0 && !careTeamId) {
          setCareTeamId(formattedTeams[0].id);
        }
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [careTeamId, user]);

  useEffect(() => {
    if (STUB_MODE) {
      const stubTeam = careTeams.find((t) => t.careTeamId === careTeamId);
      const stubPatients: Patient[] = (stubTeam?.patients ?? []).map((p) => ({
        patientId: p.patientId,
        firstName: p.firstName,
        lastName: p.lastName,
      }));
      setPatients(stubPatients);
      setSelectedPatientId(
        stubPatients.length > 0 ? stubPatients[0].patientId : null,
      );
      return;
    }

    async function updatePatients() {
      if (!careTeamId) {
        setPatients([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("careTeamMembers")
          .select(`patientId, patients(firstName, lastName)`)
          .eq("careTeamId", careTeamId)
          .is("caregiverId", null);

        if (error) throw error;

        const formattedPatients: Patient[] = (data ?? [])
          .filter((item: any) => item.patients)
          .map((item: any) => ({
            patientId: item.patientId,
            firstName: item.patients.firstName,
            lastName: item.patients.lastName,
          }));

        setPatients(formattedPatients);

        setSelectedPatientId(
          formattedPatients.length > 0 ? formattedPatients[0].patientId : null,
        );
      } catch (error) {
        console.error("Error loading patients:", error);
      }
    }

    updatePatients();
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
