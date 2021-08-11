import { getSettings } from "./settings";
import cypress from "cypress";
import * as winston from "winston";

export async function runCypress(): Promise<void> {
  const settings = await getSettings();
  winston.info("Running Cypress");
  const result = await cypress.run({ configFile: `./config/${settings.use}.json`, quiet: true });

  if ("failures" in result) {
    winston.info("Cypress Failed");

    throw null;
  }

  winston.info("Cypress Successful");
}
