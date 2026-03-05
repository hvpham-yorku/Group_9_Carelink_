import CustomTitleBanner from "../components/ui/CustomTitleBanner";
import CustomSection from "../components/ui/CustomSection";
import PatientList from "../components/team/PatientList";
import TeamList from "../components/team/TeamList";
import { teamMembers, teamPatients } from "../data/mockData";
import ModalForm from "../components/team/ModalForm";

const Teams = () => {
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

          <ModalForm modalId="addCaregiverModal" entityType="caregiver" />

          <TeamList members={teamMembers} />
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

          <ModalForm modalId="addPatientModal" entityType="patient" />

          <PatientList patients={teamPatients} />
        </CustomSection>
      </div>
    </>
  );
};

export default Teams;
