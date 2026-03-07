import { createContext } from "react";

export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
}

interface PatientContextType {
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string) => void;
  patients: Patient[];
  careTeamId: string | null;
  loading: boolean;
}

export const PatientContext = createContext<PatientContextType | undefined>(
  undefined,
);
