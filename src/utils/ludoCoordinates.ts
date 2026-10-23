import { GridCoord, PlayerColor } from '../types/ludo';

// 52 Common Track Cells in clockwise order
export const COMMON_TRACK: GridCoord[] = [
  /* 0  - Red Start (Safe) */ { row: 6, col: 1 },
  /* 1 */ { row: 6, col: 2 },
  /* 2 */ { row: 6, col: 3 },
  /* 3 */ { row: 6, col: 4 },
  /* 4 */ { row: 6, col: 5 },
  /* 5 */ { row: 5, col: 6 },
  /* 6 */ { row: 4, col: 6 },
  /* 7 */ { row: 3, col: 6 },
  /* 8  - Safe Star */ { row: 2, col: 6 },
  /* 9 */ { row: 1, col: 6 },
  /* 10 */ { row: 0, col: 6 },
  /* 11 */ { row: 0, col: 7 },
  /* 12 */ { row: 0, col: 8 },
  /* 13 - Green Start (Safe) */ { row: 1, col: 8 },
  /* 14 */ { row: 2, col: 8 },
  /* 15 */ { row: 3, col: 8 },
  /* 16 */ { row: 4, col: 8 },
  /* 17 */ { row: 5, col: 8 },
  /* 18 */ { row: 6, col: 9 },
  /* 19 */ { row: 6, col: 10 },
  /* 20 */ { row: 6, col: 11 },
  /* 21 - Safe Star */ { row: 6, col: 12 },
  /* 22 */ { row: 6, col: 13 },
  /* 23 */ { row: 6, col: 14 },
  /* 24 */ { row: 7, col: 14 },
  /* 25 */ { row: 8, col: 14 },
  /* 26 - Yellow Start (Safe) */ { row: 8, col: 13 },
  /* 27 */ { row: 8, col: 12 },
  /* 28 */ { row: 8, col: 11 },
  /* 29 */ { row: 8, col: 10 },
  /* 30 */ { row: 8, col: 9 },
  /* 31 */ { row: 9, col: 8 },
  /* 32 */ { row: 10, col: 8 },
  /* 33 */ { row: 11, col: 8 },
  /* 34 - Safe Star */ { row: 12, col: 8 },
  /* 35 */ { row: 13, col: 8 },
  /* 36 */ { row: 14, col: 8 },
  /* 37 */ { row: 14, col: 7 },
  /* 38 */ { row: 14, col: 6 },
  /* 39 - Blue Start (Safe) */ { row: 13, col: 6 },
  /* 40 */ { row: 12, col: 6 },
  /* 41 */ { row: 11, col: 6 },
  /* 42 */ { row: 10, col: 6 },
  /* 43 */ { row: 9, col: 6 },
  /* 44 */ { row: 8, col: 5 },
  /* 45 */ { row: 8, col: 4 },
  /* 46 */ { row: 8, col: 3 },
  /* 47 - Safe Star */ { row: 8, col: 2 },
  /* 48 */ { row: 8, col: 1 },
  /* 49 */ { row: 8, col: 0 },
  /* 50 */ { row: 7, col: 0 },
  /* 51 */ { row: 6, col: 0 },
];

// Start offsets in COMMON_TRACK for each player
export const COLOR_START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Safe squares on the common track (indices)
export const SAFE_TRACK_INDICES = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// 4 Advantage Tiles strategically placed at the 4 Middle Crossroads around the center
export const ADVANTAGE_TILES = [
  {
    trackIndex: 4,
    row: 6,
    col: 5,
    type: 'boost' as const,
    title: 'Turbo Boost',
    description: '+3 Extra Steps forward',
    icon: '⚡',
    color: '#06b6d4',
  },
  {
    trackIndex: 17,
    row: 5,
    col: 8,
    type: 'reroll' as const,
    title: 'Lucky Roll',
    description: 'Immediate Free Bonus Roll',
    icon: '🎲',
    color: '#f59e0b',
  },
  {
    trackIndex: 30,
    row: 8,
    col: 9,
    type: 'shield' as const,
    title: 'Energy Shield',
    description: 'Immunity against 1 opponent attack',
    icon: '🛡️',
    color: '#8b5cf6',
  },
  {
    trackIndex: 43,
    row: 9,
    col: 6,
    type: 'leap' as const,
    title: 'Super Leap',
    description: '+4 Crossroads Warp Leap',
    icon: '🌟',
    color: '#ec4899',
  },
];

