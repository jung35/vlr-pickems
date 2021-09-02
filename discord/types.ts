export interface UserPickemInfo {
  user_id: string;
  user: string;
  url: string;
  paid: boolean;
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

export interface LiveBracketGroup<BracketType> {
  group_id: string;
  bracket_list: BracketType[];
}

export interface LiveBracketInfo {
  match_id: number;
  next: { winner: number | string; loser: number | string };
  teams: number[];
  winner: number;
  max_points: number;
}

export interface UserPickemBracketInfo {
  match_id: number;
  next: { winner: number | string | undefined; loser: number | string | undefined };
  teams: number[];
  winner: number | undefined;
}

export interface UserDisplayStats {
  user: undefined | UserPickemInfo;
  points: number;
}

export type CypressUpdateType = "all" | "points" | "teams" | "pickems" | "validate-pickem";
export type RunCypressOptions = { user_entered_url?: string };
export interface CypressConfigFile {
  extends: string;
  env: { main: string; pickem_url: string; pickems: UserPickemInfo[] };
}
