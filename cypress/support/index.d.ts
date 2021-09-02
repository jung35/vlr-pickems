/// <reference types="cypress" />
import { ValorantTeam, UserPickemBracketInfo, LiveBracketGroup } from "../../discord/types";

declare global {
  namespace Cypress {
    interface Chainable {
      saveTeams(teams: ValorantTeam[]): void;
      saveBracket(filename: string, bracket: LiveBracketGroup[] | UserPickemBracketInfo[]): void;
      clearPlayerBrackets(): void;
    }
  }
}
