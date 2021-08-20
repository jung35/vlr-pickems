import fs from "fs/promises";
import { getSettings } from "../settings";
import { UserPickemBracketInfo } from "../types";

export default async function getUserBrackets(): Promise<null | { [user: string]: UserPickemBracketInfo[] }> {
  const settings = await getSettings();
  const files_dir = settings.data_dir + settings.use + "/bracket";
  try {
    const files = await fs.readdir(files_dir);

    const pickems: { [key: string]: UserPickemBracketInfo[] } = {};

    for (const file of files) {
      const user_match = file.match(/^(?<user>.*)\.json$/);
      const user = user_match?.groups?.user || "unknown";
      const raw_user_bracket = await fs.readFile(files_dir + "/" + file, "utf-8");
      pickems[user] = JSON.parse(raw_user_bracket) as UserPickemBracketInfo[];
    }

    return pickems;
  } catch (error) {
    return null;
  }
}
