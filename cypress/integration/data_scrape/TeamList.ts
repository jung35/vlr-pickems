/// <reference path="../../support/index.d.ts" />

import { ValorantTeam } from "../../../discord/types";

describe("Tourney Overview page", () => {
  it("Gets list of teams playing", () => {
    cy.visit(Cypress.env("main"));

    const teams: ValorantTeam[] = [];

    cy.get(".event-teams-container .event-team-name")
      .each((team_el) => {
        const team_name = team_el.text().trim();
        const team_id = team_el.attr("href")?.match(/\/(?<id>\d+)\//);
        const team_object = { id: team_id?.groups?.id || "", name: team_name };

        cy.log("TeamList", { team_object });
        teams.push(team_object);
      })
      .then(() => {
        cy.saveTeams(teams);
      });
  });
});
