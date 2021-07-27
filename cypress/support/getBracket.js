export default function getBracket(match_el, style = "pickem") {
  const selected = style === "pickem" ? "mod-selected" : "mod-winner";

  const id = match_el.data("currId");
  const next_id = match_el.data("nextId");
  const next_id2 = match_el.data("nextId2");
  const teams_el = match_el.find(".bracket-item-team");

  const team1_el = teams_el.first();
  const team2_el = teams_el.last();

  const team1_id = team1_el.data("teamId");
  const team2_id = team2_el.data("teamId");

  const status_el = match_el.find(".bracket-item-status");
  const status = status_el.text();

  const points = status.includes("?")
    ? -1
    : status_el.find(".winner").length > 0
    ? parseInt(status_el.find(".winner").text())
    : 0;

  return {
    id: id,
    next: { winner: next_id || undefined, loser: next_id2 || undefined },
    teams: [team1_id, team2_id],
    winner: team1_el.hasClass(selected)
      ? team1_id
      : team2_el.hasClass(selected)
      ? team2_id
      : -1,
    points: style === "pickem" ? points : undefined,
  };
}
