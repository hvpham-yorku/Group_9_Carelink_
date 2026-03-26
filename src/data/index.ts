import { StubTeamRepo } from "./repositories/teams/StubTeamRepo";
import { ApiTeamRepo } from "./repositories/teams/ApiTeamRepo";
import { ApiTaskRepo } from "./repositories/tasks/ApiTaskRepo";
import { StubTaskRepo } from "./repositories/tasks/StubTaskRepo";
import { StubPatientRepo } from "./repositories/patients/StubPatientRepo";
import { ApiPatientRepo } from "./repositories/patients/ApiPatientRepo";
import { ApiNoteRepo } from "./repositories/notes/ApiNoteRepo";
import { StubNoteRepo } from "./repositories/notes/StubNoteRepo";
import { ApiMedRepo } from "./repositories/medications/ApiMedRepo";
import { StubMedRepo } from "./repositories/medications/StubMedRepo";

// import.meta.env.VITE_STUB_MODE
const mode = import.meta.env.VITE_STUB_MODE;

export const repositories = {
  team: mode === "stub" ? new StubTeamRepo() : new ApiTeamRepo(),
  task: mode === "stub" ? new StubTaskRepo() : new ApiTaskRepo(),
  patient: mode === "stub" ? new StubPatientRepo() : new ApiPatientRepo(),
  note: mode === "stub" ? new StubNoteRepo() : new ApiNoteRepo(),
  medication: mode === "stub" ? new StubMedRepo() : new ApiMedRepo(),
};
