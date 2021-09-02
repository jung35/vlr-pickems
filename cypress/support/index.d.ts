/// <reference types="cypress" />
import { ValorantTeam, LiveBracketGroup } from "../../discord/types";

declare global {
  namespace Cypress {
    interface Chainable {
      saveTeams(teams: ValorantTeam[]): void;
      saveBracket<BracketType>(filename: string, bracket: LiveBracketGroup<BracketType>[]): void;
      clearPlayerBrackets(): void;
    }
  }
}
