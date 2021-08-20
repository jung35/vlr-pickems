import * as winston from "winston";
import cypress from "cypress";
import { getSettings } from "../settings";
import { CypressUpdateType, RunCypressOptions } from "../types";

type CypressBusyProcess = null | Promise<
  CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult
>;

// dont look below
let teams_promise: CypressBusyProcess = null;
let pickems_promise: CypressBusyProcess = null;
let points_promise: CypressBusyProcess = null;

// this is where you stop reading
export default async function runCypress(action: CypressUpdateType, options?: RunCypressOptions): Promise<void> {
  const settings = await getSettings();

  const cypress_config: Partial<CypressCommandLine.CypressRunOptions> = {
    configFile: `./config/${settings.use}.json`,
    quiet: true,
  };

  let result;

  if (action === "all") {
    if (teams_promise || pickems_promise || points_promise) {
      winston.info("Cypress already running");

      throw "already running";
    }

    cypress_config.spec = "./cypress/integration/data_scrape/*.ts";

    winston.info("Running Cypress");

    // yikes
    teams_promise = cypress.run(cypress_config);
    pickems_promise = teams_promise;
    points_promise = teams_promise;

    result = await teams_promise;

    teams_promise = null;
    pickems_promise = null;
    points_promise = null;
  } else if (action === "teams") {
    if (teams_promise) {
      winston.info("Cypress already running");

      throw "already running";
    }

    cypress_config.spec = "./cypress/integration/data_scrape/TeamList.ts";

    teams_promise = cypress.run(cypress_config);
    result = await teams_promise;
    teams_promise = null;
  } else if (action === "pickems") {
    if (pickems_promise) {
      winston.info("Cypress already running");

      throw "already running";
    }
    cypress_config.spec = "./cypress/integration/data_scrape/UserBrackets.ts";

    pickems_promise = cypress.run(cypress_config);
    result = await pickems_promise;
    pickems_promise = null;
  } else if (action === "points") {
    if (points_promise) {
      winston.info("Cypress already running");

      throw "already running";
    }
    cypress_config.spec = "./cypress/integration/data_scrape/LiveBracket.ts";

    points_promise = cypress.run(cypress_config);
    result = await points_promise;
    points_promise = null;
  } else if (action === "validate-pickem") {
    if (!options || !options.user_entered_url) {
      throw "need options";
    }

    cypress_config.spec = "./cypress/integration/validation/ValidateUserBracket.ts";
    cypress_config.env = { user_entered_url: options.user_entered_url };
    result = await cypress.run(cypress_config);
  }

  if (!result || ("failures" in result && result.failures > 0) || ("totalFailed" in result && result.totalFailed > 0)) {
    winston.info("Cypress Failed");

    throw null;
  }

  winston.info("Cypress Successful");
}
