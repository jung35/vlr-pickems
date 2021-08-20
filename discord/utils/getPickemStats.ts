import { UserDisplayStats } from "../types";
import getTeamList from "./getTeamList";
import getLiveBracket from "./getLiveBracket";
import getUserBrackets from "./getUserBrackets";

export default async function getPickemStats(): Promise<null | UserDisplayStats[]> {
  const [teams, original, pickems] = await Promise.all([getTeamList(), getLiveBracket(), getUserBrackets()]);

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
