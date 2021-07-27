import savePath from "./savePath";

const filename = "/teams.json";

Cypress.Commands.add("saveTeams", (teams) => {
  const save_path = savePath();

  cy.writeFile(save_path + filename, teams);
});
