export interface UserPickemInfo {
  user_id: string;
  user: string;
  url: string;
  updated_at: string;
}
export interface AppSettings {
  use: string;
  config_dir: string;
  data_dir: string;
  allow_add_user: boolean;
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

export type CypressUpdateType = "all" | "points" | "teams" | "pickems" | "validate-pickem";
export type RunCypressOptions = { user_entered_url?: string };
export interface CypressConfigFile {
  extends: string;
  env: { main: string; pickem_url: string; pickems: UserPickemInfo[] };
}
