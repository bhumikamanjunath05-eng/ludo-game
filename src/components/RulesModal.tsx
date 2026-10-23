import React from 'react';
import { X, Shield, Swords, Dices, Flag, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">How to Play 4-Player Ludo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-600">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Flag size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Objective</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Navigate all 4 of your colored tokens out of base, along the 52-square common track,
                and into your central Home triangle. The first player to bring all 4 tokens home wins!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Dices size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Rolling a Six (6)</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Rolling a 6 allows you to release a token from your base onto the starting square.
                Any roll of 6 also grants you an <strong>extra bonus roll</strong>! Note: Rolling
                three consecutive sixes forfeits that turn.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Safe Star Squares (★)</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                The 4 colored starting squares and 4 star-marked squares are <strong>Safe Zones</strong>.
                Tokens resting on safe squares cannot be captured, and multiple tokens can share
                the square peacefully.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Swords size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Capturing & Knockouts</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Landing on an opponent’s token on any standard square captures that token, sending
                it back to its owner’s base. Capturing an opponent grants an immediate <strong>bonus roll</strong>!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Home Runway & Finishing</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                After completing a full circuit, tokens enter their private colored runway where
                opponents cannot follow. An exact dice count is required to reach the Home triangle.
              </p>
            </div>
          </div>

          {/* Middle Advantages Section */}
          <div className="p-3 bg-gradient-to-r from-cyan-50 via-purple-50 to-pink-50 border border-purple-200/60 rounded-xl space-y-2">
            <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌟</span>
              <span>Middle Board Crossroads Advantages</span>
            </h4>
            <p className="text-xs text-slate-600 leading-snug">
              Special advantage tiles are located at the 4 middle crossroads directly surrounding the center.
              Landing on one activates an immediate perk:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-white/80 border border-cyan-200">
                <span className="font-bold text-cyan-800 flex items-center gap-1">
                  <span>⚡</span> Turbo Boost
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Glides +3 extra squares forward immediately!
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-amber-200">
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <span>🎲</span> Lucky Roll
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Awards an immediate free extra dice roll!
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-purple-200">
                <span className="font-bold text-purple-800 flex items-center gap-1">
                  <span>🛡️</span> Energy Shield
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Absorbs 1 enemy attack, completely preventing capture!
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-pink-200">
                <span className="font-bold text-pink-800 flex items-center gap-1">
                  <span>🌟</span> Super Leap
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5">
                  Warps +4 squares forward across the crossroads!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Got It, Let's Play
          </button>
        </div>
      </div>
    </div>
  );
};
