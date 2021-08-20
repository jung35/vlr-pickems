import fs from "fs/promises";
import { getSettings } from "../settings";
import { ValorantTeam } from "../types";

export default async function getTeams(): Promise<null | ValorantTeam[]> {
  const settings = await getSettings();

  try {
    const raw_teams = await fs.readFile(settings.data_dir + settings.use + "/teams.json", "utf-8");

    return JSON.parse(raw_teams) as ValorantTeam[];
  } catch (error) {
    return null;
  }
}
