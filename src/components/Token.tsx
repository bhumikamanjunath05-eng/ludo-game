import React from 'react';
import { PlayerColor } from '../types/ludo';

interface TokenProps {
  color: PlayerColor;
  tokenId: number;
  isValidMove: boolean;
  onClick?: () => void;
  size?: number; // size in px
  stackCount?: number;
  stackIndex?: number;
  disabled?: boolean;
  isShielded?: boolean;
}

const COLOR_MAP: Record<
  PlayerColor,
  {
    bgGradient: string;
    border: string;
    ring: string;
    shadow: string;
    cap: string;
    dot: string;
  }
> = {
  red: {
    bgGradient: 'from-red-500 via-red-600 to-rose-700',
    border: 'border-red-200',
    ring: 'ring-rose-400',
    shadow: 'shadow-red-900/50',
    cap: 'bg-rose-300',
    dot: 'bg-white',
  },
  green: {
    bgGradient: 'from-emerald-400 via-emerald-600 to-teal-700',
    border: 'border-emerald-200',
    ring: 'ring-emerald-400',
    shadow: 'shadow-emerald-900/50',
    cap: 'bg-emerald-200',
    dot: 'bg-white',
  },
  yellow: {
    bgGradient: 'from-amber-300 via-amber-500 to-yellow-600',
    border: 'border-amber-100',
    ring: 'ring-amber-300',
    shadow: 'shadow-amber-900/50',
    cap: 'bg-yellow-100',
    dot: 'bg-amber-950',
  },
  blue: {
    bgGradient: 'from-sky-400 via-blue-600 to-indigo-700',
    border: 'border-sky-200',
    ring: 'ring-sky-400',
    shadow: 'shadow-blue-900/50',
    cap: 'bg-sky-200',
    dot: 'bg-white',
  },
};

export const Token: React.FC<TokenProps> = ({
  color,
  tokenId,
  isValidMove,
  onClick,
  size = 28,
  stackCount = 1,
  stackIndex = 0,
  disabled = false,
  isShielded = false,
}) => {
  const styles = COLOR_MAP[color];

  // If stacked, apply a slight radial offset so all tokens are discernible
  let offsetX = 0;
  let offsetY = 0;
  if (stackCount > 1) {
    const angle = (stackIndex * (2 * Math.PI)) / stackCount;
    const radius = Math.min(size * 0.22, 6);
    offsetX = Math.cos(angle) * radius;
    offsetY = Math.sin(angle) * radius;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isValidMove && !disabled && onClick) {
          onClick();
        }
      }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
      className={`relative select-none transition-all duration-200 rounded-full flex items-center justify-center ${
        isValidMove && !disabled
          ? 'cursor-pointer hover:scale-115 active:scale-95 animate-pulse'
          : 'cursor-default'
      }`}
      title={`${color.toUpperCase()} Token ${tokenId + 1}${isValidMove ? ' (Click to move)' : ''}`}
    >
      {/* Active pulse ring for valid moves */}
      {isValidMove && !disabled && (
        <span
          className={`absolute -inset-1 rounded-full animate-ping opacity-75 ring-2 ${styles.ring}`}
        />
      )}

      {/* Shield Protection Aura */}
      {isShielded && (
        <span
          className="absolute -inset-1 rounded-full ring-2 ring-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)] animate-pulse"
        />
      )}

      {/* Main 3D Pawn Body */}
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br ${styles.bgGradient} border-2 ${styles.border} shadow-lg ${styles.shadow} flex items-center justify-center relative overflow-hidden`}
      >
        {/* Top Gloss highlight */}
        <div className="absolute top-0.5 left-1/4 w-1/2 h-1/3 rounded-full bg-white/40 blur-[0.5px]" />

        {/* Center crown / pawn cap */}
        <div
          className={`w-[45%] h-[45%] rounded-full ${styles.cap} shadow-inner flex items-center justify-center`}
        >
          <div className={`w-[35%] h-[35%] rounded-full ${styles.dot}`} />
        </div>
      </div>

      {/* Shield Mini Badge */}
      {isShielded && (
        <span
          className="absolute -bottom-1 -left-1 text-[10px] leading-none select-none z-10 filter drop-shadow"
          title="Protected by Energy Shield"
        >
          🛡️
        </span>
      )}

      {/* Stack Count Badge if 2 or more on the same square */}
      {stackCount > 1 && stackIndex === stackCount - 1 && (
        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-slate-900 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white leading-none shadow">
          {stackCount}
        </span>
      )}
    </div>
  );
};
