export type AppSettings = {
  use: string;
};

export type TeamsObject = {
  id: string;
  name: string;
};

export type BracketObject = {
  id: number;
  next: { winner: number; loser: number };
  teams: number[];
  winner: number;
};

export type UserBracketObject = {
  id: number;
  next: { winner: number; loser: number };
  teams: number[];
  winner: number;
  points: number;
};

export type StatsObject = { user: string; points: number };
