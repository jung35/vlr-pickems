export default function savePath(): string {
  const config_location = Cypress.config().configFile;

  const output_dir = "./pickems_data/";
  const string_match = config_location.match(/config\/(?<save_path>.*)\.json$/);
  const config_dir = string_match?.groups?.save_path || "";

  cy.log(`Saving path: ${output_dir + config_dir}`);

  return output_dir + config_dir;
}
