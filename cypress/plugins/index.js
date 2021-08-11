/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const deepmerge = require("deepmerge");
const path = require("path");
const winston = require("winston");
require("winston-daily-rotate-file");

const transport = new winston.transports.DailyRotateFile({
  filename: "logs/cypress-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
});

winston.configure({ transports: [transport] });

function loadConfig(filename) {
  const configJson = require(filename);
  if (configJson.extends) {
    const baseConfigFilename = path.join(path.dirname(filename), configJson.extends);
    const baseConfig = loadConfig(baseConfigFilename);
    console.log("merging %s with %s", baseConfigFilename, filename);

    return deepmerge(baseConfig, configJson);
  } else {
    return configJson;
  }
}

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  return loadConfig(config.configFile);
};
