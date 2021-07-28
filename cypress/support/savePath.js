export default function savePath() {
  const config_location = Cypress.config().configFile;

  const output_dir = "./pickems_data/";
  const string_match = config_location.match(/config\/(?<save_path>.*)\.json$/);
  const config_dir = string_match.groups.save_path;

  return output_dir + config_dir;
}
