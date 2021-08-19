export interface UserPickemInfo {
  user: string;
  url: string;
}

export interface AppSettings {
  use: string;
}

export interface ValorantTeam {
  id: string;
  name: string;
}

export interface LiveBracketInfo {
  id: number;
  next: { winner: number; loser: number };
  teams: number[];
  winner: number;
  max_points: number;
}

export interface UserPickemBracketInfo {
  id: number;
  next: { winner: number | undefined; loser: number | undefined };
  teams: number[];
  winner: number | undefined;
}

export interface UserDisplayStats {
  user: string;
  points: number;
}

export type CypressUpdateType = "all" | "points" | "teams" | "pickems";
