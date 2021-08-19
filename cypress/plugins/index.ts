import deepmerge from "deepmerge";
import path from "path";

type ConfigOptions = Cypress.ConfigOptions & { extends: string };

function loadConfig(filename: string): ConfigOptions {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configJson: ConfigOptions = require(filename);
  if (configJson.extends) {
    const baseConfigFilename = path.join(path.dirname(filename), configJson.extends);
    const baseConfig = loadConfig(baseConfigFilename);
    console.log("merging %s with %s", baseConfigFilename, filename);

    return deepmerge(baseConfig, configJson);
  } else {
    return configJson;
  }
}

module.exports = ((on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  return loadConfig(config.configFile as string);
}) as Cypress.PluginConfig;
