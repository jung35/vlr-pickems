import getBracket from "../support/getBracket";
import * as winston from "winston";

describe("Tourney Overview page", () => {
  it("Gets list of teams playing", () => {
    cy.visit(Cypress.env("main"));

    const teams = [];

    cy.get(".event-teams-container .event-team-name")
      .each((team_el, i) => {
        const team_name = team_el.text().trim();
        const team_id = team_el.attr("href").match(/\/(?<id>\d+)\//);
        const team_object = { id: team_id.groups.id, name: team_name };

        winston.info("getTeams", { team_object });
        teams.push(team_object);
      })
      .then(() => {
        cy.saveTeams(teams);
      });
  });

  it("It gets original match-ups", () => {
    cy.visit(Cypress.env("pickem_url"));

    const bracket = [];

    cy.get(".bracket-item.mod-pickem")
      .each((match_el, i) => {
        const match_object = getBracket(match_el, "original");

        winston.info(`getTeams Match #${i} ${match_object.teams}`);
        winston.info(`getTeams id ${match_object.id}, ${match_object.next}`);
        winston.info(`getTeams Winner ${match_object.winner}`);

        bracket.push(match_object);
      })
      .then(() => {
        cy.saveBracket("../original", bracket);
      });
  });
});
