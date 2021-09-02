import { UserDisplayStats } from "../types";
import getTeamList from "./getTeamList";
import getLiveBracket from "./getLiveBracket";
import getUserBrackets from "./getUserBrackets";

export default async function getPickemStats(): Promise<null | UserDisplayStats[]> {
  const [teams, original_groups, pickems_users] = await Promise.all([
    getTeamList(),
    getLiveBracket(),
    getUserBrackets(),
  ]);

  if (!teams || !original_groups || !pickems_users) {
    return null;
  }

  const users_names = Object.keys(pickems_users);

  const stats_list: UserDisplayStats[] = [];

  for (let i = 0; i < users_names.length; i++) {
    const user_name = users_names[i];
    const pickem_groups = pickems_users[user_name];
    const user_stats = { user: user_name, points: 0 }; // initialize user stats object

    for (let j = 0; j < pickem_groups.length; j++) {
      const pickem_group = pickem_groups[j];
      const original_group = original_groups.find(function (group) {
        return group.group_id === pickem_group.group_id;
      });

      if (!original_group) {
        continue;
      }

      for (let k = 0; k < pickem_group.bracket_list.length; k++) {
        const pickem_match = pickem_group.bracket_list[k];
        const original_match = original_group.bracket_list.find(function (match) {
          return match.match_id === pickem_match.match_id;
        });

        if (!original_match) {
          continue;
        }

        if (pickem_match.winner === original_match.winner) {
          user_stats.points += original_match.max_points;
        }
      }
    }

    stats_list.push(user_stats);
  }

  stats_list.sort(function (a, b) {
    return b.points - a.points;
  });

  return stats_list;
}
