import { useEffect, useState } from "react";

// Services
import { repositories } from "../data/index";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";

// Types
import type { CaregiverInfo, PatientInfo } from "../types/teams";
import type { NewPatientFormData } from "../components/team/ModalForm";
import type { Category } from "../types/Types";

// Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import JoinTeamForm from "../components/team/JoinTeamForm";
import ModalForm from "../components/team/ModalForm";
import EditTeamNameForm from "../components/team/EditTeam";

const Teams = () => {
  const { user } = useAuth();
  const { teams, careTeamId, setCareTeamId } = usePatient();

  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [caregivers, setCaregivers] = useState<CaregiverInfo[]>([]);
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!careTeamId) return;
    let isActive = true;

    const loadTeamData = async () => {
      try {
        const [caregiverData, patientData, code, name, categoryData] =
          await Promise.all([
            repositories.team.getCaregivers(careTeamId),
            repositories.team.getPatients(careTeamId),
            repositories.team.getJoinCode(careTeamId),
            repositories.team.getName(careTeamId),
            repositories.team.getCategories(careTeamId),
          ]);

        if (!isActive) return;
        setTeamId(careTeamId);
        setCaregivers(caregiverData);
        setPatients(patientData);
        setJoinCode(code);
        setTeamName(name);
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load team data:", error);
      }
    };

    void loadTeamData();

    return () => {
      isActive = false;
    };
  }, [careTeamId]);

  const handleJoinTeam = async (code: string) => {
    if (!user) return;
    setJoinError(null);
    try {
      const newTeamId = await repositories.team.joinTeamWithCode(user.id, code);
      setCareTeamId(newTeamId);
      //window.location.reload();
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

  const handleAddCategory = async (name: string) => {
    if (!teamId) return;
    try {
      await repositories.team.addCategory(teamId, name);
      const categoryData = await repositories.team.getCategories(teamId);
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleUpdateTeamName = async (newName: string) => {
    if (!teamId) return;
    try {
      await repositories.team.updateTeamName(teamId, newName);
      setTeamName(newName);
    } catch (error) {
      console.error("Failed to update team name:", error);
    }
  };

  const handleUpdateRole = async (caregiverId: string, newRole: string) => {
    if (!teamId) return;
    try {
      await repositories.team.editCaregiverRole(teamId, caregiverId, newRole);
      setCaregivers((prev) =>
        prev.map((c) =>
          c.caregiverId === caregiverId ? { ...c, teamRole: newRole } : c,
        ),
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleRemoveCaregiver = async (caregiverId: string) => {
    if (!teamId) return;
    try {
      await repositories.team.removeCaregiver(teamId, caregiverId);
      setCaregivers((prev) =>
        prev.filter((c) => c.caregiverId !== caregiverId),
      );
    } catch (error) {
      console.error("Failed to remove caregiver:", error);
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
          <div className="col-md-6">
            <CustomSection
              title="Switch Teams"
              subheader="Switch to a different Team"
            >
              <select
                value={careTeamId || ""}
                onChange={(e) => setCareTeamId(e.target.value)}
                className="form-select"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </CustomSection>
          </div>

          <div className="col-md-6">
            <CustomSection
              title="Team Options"
              subheader="Add patients or join another team"
            >
              <div className="d-flex flex-column flex-sm-row gap-2">
                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#editTeamNameModal"
                >
                  Edit Team Details
                </button>

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

              <EditTeamNameForm
                key={teamName}
                modalId="editTeamNameModal"
                currentName={teamName}
                caregivers={caregivers}
                categories={categories}
                onUpdateName={handleUpdateTeamName}
                onUpdateRole={handleUpdateRole}
                onRemoveCaregiver={handleRemoveCaregiver}
                onAddCategory={handleAddCategory}
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
