import { StubTeamRepo } from "./repositories/teams/StubTeamRepo";
import { ApiTeamRepo } from "./repositories/teams/ApiTeamRepo";

// import.meta.env.VITE_STUB_MODE
const mode = import.meta.env.VITE_STUB_MODE;

export const repositories = {
  team: mode === "stub" ? new StubTeamRepo() : new ApiTeamRepo(),
};
