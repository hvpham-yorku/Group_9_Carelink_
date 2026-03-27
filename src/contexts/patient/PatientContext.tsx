import { createContext } from "react";

export interface Team {
  id: string;
  name: string;
}

export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
}

interface PatientContextType {
  teams: Team[];
  careTeamId: string | null;
  setCareTeamId: (id: string) => void;
  patients: Patient[];
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string) => void;
  loading: boolean;
}

export const PatientContext = createContext<PatientContextType | undefined>(
  undefined,
);
