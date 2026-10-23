export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type AdvantageType = 'boost' | 'shield' | 'reroll' | 'leap';

export interface AdvantageTile {
  trackIndex: number;
  row: number;
  col: number;
  type: AdvantageType;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Token {
  id: number; // 0, 1, 2, 3
  step: number; // -1: in base, 0..50: common track, 51..55: home runway, 56: home
  isShielded?: boolean; // Protected from 1 capture
}

export interface Player {
  id: string;
  color: PlayerColor;
  name: string;
  isBot: boolean;
  tokens: Token[];
  rank: number | null; // 1 = 1st, 2 = 2nd, 3 = 3rd, 4 = 4th
  stats: {
    captures: number;
    sixesRolled: number;
    tokensHome: number;
    advantagesClaimed?: number;
  };
}

export type GameStatus = 'SETUP' | 'PLAYING' | 'PAUSED' | 'FINISHED';

export interface GridCoord {
  row: number; // 0..14
  col: number; // 0..14
}

export interface GameLogEntry {
  id: string;
  text: string;
  color: PlayerColor;
  type: 'roll' | 'move' | 'capture' | 'home' | 'turn' | 'six' | 'bonus' | 'win' | 'advantage';
  timestamp: number;
}
