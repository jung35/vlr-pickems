import fs from "fs/promises";
import { getSettings } from "../settings";
import { LiveBracketInfo } from "../types";

export default async function getLiveBracket(): Promise<null | LiveBracketInfo[]> {
  const settings = await getSettings();

  try {
    const raw_original_bracket = await fs.readFile(settings.data_dir + settings.use + "/original.json", "utf-8");

    return JSON.parse(raw_original_bracket) as LiveBracketInfo[];
  } catch (error) {
    return null;
  }
}
