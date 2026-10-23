import React, { useMemo } from 'react';
import { Player, PlayerColor, Token as TokenType } from '../types/ludo';
import { ADVANTAGE_TILES, getTokenCoordinate } from '../utils/ludoCoordinates';
import { Token } from './Token';

interface BoardProps {
  players: Player[];
  currentTurn: number;
  validTokenIds: number[];
  onTokenClick: (playerIndex: number, tokenId: number) => void;
  isRolling: boolean;
  showAdvantages?: boolean;
}

interface PlacedToken {
  playerIndex: number;
  color: PlayerColor;
  token: TokenType;
  row: number;
  col: number;
  isValid: boolean;
}

export const Board: React.FC<BoardProps> = ({
  players,
  currentTurn,
  validTokenIds,
  onTokenClick,
  isRolling,
  showAdvantages = true,
}) => {
  // Group all tokens by coordinate for proper stacking
  const placedTokens = useMemo(() => {
    const list: PlacedToken[] = [];

    players.forEach((player, pIdx) => {
      const isTurn = pIdx === currentTurn;
      player.tokens.forEach((t) => {
        const coord = getTokenCoordinate(player.color, t.id, t.step);
        const isValid = isTurn && !isRolling && validTokenIds.includes(t.id);
        list.push({
          playerIndex: pIdx,
          color: player.color,
          token: t,
          row: coord.row,
          col: coord.col,
          isValid,
        });
      });
    });

    // Group by rounded grid position
    const cellGroups: Record<string, PlacedToken[]> = {};
    list.forEach((pt) => {
      const key = `${pt.row.toFixed(1)}_${pt.col.toFixed(1)}`;
      if (!cellGroups[key]) cellGroups[key] = [];
      cellGroups[key].push(pt);
    });

    return { list, cellGroups };
  }, [players, currentTurn, validTokenIds, isRolling]);

  // Safe star squares on the 15x15 grid
  const safeStars = [
    { row: 6, col: 1, color: '#ef4444' }, // Red Start
    { row: 2, col: 6, color: '#64748b' }, // Top Safe Star
    { row: 1, col: 8, color: '#10b981' }, // Green Start
    { row: 6, col: 12, color: '#64748b' }, // Right Safe Star
    { row: 8, col: 13, color: '#f59e0b' }, // Yellow Start
    { row: 12, col: 8, color: '#64748b' }, // Bottom Safe Star
    { row: 13, col: 6, color: '#3b82f6' }, // Blue Start
    { row: 8, col: 2, color: '#64748b' }, // Left Safe Star
  ];

  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto bg-amber-50 rounded-2xl p-2 sm:p-3 shadow-xl border-4 border-amber-900/40 select-none">
      {/* SVG Board Rendering */}
      <svg
        viewBox="0 0 1500 1500"
        className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-white border border-slate-300"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Advantage Tile Radial Glows */}
          <radialGradient id="boostGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </radialGradient>
          <radialGradient id="rerollGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
          <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ede9fe" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </radialGradient>
          <radialGradient id="leapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fce7f3" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </radialGradient>
        </defs>

        {/* 1. Base Quadrants (600x600 each) */}
        {/* Red Base: Top-Left (0..600, 0..600) */}
        <rect x="0" y="0" width="600" height="600" fill="url(#redGrad)" />
        <rect x="100" y="100" width="400" height="400" rx="30" fill="#ffffff" />
        <circle cx="210" cy="210" r="54" fill="#fee2e2" stroke="#dc2626" strokeWidth="8" />
        <circle cx="390" cy="210" r="54" fill="#fee2e2" stroke="#dc2626" strokeWidth="8" />
        <circle cx="210" cy="390" r="54" fill="#fee2e2" stroke="#dc2626" strokeWidth="8" />
        <circle cx="390" cy="390" r="54" fill="#fee2e2" stroke="#dc2626" strokeWidth="8" />

        {/* Green Base: Top-Right (900..1500, 0..600) */}
        <rect x="900" y="0" width="600" height="600" fill="url(#greenGrad)" />
        <rect x="1000" y="100" width="400" height="400" rx="30" fill="#ffffff" />
        <circle cx="1110" cy="210" r="54" fill="#d1fae5" stroke="#059669" strokeWidth="8" />
        <circle cx="1290" cy="210" r="54" fill="#d1fae5" stroke="#059669" strokeWidth="8" />
        <circle cx="1110" cy="390" r="54" fill="#d1fae5" stroke="#059669" strokeWidth="8" />
        <circle cx="1290" cy="390" r="54" fill="#d1fae5" stroke="#059669" strokeWidth="8" />

        {/* Yellow Base: Bottom-Right (900..1500, 900..1500) */}
        <rect x="900" y="900" width="600" height="600" fill="url(#yellowGrad)" />
        <rect x="1000" y="1000" width="400" height="400" rx="30" fill="#ffffff" />
        <circle cx="1110" cy="1110" r="54" fill="#fef3c7" stroke="#d97706" strokeWidth="8" />
        <circle cx="1290" cy="1110" r="54" fill="#fef3c7" stroke="#d97706" strokeWidth="8" />
        <circle cx="1110" cy="1290" r="54" fill="#fef3c7" stroke="#d97706" strokeWidth="8" />
        <circle cx="1290" cy="1290" r="54" fill="#fef3c7" stroke="#d97706" strokeWidth="8" />

        {/* Blue Base: Bottom-Left (0..600, 900..1500) */}
        <rect x="0" y="900" width="600" height="600" fill="url(#blueGrad)" />
        <rect x="100" y="1000" width="400" height="400" rx="30" fill="#ffffff" />
        <circle cx="210" cy="1110" r="54" fill="#dbeafe" stroke="#2563eb" strokeWidth="8" />
        <circle cx="390" cy="1110" r="54" fill="#dbeafe" stroke="#2563eb" strokeWidth="8" />
        <circle cx="210" cy="1290" r="54" fill="#dbeafe" stroke="#2563eb" strokeWidth="8" />
        <circle cx="390" cy="1290" r="54" fill="#dbeafe" stroke="#2563eb" strokeWidth="8" />

        {/* 2. Common Track Grid Lines & Color Fills */}
        {Array.from({ length: 15 }).map((_, r) =>
          Array.from({ length: 15 }).map((__, c) => {
            const isCorner =
              (r < 6 && c < 6) ||
              (r < 6 && c >= 9) ||
              (r >= 9 && c < 6) ||
              (r >= 9 && c >= 9);
            const isCenter = r >= 6 && r < 9 && c >= 6 && c < 9;
            if (isCorner || isCenter) return null;

            let fill = '#ffffff';
            let stroke = '#cbd5e1';

            // Home Runways
            if (r === 7 && c >= 1 && c <= 5) fill = '#ef4444';
            else if (c === 7 && r >= 1 && r <= 5) fill = '#10b981';
            else if (r === 7 && c >= 9 && c <= 13) fill = '#f59e0b';
            else if (c === 7 && r >= 9 && r <= 13) fill = '#3b82f6';

            // Starting squares
            if (r === 6 && c === 1) fill = '#fca5a5';
            if (r === 1 && c === 8) fill = '#6ee7b7';
            if (r === 8 && c === 13) fill = '#fde68a';
            if (r === 13 && c === 6) fill = '#93c5fd';

            // Middle Advantage Squares Background
            if (showAdvantages) {
              if (r === 6 && c === 5) fill = 'url(#boostGlow)'; // Turbo Boost
              else if (r === 5 && c === 8) fill = 'url(#rerollGlow)'; // Lucky Roll
              else if (r === 8 && c === 9) fill = 'url(#shieldGlow)'; // Energy Shield
              else if (r === 9 && c === 6) fill = 'url(#leapGlow)'; // Super Leap
            }

            return (
              <rect
                key={`cell_${r}_${c}`}
                x={c * 100}
                y={r * 100}
                width="100"
                height="100"
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
              />
            );
          })
        )}

        {/* 3. Center Triangles */}
        <polygon points="600,600 750,750 600,900" fill="url(#redGrad)" stroke="#b91c1c" strokeWidth="2" />
        <polygon points="600,600 750,750 900,600" fill="url(#greenGrad)" stroke="#047857" strokeWidth="2" />
        <polygon points="900,600 750,750 900,900" fill="url(#yellowGrad)" stroke="#b45309" strokeWidth="2" />
        <polygon points="600,900 750,750 900,900" fill="url(#blueGrad)" stroke="#1d4ed8" strokeWidth="2" />

        {/* Center Golden Ring / Hub */}
        <circle cx="750" cy="750" r="42" fill="#ffffff" stroke="#f59e0b" strokeWidth="4" />
        <text
          x="750"
          y="758"
          textAnchor="middle"
          fontSize="26"
          fontWeight="bold"
          fill="#78350f"
        >
          ★
        </text>

        {/* 4. Safe Star Emblems on Track */}
        {safeStars.map((star, idx) => (
          <g key={`star_${idx}`}>
            <circle
              cx={star.col * 100 + 50}
              cy={star.row * 100 + 50}
              r="28"
              fill="rgba(255, 255, 255, 0.75)"
              stroke={star.color}
              strokeWidth="2"
            />
            <text
              x={star.col * 100 + 50}
              y={star.row * 100 + 58}
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill={star.color}
            >
              ★
            </text>
          </g>
        ))}

        {/* 5. Start Arrows */}
        <path d="M 125,650 L 165,650 M 150,635 L 165,650 L 150,665" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 850,125 L 850,165 M 835,150 L 850,165 L 865,150" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 1375,850 L 1335,850 M 1350,835 L 1335,850 L 1350,865" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 650,1375 L 650,1335 M 635,1350 L 650,1335 L 665,1350" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {/* 6. Middle Advantage Emblems in the Crossroads */}
        {showAdvantages &&
          ADVANTAGE_TILES.map((tile) => (
            <g key={`adv_tile_${tile.trackIndex}`} className="cursor-help">
              {/* Outer pulsing ring */}
              <circle
                cx={tile.col * 100 + 50}
                cy={tile.row * 100 + 50}
                r="38"
                fill="none"
                stroke={tile.color}
                strokeWidth="3"
                strokeDasharray="4 2"
                opacity="0.85"
              />
              {/* Soft inner glow pill */}
              <circle
                cx={tile.col * 100 + 50}
                cy={tile.row * 100 + 50}
                r="28"
                fill="#ffffff"
                stroke={tile.color}
                strokeWidth="2"
              />
              {/* Advantage Icon Symbol */}
              <text
                x={tile.col * 100 + 50}
                y={tile.row * 100 + 58}
                textAnchor="middle"
                fontSize="24"
                className="select-none"
              >
                {tile.icon}
              </text>
              {/* Mini Label */}
              <text
                x={tile.col * 100 + 50}
                y={tile.row * 100 + 90}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill={tile.color}
                letterSpacing="0.5"
              >
                {tile.type.toUpperCase()}
              </text>
            </g>
          ))}
      </svg>

      {/* Dynamic Token Overlay */}
      <div className="absolute inset-2 sm:inset-3 pointer-events-none">
        {placedTokens.list.map((pt) => {
          const key = `${pt.row.toFixed(1)}_${pt.col.toFixed(1)}`;
          const group = placedTokens.cellGroups[key] || [pt];
          const stackCount = group.length;
          const stackIndex = group.findIndex((item) => item.token.id === pt.token.id && item.color === pt.color);

          const leftPercent = ((pt.col + 0.5) / 15) * 100;
          const topPercent = ((pt.row + 0.5) / 15) * 100;

          return (
            <div
              key={`${pt.color}_token_${pt.token.id}`}
              className="absolute pointer-events-auto transition-all duration-300 ease-out"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: pt.isValid ? 40 : 20 + stackIndex,
              }}
            >
              <Token
                color={pt.color}
                tokenId={pt.token.id}
                isValidMove={pt.isValid}
                stackCount={stackCount}
                stackIndex={stackIndex >= 0 ? stackIndex : 0}
                size={stackCount > 1 ? 24 : 28}
                isShielded={pt.token.isShielded}
                onClick={() => onTokenClick(pt.playerIndex, pt.token.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
