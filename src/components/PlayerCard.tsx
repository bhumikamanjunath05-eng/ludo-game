import React from 'react';
import { Bot, Crown, Sparkles, User } from 'lucide-react';
import { Player, PlayerColor } from '../types/ludo';
import { Token } from './Token';

interface PlayerCardProps {
  player: Player;
  playerIndex: number;
  isCurrentTurn: boolean;
  validTokenIds: number[];
  onTokenClick: (tokenId: number) => void;
  isRolling: boolean;
}

const COLOR_ACCENTS: Record<
  PlayerColor,
  {
    border: string;
    activeBorder: string;
    bg: string;
    text: string;
    indicator: string;
    glow: string;
  }
> = {
  red: {
    border: 'border-red-200',
    activeBorder: 'border-red-500',
    bg: 'bg-red-50/70',
    text: 'text-red-700',
    indicator: 'bg-red-500',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.25)]',
  },
  green: {
    border: 'border-emerald-200',
    activeBorder: 'border-emerald-500',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-700',
    indicator: 'bg-emerald-500',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
  },
  yellow: {
    border: 'border-amber-200',
    activeBorder: 'border-amber-500',
    bg: 'bg-amber-50/70',
    text: 'text-amber-800',
    indicator: 'bg-amber-500',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
  },
  blue: {
    border: 'border-blue-200',
    activeBorder: 'border-blue-500',
    bg: 'bg-blue-50/70',
    text: 'text-blue-700',
    indicator: 'bg-blue-500',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
  },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  playerIndex,
  isCurrentTurn,
  validTokenIds,
  onTokenClick,
  isRolling,
}) => {
  const accent = COLOR_ACCENTS[player.color];
  const finishedTokensCount = player.tokens.filter((t) => t.step === 56).length;
  const inPlayTokensCount = player.tokens.filter((t) => t.step >= 0 && t.step < 56).length;
  const inBaseTokensCount = player.tokens.filter((t) => t.step === -1).length;

  return (
    <div
      className={`relative p-3 rounded-xl border transition-all duration-300 ${
        isCurrentTurn
          ? `bg-white ${accent.activeBorder} ${accent.glow} ring-2 ring-${player.color}-400/50`
          : `${accent.bg} ${accent.border} opacity-85 hover:opacity-100`
      }`}
    >
      {/* Turn indicator ribbon */}
      {isCurrentTurn && (
        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-slate-900 shadow-sm flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${accent.indicator}`} />
          Active Turn
        </div>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 ${accent.indicator}`}
          >
            <User size={14} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">{player.name}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="capitalize">{player.color}</span>
              <span>·</span>
              <span>Player {playerIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Rank / Finished badge */}
        {player.rank !== null ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold">
            <Crown size={12} className="text-amber-600" />
            <span>#{player.rank} Place</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
            <span className="font-semibold text-emerald-600">{finishedTokensCount}</span>/4 Home
          </div>
        )}
      </div>

      {/* 4 Tokens overview & click targets */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-200/60">
        {player.tokens.map((token) => {
          const isValid = isCurrentTurn && !isRolling && validTokenIds.includes(token.id);
          let statusText = 'Base';
          if (token.step === 56) statusText = 'Home';
          else if (token.step >= 51) statusText = `${token.step - 50}/5`;
          else if (token.step >= 0) statusText = `${token.step}`;

          return (
            <button
              key={`card_token_${player.color}_${token.id}`}
              onClick={() => {
                if (isValid) onTokenClick(token.id);
              }}
              disabled={!isValid}
              className={`flex flex-col items-center p-1 rounded-lg border transition-all ${
                isValid
                  ? 'bg-amber-50 border-amber-400 shadow-sm cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-white/60 border-slate-200/80 cursor-default'
              }`}
              title={
                isValid
                  ? `Token ${token.id + 1} can move! Click to move.`
                  : `Token ${token.id + 1}: ${statusText}`
              }
            >
              <Token
                color={player.color}
                tokenId={token.id}
                isValidMove={isValid}
                size={22}
                disabled={!isValid}
              />
              <span
                className={`text-[9px] mt-1 font-mono tabular-nums ${
                  token.step === 56
                    ? 'text-emerald-600 font-bold'
                    : isValid
                    ? 'text-amber-700 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {statusText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stats summary footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-200/40 font-mono">
        <span>Base: {inBaseTokensCount}</span>
        <span>Track: {inPlayTokensCount}</span>
        <span>Kills: {player.stats.captures}</span>
      </div>
    </div>
  );
};
