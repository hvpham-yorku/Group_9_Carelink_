import { StubTeamRepo } from "./repositories/teams/StubTeamRepo";
import { ApiTeamRepo } from "./repositories/teams/ApiTeamRepo";
import { ApiTaskRepo } from "./repositories/tasks/ApiTaskRepo";
import { StubTaskRepo } from "./repositories/tasks/StubTaskRepo";

// import.meta.env.VITE_STUB_MODE
const mode = import.meta.env.VITE_STUB_MODE;

export const repositories = {
  team: mode === "stub" ? new StubTeamRepo() : new ApiTeamRepo(),
  task: mode === "stub" ? new StubTaskRepo() : new ApiTaskRepo(),
};
