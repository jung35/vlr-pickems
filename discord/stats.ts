import fs from "fs/promises";
import { getSettings } from "./settings";
import {
  LiveBracketInfo,
  UserDisplayStats,
  UserPickemBracketInfo,
  ValorantTeam,
} from "./types";

const data_dir = "pickems_data/";

export async function getStats(): Promise<null | UserDisplayStats[]> {
  const [teams, original, pickems] = await Promise.all([
    getTeams(),
    getOriginalBracket(),
    getUserBrackets(),
  ]);

  if (!teams || !original || !pickems) {
    return null;
  }

  const users = Object.keys(pickems);

  const stats_list: UserDisplayStats[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const pickem = pickems[user];
    const user_stats = { user, points: 0 }; // initialize user stats object

    for (let j = 0; j < pickem.length; j++) {
      const pickem_match = pickem[j];
      const original_match = original.find(function (match) {
        return match.id === pickem_match.id;
      });

      if (original_match && pickem_match.winner === original_match.winner) {
        user_stats.points += original_match.max_points;
      }
    }

    stats_list.push(user_stats);
  }

  stats_list.sort(function (a, b) {
    return b.points - a.points;
  });

  return stats_list;
}

async function getTeams(): Promise<null | ValorantTeam[]> {
  const settings = await getSettings();

  try {
    const raw_teams = await fs.readFile(
      data_dir + settings.use + "/teams.json",
      "utf-8"
    );

    return JSON.parse(raw_teams) as ValorantTeam[];
  } catch (error) {
    return null;
  }
}

async function getOriginalBracket(): Promise<null | LiveBracketInfo[]> {
  const settings = await getSettings();

  try {
    const raw_original_bracket = await fs.readFile(
      data_dir + settings.use + "/original.json",
      "utf-8"
    );

    return JSON.parse(raw_original_bracket) as LiveBracketInfo[];
  } catch (error) {
    return null;
  }
}

async function getUserBrackets(): Promise<null | {
  [user: string]: UserPickemBracketInfo[];
}> {
  const settings = await getSettings();
  const files_dir = data_dir + settings.use + "/bracket";
  try {
    const files = await fs.readdir(files_dir);

    const pickems: { [key: string]: UserPickemBracketInfo[] } = {};

    for (const file of files) {
      const user_match = file.match(/^(?<user>.*)\.json$/);
      const user = user_match?.groups?.user || "unknown";
      const raw_user_bracket = await fs.readFile(
        files_dir + "/" + file,
        "utf-8"
      );
      pickems[user] = JSON.parse(raw_user_bracket) as UserPickemBracketInfo[];
    }

    return pickems;
  } catch (error) {
    return null;
  }
}

export function statsToString(stats_list: null | UserDisplayStats[]): string {
  let output = "";

  if (stats_list) {
    for (let i = 0; i < stats_list.length; i++) {
      const stats = stats_list[i];

      if (i > 0) {
        output += "\n";
      }
      output += `**${stats.user}** - ${stats.points}pts`;
    }
  }

  return output.length > 0 ? output : "No stats";
}
