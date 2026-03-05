import { useEffect, useState } from "react";
import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import ModalForm from "../components/team/ModalForm";
import { mockService } from "../services/mockService";
import type { CaregiverInfo, PatientInfo } from "../types/Types";

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
        <CustomTitleBanner title="Care Team" />

        <CustomSection
          title="Team Members"
          subheader="Current caregivers on this team"
        >
          <button
            type="button"
            className="btn btn-outline-primary mb-3"
            data-bs-toggle="modal"
            data-bs-target="#addCaregiverModal"
          >
            Add Caregiver
          </button>

          <ModalForm
            modalId="addCaregiverModal"
            entityType="caregiver"
            onSubmitId={() => {}}
          />

          <TeamList members={teamData.caregivers} />
        </CustomSection>

        <CustomSection
          title="Patients"
          subheader="Patients currently being cared for"
        >
          <button
            type="button"
            className="btn btn-outline-primary mb-3"
            data-bs-toggle="modal"
            data-bs-target="#addPatientModal"
          >
            Add Patient
          </button>

          <ModalForm
            modalId="addPatientModal"
            entityType="patient"
            onSubmitId={() => {}}
          />

          <PatientList patients={teamData.patients} />
        </CustomSection>
      </div>
    </>
  );
};

export default Teams;
