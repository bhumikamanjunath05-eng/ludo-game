import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown, RotateCcw, Trophy, Award, Flame, Swords, Dices } from 'lucide-react';
import { Player, PlayerColor } from '../types/ludo';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  winnerRankings: Player[];
  allPlayers: Player[];
  onPlayAgain: () => void;
  onClose: () => void;
}

const COLOR_TEXT: Record<PlayerColor, string> = {
  red: 'text-red-600',
  green: 'text-emerald-600',
  yellow: 'text-amber-600',
  blue: 'text-blue-600',
};

const COLOR_BG: Record<PlayerColor, string> = {
  red: 'bg-red-50 border-red-200',
  green: 'bg-emerald-50 border-emerald-200',
  yellow: 'bg-amber-50 border-amber-200',
  blue: 'bg-blue-50 border-blue-200',
};

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winnerRankings,
  allPlayers,
  onPlayAgain,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      // Multi-stage celebratory confetti
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winner = winnerRankings[0] || allPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="p-6 text-center bg-gradient-to-b from-amber-100 via-amber-50 to-white border-b border-amber-200/50">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-lg mb-3">
            <Trophy size={36} />
          </div>
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block">
            Victory Celebration
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">
            <span className={COLOR_TEXT[winner.color]}>{winner.name}</span> Wins!
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            First player to guide all 4 tokens safely Home.
          </p>
        </div>

        {/* Podium Standings */}
        <div className="p-5 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Final Standings & Statistics
          </h3>

          {/* Sorted standings: ranked players first, then unranked sorted by tokens home */}
          {[...allPlayers]
            .sort((a, b) => {
              if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
              if (a.rank !== null) return -1;
              if (b.rank !== null) return 1;
              const aHome = a.tokens.filter((t) => t.step === 56).length;
              const bHome = b.tokens.filter((t) => t.step === 56).length;
              return bHome - aHome;
            })
            .map((player, idx) => {
              const homeCount = player.tokens.filter((t) => t.step === 56).length;
              return (
                <div
                  key={`standing_${player.id}`}
                  className={`flex items-center justify-between p-2.5 rounded-xl border ${COLOR_BG[player.color]} transition-transform`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx === 0 ? <Crown size={14} className="text-amber-400" /> : `#${idx + 1}`}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{player.name}</h4>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {player.color} · User
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-600 shrink-0">
                    <span title="Tokens in Home" className="flex items-center gap-0.5 font-bold text-emerald-600">
                      <Award size={12} /> {homeCount}/4
                    </span>
                    <span title="Captures" className="flex items-center gap-0.5 text-slate-500">
                      <Swords size={12} /> {player.stats.captures}
                    </span>
                    <span title="Sixes Rolled" className="flex items-center gap-0.5 text-slate-500">
                      <Dices size={12} /> {player.stats.sixesRolled}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Review Board
          </button>
          <button
            onClick={onPlayAgain}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
