/// <reference types="cypress" />
import { ValorantTeam, UserPickemBracketInfo } from "../../discord/types";

declare global {
  namespace Cypress {
    interface Chainable {
      saveTeams(teams: ValorantTeam[]): void;
      saveBracket(filename: string, bracket: UserPickemBracketInfo[]): void;
      clearPlayerBrackets(): void;
    }
  }
}
