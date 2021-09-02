import { LiveBracketInfo, UserPickemBracketInfo } from "../../discord/types";

export default function getBracket(
  match_el: JQuery<HTMLElement>,
  style: "pickem" | "original" = "pickem"
): UserPickemBracketInfo | LiveBracketInfo {
  const selected = style === "pickem" ? "mod-selected" : "mod-winner";

  const id: string = match_el.data("currId");
  const next_id = match_el.data("nextId");
  const next_id2 = match_el.data("nextId2");
  const teams_el = match_el.find(".bracket-item-team");

  const team1_el = teams_el.first();
  const team2_el = teams_el.last();

  const team1_id = team1_el.data("teamId");
  const team2_id = team2_el.data("teamId");

  const status_el = match_el.find(".bracket-item-status");
  const status = status_el.text().match(/(?<points_max>\d+)$/)?.groups?.points_max;
  const points = parseInt(status || "");

  return {
    match_id: parseInt(id),
    next: { winner: next_id || undefined, loser: next_id2 || undefined },
    teams: [team1_id, team2_id],
    winner: team1_el.hasClass(selected) ? team1_id : team2_el.hasClass(selected) ? team2_id : -1,
    max_points: style === "original" ? points : undefined,
  };
}
