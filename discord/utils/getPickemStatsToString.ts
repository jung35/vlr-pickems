import { UserDisplayStats } from "../types";

export default function getPickemStatsToString(stats_list: null | UserDisplayStats[]): string {
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
