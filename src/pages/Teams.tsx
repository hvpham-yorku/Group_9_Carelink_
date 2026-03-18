import { useEffect, useState } from "react";

// Services
import { repositories } from "../data/index";
import { careTeams } from "../data/data";
import { patientService } from "../services/patientService";
import { useAuth } from "../hooks/useAuth";

// Types
import type { CaregiverInfo, PatientInfo } from "../types/teams";
import type { NewPatientFormData } from "../components/team/ModalForm";

// Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import JoinTeamForm from "../components/team/JoinTeamForm";
import ModalForm from "../components/team/ModalForm";
import StatCard from "../components/ui/StatCard";
import { Users, UsersRound } from "lucide-react";

const TEAM_KEY = "carelink_selectedTeamId";
const STUB_MODE = import.meta.env.VITE_STUB_MODE === "stub";

const Teams = () => {
  const { user } = useAuth();

  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<CaregiverInfo[]>([]);
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let isActive = true;

    const loadTeamData = async () => {
      try {
        let resolvedTeamId: string | null;

        if (STUB_MODE) {
          resolvedTeamId = careTeams[0]?.careTeamId ?? null;
        } else {
          const storedTeamId = localStorage.getItem(TEAM_KEY);
          const context = await patientService.getInitialContext(
            user.id,
            storedTeamId,
          );
          if (!isActive) return;
          resolvedTeamId = context?.careTeamId ?? null;
        }

        if (!isActive) return;
        setTeamId(resolvedTeamId);
        if (!resolvedTeamId) return;

        const [caregiverData, patientData, code, name] = await Promise.all([
          repositories.team.getCaregivers(resolvedTeamId),
          repositories.team.getPatients(resolvedTeamId),
          repositories.team.getJoinCode(resolvedTeamId),
          repositories.team.getName(resolvedTeamId),
        ]);

        if (!isActive) return;
        setCaregivers(caregiverData);
        setPatients(patientData);
        setJoinCode(code);
        setTeamName(name);
      } catch (error) {
        console.error("Failed to load team data:", error);
      }
    };

    void loadTeamData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const handleJoinTeam = async (code: string) => {
    if (!user) return;
    setJoinError(null);
    try {
      const newTeamId = await repositories.team.joinTeamWithCode(user.id, code);
      localStorage.setItem(TEAM_KEY, newTeamId);
      window.location.reload();
    } catch (error: unknown) {
      setJoinError((error as Error)?.message ?? "Failed to join team");
    }
  };

  const handleAddPatient = async (data: NewPatientFormData) => {
    if (!teamId) return;
    try {
      await repositories.team.addPatientToTeam(teamId, data);
      const patientData = await repositories.team.getPatients(teamId);
      setPatients(patientData);
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  return (
    <>
      <div className="container">
        <CustomTitleBanner
          title={teamName ?? "Care Team"}
          subheader="Manage Your Team or Join One"
        >
          {joinCode && (
            <div className="text-end">
              <span className="text-muted small">Team Code</span>
              <p className="fw-bold mb-0 fs-5">{joinCode}</p>
            </div>
          )}
        </CustomTitleBanner>

        <CustomTitleBanner
          title="Join for Full Project Demo"
          subheader="Code: 5BE3CB"
        />

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-xl-4">
            <StatCard
              title="Team Members"
              value={caregivers.length}
              description="Number of caregivers on this team"
              icon={<Users className="fs-3 text-primary" />}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-4">
            <StatCard
              title="Patients"
              value={patients.length}
              description="Number of patients on this team"
              icon={<UsersRound className="fs-3 text-primary" />}
            />
          </div>

          <div className="col-12 col-md-12 col-xl-4">
            <CustomSection
              title="Team Options"
              subheader="Add patients or join another team"
            >
              <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#addPatientModal"
                >
                  Add Patient
                </button>

                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#joinTeamModal"
                >
                  Join a Team
                </button>
              </div>

              <ModalForm
                modalId="addPatientModal"
                onSubmit={handleAddPatient}
              />

              <JoinTeamForm
                modalId="joinTeamModal"
                onJoinTeam={handleJoinTeam}
                error={joinError}
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
