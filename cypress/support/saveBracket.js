import savePath from "./savePath";

const folder = "/bracket/";

Cypress.Commands.add("saveBracket", (filename, bracket) => {
  const save_path = savePath();

  cy.writeFile(save_path + folder + filename + ".json", bracket);
});
