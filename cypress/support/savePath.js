export default function savePath() {
  const config_location = Cypress.config().configFile;

  const output_dir = "../pickems_data/";
  const config_dir = config_location.match(/^config\/(?<save_path>.*)\.json$/)
    .groups.save_path;

  return output_dir + config_dir;
}
