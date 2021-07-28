import { getSettings } from "./settings";
import cypress from "cypress";

export async function runCypress(): Promise<void> {
  const settings = await getSettings();

  const result = await cypress.run({ configFile: `./config/${settings.use}.json`, quiet: true });

  if ("failures" in result) {
    throw null;
  }
}
