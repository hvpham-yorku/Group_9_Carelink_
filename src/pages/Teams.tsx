import { useEffect, useState } from "react";
import { mockService } from "../services/mockService";
import type { CaregiverInfo, PatientInfo } from "../types/Types";

// Components
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import JoinTeamForm from "../components/team/JoinTeamForm";
import ModalForm from "../components/team/ModalForm";

const Teams = () => {
  const [teamData, setTeamData] = useState<{
    caregivers: CaregiverInfo[];
    patients: PatientInfo[];
  }>({
    caregivers: [],
    patients: [],
  });

  useEffect(() => {
    let isActive = true;

    const loadTeamData = async () => {
      const [caregiverData, patientData] = await Promise.all([
        mockService.getCaregivers(),
        mockService.getPatients(),
      ]);

      if (!isActive) {
        return;
      }

      // Single state update avoids back-to-back renders.
      setTeamData({ caregivers: caregiverData, patients: patientData });
    };

    void loadTeamData();

    return () => {
      isActive = false;
    };
  }, []);

  // const handleModalSubmit = (_id: string) => {};

  return (
    <>
      <div className="container">
        <CustomTitleBanner
          title="Care Team"
          subheader="Manage Your Team or Join One"
        />

        <div className="row mb-2">
          <div className="col-md-6">
            <CustomSection
              title="Join a Team"
              subheader="Enter a team code to join"
            >
              <JoinTeamForm
                onJoinTeam={(joinCode) =>
                  console.log("Joining team with code:", joinCode)
                }
              />
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
                onSubmit={(data) => console.log("New patient data:", data)}
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
              <TeamList members={teamData.caregivers} />
            </CustomSection>
          </div>

          <div className="col-md-6 mb-4">
            <CustomSection
              title="Patients"
              subheader="Patients currently being cared for"
            >
              <PatientList patients={teamData.patients} />
            </CustomSection>
          </div>
        </div>
      </div>
    </>
  );
};

export default Teams;
