import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  ShieldCheck,
  Hash,
  UserPlus,
  LogIn,
  Settings,
} from "lucide-react";

// Services
import { repositories } from "../data/index";
import { useAuth } from "../hooks/useAuth";
import { usePatient } from "../contexts/patient/usePatient";

// Types
import type { CaregiverInfo, PatientInfo, Category } from "../types/teams";
import type { NewPatientFormData } from "../components/team/ModalForm";

// Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import StatCard from "../components/ui/StatCard";
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

  const loadTeamData = async (id: string) => {
    try {
      const [caregiverData, patientData, code, name, categoryData] =
        await Promise.all([
          repositories.team.getCaregivers(id),
          repositories.team.getPatients(id),
          repositories.team.getJoinCode(id),
          repositories.team.getName(id),
          repositories.team.getCategories(id),
        ]);

      setTeamId(id);
      setCaregivers(caregiverData);
      setPatients(patientData);
      setJoinCode(code);
      setTeamName(name);
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to load team data:", error);
    }
  };

  useEffect(() => {
    if (!careTeamId) return;
    let isActive = true;

    const run = async () => {
      await loadTeamData(careTeamId);
      if (!isActive) return;
    };

    void run();

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
      await loadTeamData(newTeamId);
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

  const handleAddCategory = async (name: string, color: string) => {
    if (!teamId) return;
    try {
      await repositories.team.addCategory(teamId, name, color);
      const categoryData = await repositories.team.getCategories(teamId);
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const currentUserRole = user
    ? (caregivers.find((c) => c.caregiverId === user.id)?.teamRole ?? null)
    : null;

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
    <div className="container">
      {/* Header */}
      <CustomTitleBanner
        title={teamName ?? "Care Team"}
        subheader="Manage your care team members and patients"
      >
        {joinCode && (
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            style={{ background: "#f1f3f5", border: "1px solid #e9ecef" }}
          >
            <Hash size={16} className="text-muted" />
            <span className="text-muted small fw-semibold">Team Code:</span>
            <span className="fw-bold">{joinCode}</span>
          </div>
        )}
      </CustomTitleBanner>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Team Members"
            value={caregivers.length}
            description="Active caregivers on this team"
            icon={<Users size={20} color="#0d6efd" />}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Patients"
            value={patients.length}
            description="Patients currently being cared for"
            icon={<UserRound size={20} color="#198754" />}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3 stat-card-sm">
          <StatCard
            title="Your Role"
            value={currentUserRole ?? "—"}
            description="Your role on this team"
            icon={<ShieldCheck size={20} color="#6f42c1" />}
          />
        </div>

        <div className="col-12 col-md-6 col-xl-3">
          <StatCard
            title="Project Demo Code"
            value={"6FB688"}
            description="Share to invite caregivers"
            icon={<Hash size={20} color="#fd7e14" />}
          />
        </div>
      </div>

      {/* Switch Teams & Team Options */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <CustomSection
            title="Switch Teams"
            subheader="Switch to a different team"
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
            <div className="d-flex flex-wrap gap-2">
              {currentUserRole === "Primary Caregiver" && (
                <button
                  className="btn btn-outline-secondary d-inline-flex align-items-center gap-2"
                  data-bs-toggle="modal"
                  data-bs-target="#editTeamNameModal"
                >
                  <Settings size={16} />
                  Edit Team Details
                </button>
              )}

              <button
                className="btn btn-primary d-inline-flex align-items-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#addPatientModal"
              >
                <UserPlus size={16} />
                Add Patient
              </button>

              <button
                className="btn btn-outline-primary d-inline-flex align-items-center gap-2"
                data-bs-toggle="modal"
                data-bs-target="#joinTeamModal"
              >
                <LogIn size={16} />
                Join a Team
              </button>
            </div>

            {/* Hidden modals */}
            <ModalForm modalId="addPatientModal" onSubmit={handleAddPatient} />
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

      {/* Team Members & Patients */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <CustomSection
            title="Team Members"
            subheader="Current caregivers on this team"
          >
            <TeamList caregivers={caregivers} />
          </CustomSection>
        </div>

        <div className="col-md-6">
          <CustomSection
            title="Patients"
            subheader="Patients currently being cared for"
          >
            <PatientList patients={patients} />
          </CustomSection>
        </div>
      </div>
    </div>
  );
};

export default Teams;
