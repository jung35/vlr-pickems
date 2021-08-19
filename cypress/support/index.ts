/* eslint-disable @typescript-eslint/no-namespace */
import savePath from "./savePath";

/// <reference types="cypress" />

const teams_file = "/teams.json";
const brackets_folder = "/bracket/";

Cypress.Commands.add("saveBracket", (filename, bracket) => {
  const save_path = savePath();

  cy.writeFile(save_path + brackets_folder + filename + ".json", bracket);
});

Cypress.Commands.add("saveTeams", (teams) => {
  const save_path = savePath();

  cy.writeFile(save_path + teams_file, teams);
});

Cypress.Commands.add("clearPlayerBrackets", () => {
  const save_path = savePath();

  cy.log(`Clearning player brackets folder ${save_path + brackets_folder}`);

  cy.exec(`rm -r ${save_path + brackets_folder}`);
});
