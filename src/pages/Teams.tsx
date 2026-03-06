import { useEffect, useState } from "react";

// Services
import { teamService } from "../services/teamService";
import { patientService } from "../services/patientService";
import { useAuth } from "../hooks/useAuth";

// Types
import type { CaregiverInfo, PatientInfo } from "../types/Types";
import type { NewPatientFormData } from "../components/team/ModalForm";

// Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import JoinTeamForm from "../components/team/JoinTeamForm";
import ModalForm from "../components/team/ModalForm";

const Teams = () => {
  const { user } = useAuth();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<CaregiverInfo[]>([]);
  const [patients, setPatients] = useState<PatientInfo[]>([]);

  // map raw Supabase
  const mapCaregivers = (rows: any[]): CaregiverInfo[] =>
    rows.map((row) => ({
      caregiverId: row.caregiverId as string,
      firstName: (row.caregivers?.firstName as string) ?? "",
      lastName: (row.caregivers?.lastName as string) ?? "",
      email: (row.caregivers?.email as string) ?? "",
      phone: (row.caregivers?.phone as string) ?? "",
      jobTitle: (row.caregivers?.jobTitle as string) ?? "",
      role: (row.role as string) ?? "",
      dateAssigned: (row.dateAssigned as string) ?? "",
    }));

  // map raw Supabase join rows to flat PatientInfo[]
  const mapPatients = (rows: any[]): PatientInfo[] =>
    rows.map((row) => ({
      patientId: row.patientId as string,
      firstName: (row.patients?.firstName as string) ?? "",
      lastName: (row.patients?.lastName as string) ?? "",
      dob: (row.patients?.dob as string) ?? "",
      address: "",
      phone: "",
    }));

  useEffect(() => {
    if (!user) return;

    let isActive = true;

    const TEAM_KEY = "carelink_selectedTeamId";

    const loadTeamData = async () => {
      try {
        const storedTeamId = localStorage.getItem(TEAM_KEY);
        const context = await patientService.getInitialContext(
          user.id,
          storedTeamId,
        );
        if (!isActive) return;

        setTeamId(context?.careTeamId ?? null);

        if (!context?.careTeamId) return;

        const [caregiverRows, patientRows, code] = await Promise.all([
          teamService.getCaregivers(context.careTeamId),
          teamService.getPatients(context.careTeamId),
          teamService.getTeamJoinCode(context.careTeamId),
        ]);

        if (!isActive) return;
        setCaregivers(mapCaregivers(caregiverRows));
        setPatients(mapPatients(patientRows));
        setJoinCode(code);
      } catch (error) {
        console.error("Failed to load team data:", error);
      }
    };

    void loadTeamData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleJoinTeam = async (joinCode: string) => {
    if (!user) return;
    try {
      const newTeamId = await teamService.joinTeamWithCode(user.id, joinCode);
      // Persist so this team is restored on the next page refresh
      localStorage.setItem("carelink_selectedTeamId", newTeamId);
      window.location.reload();
    } catch (error) {
      console.error("Failed to join team:", error);
    }
  };

  const handleAddPatient = async (data: NewPatientFormData) => {
    if (!teamId) return;
    try {
      await teamService.addPatientToTeam(teamId, {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
      });
      const patientRows = await teamService.getPatients(teamId);
      setPatients(mapPatients(patientRows));
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  return (
    <>
      <div className="container">
        <CustomTitleBanner
          title="Care Team"
          subheader="Manage Your Team or Join One"
        >
          {joinCode && (
            <div className="text-end">
              <span className="text-muted small">Team Code</span>
              <p className="fw-bold mb-0 fs-5">{joinCode}</p>
            </div>
          )}
        </CustomTitleBanner>

        <CustomSection
          title="Join for full Project Demo"
          subheader="Code: 5BE3CB"
        />

        <div className="row mb-2">
          <div className="col-md-6">
            <CustomSection
              title="Join a Team"
              subheader="Enter a team code to join"
            >
              <JoinTeamForm onJoinTeam={handleJoinTeam} />
            </CustomSection>
          </div>

          <div className="col-md-6">
            <CustomSection
              title="Add a Patient to Your Team"
              subheader="Create a new Patient and add them to your team"
            >
              <button
                className="btn btn-success mb-2"
                data-bs-toggle="modal"
                data-bs-target="#addPatientModal"
              >
                Add Patient
              </button>

              <ModalForm
                modalId="addPatientModal"
                onSubmit={handleAddPatient}
              />
            </CustomSection>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <CustomSection
              title="Team Members"
              subheader="Current caregivers on this team"
            >
              <TeamList caregivers={caregivers} />
            </CustomSection>
          </div>

          <div className="col-md-6 mb-4">
            <CustomSection
              title="Patients"
              subheader="Patients currently being cared for"
            >
              <PatientList patients={patients} />
            </CustomSection>
          </div>
        </div>
      </div>
    </>
  );
};

export default Teams;