export function getAdvantageAtTrackIndex(trackIndex: number) {
  return ADVANTAGE_TILES.find((tile) => tile.trackIndex === trackIndex) || null;
}

// 5 Home Runway Squares for each color
export const HOME_RUNWAY: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 7, col: 1 },
    { row: 7, col: 2 },
    { row: 7, col: 3 },
    { row: 7, col: 4 },
    { row: 7, col: 5 },
  ],
  green: [
    { row: 1, col: 7 },
    { row: 2, col: 7 },
    { row: 3, col: 7 },
    { row: 4, col: 7 },
    { row: 5, col: 7 },
  ],
  yellow: [
    { row: 7, col: 13 },
    { row: 7, col: 12 },
    { row: 7, col: 11 },
    { row: 7, col: 10 },
    { row: 7, col: 9 },
  ],
  blue: [
    { row: 13, col: 7 },
    { row: 12, col: 7 },
    { row: 11, col: 7 },
    { row: 10, col: 7 },
    { row: 9, col: 7 },
  ],
};

// Home Base coordinates for the 4 tokens of each player
export const BASE_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 1.6, col: 1.6 },
    { row: 1.6, col: 3.4 },
    { row: 3.4, col: 1.6 },
    { row: 3.4, col: 3.4 },
  ],
  green: [
    { row: 1.6, col: 10.6 },
    { row: 1.6, col: 12.4 },
    { row: 3.4, col: 10.6 },
    { row: 3.4, col: 12.4 },
  ],
  yellow: [
    { row: 10.6, col: 10.6 },
    { row: 10.6, col: 12.4 },
    { row: 12.4, col: 10.6 },
    { row: 12.4, col: 12.4 },
  ],
  blue: [
    { row: 10.6, col: 1.6 },
    { row: 10.6, col: 3.4 },
    { row: 12.4, col: 1.6 },
    { row: 12.4, col: 3.4 },
  ],
};

// Center triangle positions for finished tokens (step 56)
export const FINISH_COORDS: Record<PlayerColor, GridCoord[]> = {
  red: [
    { row: 6.8, col: 6.3 },
    { row: 7.2, col: 6.3 },
    { row: 6.8, col: 6.6 },
    { row: 7.2, col: 6.6 },
  ],
  green: [
    { row: 6.3, col: 6.8 },
    { row: 6.3, col: 7.2 },
    { row: 6.6, col: 6.8 },
    { row: 6.6, col: 7.2 },
  ],
  yellow: [
    { row: 6.8, col: 7.4 },
    { row: 7.2, col: 7.4 },
    { row: 6.8, col: 7.7 },
    { row: 7.2, col: 7.7 },
  ],
  blue: [
    { row: 7.4, col: 6.8 },
    { row: 7.4, col: 7.2 },
    { row: 7.7, col: 6.8 },
    { row: 7.7, col: 7.2 },
  ],
};

/**
 * Returns exact board coordinates for a token given its player color, id, and current step.
 */
export function getTokenCoordinate(color: PlayerColor, tokenId: number, step: number): GridCoord {
  // In base
  if (step === -1) {
    return BASE_COORDS[color][tokenId];
  }
  // Finished in Home triangle
  if (step === 56) {
    return FINISH_COORDS[color][tokenId];
  }
  // Home Runway
  if (step >= 51 && step <= 55) {
    const runwayIdx = step - 51;
    return HOME_RUNWAY[color][runwayIdx];
  }
  // On common track (steps 0..50)
  const startIndex = COLOR_START_INDEX[color];
  const globalTrackIdx = (startIndex + step) % 52;
  return COMMON_TRACK[globalTrackIdx];
}

/**
 * Checks if a token at step `s` is on a safe square.
 */
export function isTokenOnSafeSquare(color: PlayerColor, step: number): boolean {
  if (step < 0 || step > 50) return true; // Base, runway, or home are always safe
  const startIndex = COLOR_START_INDEX[color];
  const globalTrackIdx = (startIndex + step) % 52;
  return SAFE_TRACK_INDICES.has(globalTrackIdx);
}

/**
 * Gets the global common track index for a token if on common track, or null.
 */
export function getGlobalTrackIndex(color: PlayerColor, step: number): number | null {
  if (step >= 0 && step <= 50) {
    const startIndex = COLOR_START_INDEX[color];
    return (startIndex + step) % 52;
  }
  return null;
}
