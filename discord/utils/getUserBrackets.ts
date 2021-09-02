import fs from "fs/promises";
import { getSettings } from "../settings";
import { LiveBracketGroup, UserPickemBracketInfo } from "../types";

export default async function getUserBrackets(): Promise<null | {
  [user: string]: LiveBracketGroup<UserPickemBracketInfo>[];
}> {
  const settings = await getSettings();
  const files_dir = settings.data_dir + settings.use + "/bracket";
  try {
    const files = await fs.readdir(files_dir);

    const pickems: { [key: string]: LiveBracketGroup<UserPickemBracketInfo>[] } = {};

    for (const file of files) {
      const user_match = file.match(/^(?<user>.*)\.json$/);
      const user = user_match?.groups?.user || "unknown";
      const raw_user_bracket = await fs.readFile(files_dir + "/" + file, "utf-8");
      pickems[user] = JSON.parse(raw_user_bracket) as LiveBracketGroup<UserPickemBracketInfo>[];
    }

    return pickems;
  } catch (error) {
    return null;
  }
}
